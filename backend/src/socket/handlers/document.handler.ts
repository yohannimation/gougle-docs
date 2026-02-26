import { Server, Socket } from 'socket.io';
import { DocumentStateManager } from '../managers/DocumentState.manager';
import { PersistenceManager } from '../managers/Persistence.manager';
import { UserManager } from '../managers/User.manager';
import { YjsOperations } from '../managers/YjsOperations.manager';
import {
    JoinDocumentPayload,
    DocumentUpdatePayload,
    AwarenessUpdatePayload,
    LeaveDocumentPayload,
} from '../../types/collaboration.types';

// Singletons
const stateManager = new DocumentStateManager();
const persistenceManager = new PersistenceManager();
const userManager = new UserManager();
const yjsOps = new YjsOperations();

export function documentHandler(io: Server, socket: Socket): void {
    // ── Join Document ─────────────────────────────────────────────────────────
    socket.on('join-document', async (payload: JoinDocumentPayload) => {
        const { documentId, username, userColor } = payload;

        console.log(`${socket.id} (${username}) → "${documentId}"`);

        const state = stateManager.getOrCreate(documentId);
        userManager.addUser(state, socket.id, username, userColor);
        socket.join(documentId);

        // Load from the DB if Y.Doc is empty
        if (yjsOps.isEmpty(state.ydoc)) {
            await yjsOps.loadFromDatabase(documentId, state.ydoc);
        }

        // Send the current state
        const currentState = yjsOps.getCurrentState(state.ydoc);
        socket.emit('document-sync', { update: currentState });

        // Send the user list
        userManager.broadcastUsers(io, documentId, state);
    });

    // ── Document Update ───────────────────────────────────────────────────────
    socket.on('document-update', (payload: DocumentUpdatePayload) => {
        const { documentId, update } = payload;
        const state = stateManager.get(documentId);
        if (!state) return;

        yjsOps.applyUpdate(state.ydoc, update);
        socket.to(documentId).emit('document-update', { update });
        persistenceManager.schedule(documentId, state);
    });

    // ── Awareness Update ──────────────────────────────────────────────────────
    socket.on('awareness-update', (payload: AwarenessUpdatePayload) => {
        const { documentId, update } = payload;
        socket.to(documentId).emit('awareness-update', { update });
    });

    // ── Leave Document ────────────────────────────────────────────────────────
    socket.on('leave-document', async (payload: LeaveDocumentPayload) => {
        await handleLeave(payload.documentId, socket.id);
    });

    // ── Disconnect ────────────────────────────────────────────────────────────
    socket.on('disconnect', async () => {
        for (const [documentId, state] of stateManager.entries()) {
            if (state.clients.has(socket.id)) {
                await handleLeave(documentId, socket.id);
            }
        }
    });

    // ── Helper: Handle Leave ──────────────────────────────────────────────────
    async function handleLeave(
        documentId: string,
        socketId: string
    ): Promise<void> {
        const state = stateManager.get(documentId);
        if (!state) return;

        userManager.removeUser(state, socketId);
        socket.leave(documentId);

        console.log(
            `${socketId} ✕ "${documentId}" (${userManager.getUserCount(
                state
            )} remaining)`
        );

        // User list update
        if (userManager.getUserCount(state) > 0) {
            userManager.broadcastUsers(io, documentId, state);
        }

        // Last user -> persist and clean memory
        if (userManager.getUserCount(state) === 0) {
            await persistenceManager.persist(documentId, state);
            stateManager.delete(documentId);
            console.log(`Document "${documentId}" dump`);
        }
    }
}
