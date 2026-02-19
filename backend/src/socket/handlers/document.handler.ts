import { Server, Socket } from 'socket.io';
import * as Y from 'yjs';
import documentService from '../../services/documents.service';

const DEBOUNCE_MIN_MS = 1000; // Inactivity delay before persistence
const DEBOUNCE_MAX_MS = 3000; // Persistence force after this delay

// Local document state
interface DocState {
    ydoc: Y.Doc;
    clients: Set<string>;
    debounceTimer: NodeJS.Timeout | null;
    maxTimer: NodeJS.Timeout | null;
    pendingSave: boolean;
}

const docStates = new Map<string, DocState>();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getOrCreateDocState(documentId: string): DocState {
    if (!docStates.has(documentId)) {
        docStates.set(documentId, {
            ydoc: new Y.Doc(),
            clients: new Set(),
            debounceTimer: null,
            maxTimer: null,
            pendingSave: false,
        });
    }
    return docStates.get(documentId)!;
}

/** Persist Y.Doc in database */
async function persistDocument(
    documentId: string,
    state: DocState
): Promise<void> {
    if (!state.pendingSave) return;

    // Remove timers
    if (state.debounceTimer) {
        clearTimeout(state.debounceTimer);
        state.debounceTimer = null;
    }
    if (state.maxTimer) {
        clearTimeout(state.maxTimer);
        state.maxTimer = null;
    }

    state.pendingSave = false;

    try {
        const update = Y.encodeStateAsUpdate(state.ydoc);
        await documentService.saveYDoc(documentId, Buffer.from(update));
        console.log(`[Socket] Document "${documentId}" persisté`);
    } catch (err) {
        console.error(`[Socket] Erreur persistance "${documentId}" :`, err);
    }
}

/** Schedule persist with min/max debounce */
function schedulePersist(documentId: string, state: DocState): void {
    // First update -> prepare the max timer
    if (!state.pendingSave) {
        state.pendingSave = true;
        state.maxTimer = setTimeout(
            () => persistDocument(documentId, state),
            DEBOUNCE_MAX_MS
        );
    }

    // Reset the min timer for each update
    if (state.debounceTimer) clearTimeout(state.debounceTimer);
    state.debounceTimer = setTimeout(
        () => persistDocument(documentId, state),
        DEBOUNCE_MIN_MS
    );
}

// ─── Handler principal ────────────────────────────────────────────────────────

export function documentHandler(io: Server, socket: Socket) {
    socket.on('join-document', async ({ documentId, userName, userColor }) => {
        console.log(`📄 ${socket.id} joining document ${documentId}`);

        const state = getOrCreateDocState(documentId);
        state.clients.add(socket.id);
        socket.join(documentId);

        // Load the document from the database if the Y.Doc is empty
        const isEmpty = Y.encodeStateAsUpdate(state.ydoc).length <= 2;
        if (isEmpty) {
            const savedYDoc = await documentService.loadYDoc(documentId);
            if (savedYDoc) {
                Y.applyUpdate(state.ydoc, savedYDoc);
                console.log(
                    `[Socket] Document "${documentId}" chargé depuis la DB`
                );
            }
        }

        // Send Y.js current state to the new client
        const currentState = Y.encodeStateAsUpdate(state.ydoc);
        socket.emit('document-sync', { update: Array.from(currentState) });

        // Notify other clients
        socket.to(documentId).emit('user-joined', {
            userId: socket.id,
            userName,
            userColor,
        });
    });

    // ── Receive and broadcast a Y.js update ─────────────────────────
    socket.on('document-update', ({ documentId, update }) => {
        const state = docStates.get(documentId);
        if (!state) return;

        // Apply on the Y.Doc server
        const updateBuffer = new Uint8Array(update);
        Y.applyUpdate(state.ydoc, updateBuffer);

        // Broadcast other clients
        socket.to(documentId).emit('document-update', { update });

        // Schedule the persistence
        schedulePersist(documentId, state);
    });

    // ── Leave a document ──────────────────────────────────────────────────
    socket.on('leave-document', async ({ documentId }) => {
        await handleLeave(documentId, socket.id);
    });

    // ── Disconnection ──────────────────────────────────────────────────────────
    socket.on('disconnect', async () => {
        for (const [documentId, state] of docStates.entries()) {
            if (state.clients.has(socket.id)) {
                await handleLeave(documentId, socket.id);
            }
        }
    });

    // ─────────────────────────────────────────────────────────────────────────

    async function handleLeave(documentId: string, socketId: string) {
        const state = docStates.get(documentId);
        if (!state) return;

        state.clients.delete(socketId);
        socket.leave(documentId);
        socket.to(documentId).emit('user-left', { userId: socketId });

        console.log(
            `📄 ${socketId} left "${documentId}" (${state.clients.size} remaining)`
        );

        // Last client leaved -> persist and clear the memory
        if (state.clients.size === 0) {
            await persistDocument(documentId, state);
            docStates.delete(documentId);
            console.log(
                `[Socket] Document "${documentId}" déchargé de la mémoire`
            );
        }
    }
}
