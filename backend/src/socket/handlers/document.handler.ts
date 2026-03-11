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

import { validate as isValidUUID } from 'uuid';

// Singletons
const stateManager = new DocumentStateManager();
const persistenceManager = new PersistenceManager();
const userManager = new UserManager();
const yjsOps = new YjsOperations();

const MAX_UPDATE_SIZE = 1024 * 1024;

export function documentHandler(io: Server, socket: Socket): void {
    // ── Join Document ─────────────────────────────────────────────────────────
    socket.on('join-document', async (payload: JoinDocumentPayload) => {
        try {
            const { documentId, username, userColor } = payload;

            if (!documentId || !isValidUUID(documentId)) {
                socket.emit('error', { message: 'Invalid document ID' });
                return;
            }

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
        } catch (error) {
            console.error('[Socket] Error in join-document:', error);
            socket.emit('error', {
                message:
                    error instanceof Error
                        ? error.message
                        : 'Failed to join document',
            });
        }
    });

    // ── Document Update ───────────────────────────────────────────────────────
    socket.on('document-update', (payload: DocumentUpdatePayload) => {
        try {
            const { documentId, update } = payload;

            if (!documentId || !isValidUUID(documentId)) {
                socket.emit('error', { message: 'Invalid document ID' });
                return;
            }
            if (!Array.isArray(update)) {
                socket.emit('error', { message: 'Invalid update format' });
                return;
            }
            if (update.length > MAX_UPDATE_SIZE) {
                socket.emit('error', { message: 'Update too large' });
                return;
            }

            const state = stateManager.get(documentId);
            if (!state) {
                socket.emit('error', { message: 'Document state not found' });
                return;
            }
            if (!state.clients.has(socket.id)) {
                socket.emit('error', {
                    message: 'Not authorized for this document',
                });
                return;
            }

            yjsOps.applyUpdate(state.ydoc, update);
            socket.to(documentId).emit('document-update', { update });
            persistenceManager.schedule(documentId, state);
        } catch (error) {
            console.error('[Socket] Error in document-update:', error);
            socket.emit('error', { message: 'Failed to update document' });
        }
    });

    // ── Awareness Update ──────────────────────────────────────────────────────
    socket.on('awareness-update', (payload: AwarenessUpdatePayload) => {
        try {
            const { documentId, update } = payload;

            if (!documentId || !isValidUUID(documentId)) {
                socket.emit('error', { message: 'Invalid document ID' });
                return;
            }
            if (!Array.isArray(update)) {
                socket.emit('error', { message: 'Invalid update format' });
                return;
            }
            if (update.length > MAX_UPDATE_SIZE) {
                socket.emit('error', { message: 'Update too large' });
                return;
            }

            socket.to(documentId).emit('awareness-update', { update });
        } catch (error) {
            console.error('[Socket] Error in awareness-update:', error);
        }
    });

    // ── Leave Document ────────────────────────────────────────────────────────
    socket.on('leave-document', async (payload: LeaveDocumentPayload) => {
        try {
            const { documentId } = payload;

            if (!documentId || !isValidUUID(documentId)) {
                socket.emit('error', { message: 'Invalid document ID' });
                return;
            }

            await handleLeave(documentId, socket.id);
        } catch (error) {
            console.error('[Socket] Error in leave-document:', error);
        }
    });

    // ── Disconnect ────────────────────────────────────────────────────────────
    socket.on('disconnect', async () => {
        try {
            for (const [documentId, state] of stateManager.entries()) {
                if (state.clients.has(socket.id)) {
                    await handleLeave(documentId, socket.id);
                }
            }
        } catch (error) {
            console.error('[Socket] Error in disconnect:', error);
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
