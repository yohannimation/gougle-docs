// src/socket/handlers/document.handler.ts
import { Server, Socket } from 'socket.io';
import * as Y from 'yjs';
import documentService from '../../services/documents.service';

// ─── Constantes debounce ──────────────────────────────────────────────────────
const DEBOUNCE_MIN_MS = 1_000; // Inactivité avant persistance
const DEBOUNCE_MAX_MS = 3_000; // Persistance forcée après ce délai

// ─── État en mémoire par document ─────────────────────────────────────────────
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

/** Persiste le Y.Doc en DB */
async function persistDocument(
    documentId: string,
    state: DocState
): Promise<void> {
    if (!state.pendingSave) return;

    // Annuler les timers
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

/** Planifie une persistance avec debounce min/max */
function schedulePersist(documentId: string, state: DocState): void {
    // Premier changement → armer le timer max
    if (!state.pendingSave) {
        state.pendingSave = true;
        state.maxTimer = setTimeout(
            () => persistDocument(documentId, state),
            DEBOUNCE_MAX_MS
        );
    }

    // Réarmer le timer min à chaque update
    if (state.debounceTimer) clearTimeout(state.debounceTimer);
    state.debounceTimer = setTimeout(
        () => persistDocument(documentId, state),
        DEBOUNCE_MIN_MS
    );
}

// ─── Handler principal ────────────────────────────────────────────────────────

export function documentHandler(io: Server, socket: Socket) {
    // ── Rejoindre un document ────────────────────────────────────────────────
    socket.on('join-document', async ({ documentId, userName, userColor }) => {
        console.log(`📄 ${socket.id} joining document ${documentId}`);

        const state = getOrCreateDocState(documentId);
        state.clients.add(socket.id);
        socket.join(documentId);

        // Charger depuis la DB si Y.Doc vide (premier client)
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

        // Envoyer l'état Y.js courant au nouveau client
        const currentState = Y.encodeStateAsUpdate(state.ydoc);
        socket.emit('document-sync', { update: Array.from(currentState) });

        // Notifier les autres clients
        socket.to(documentId).emit('user-joined', {
            userId: socket.id,
            userName,
            userColor,
        });
    });

    // ── Recevoir et broadcaster une mise à jour Y.js ─────────────────────────
    socket.on('document-update', ({ documentId, update }) => {
        const state = docStates.get(documentId);
        if (!state) return;

        // Appliquer sur le Y.Doc serveur
        const updateBuffer = new Uint8Array(update);
        Y.applyUpdate(state.ydoc, updateBuffer);

        // Broadcaster aux autres clients
        socket.to(documentId).emit('document-update', { update });

        // Planifier la persistance
        schedulePersist(documentId, state);
    });

    // ── Quitter un document ──────────────────────────────────────────────────
    socket.on('leave-document', async ({ documentId }) => {
        await handleLeave(documentId, socket.id);
    });

    // ── Déconnexion ──────────────────────────────────────────────────────────
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

        // Dernier client parti → persister et libérer
        if (state.clients.size === 0) {
            await persistDocument(documentId, state);
            docStates.delete(documentId);
            console.log(
                `[Socket] Document "${documentId}" déchargé de la mémoire`
            );
        }
    }
}
