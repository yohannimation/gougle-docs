// hooks/useTiptapCollaboration.ts
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import * as Y from 'yjs';

export type ConnectionStatus =
    | 'connecting'
    | 'connected'
    | 'disconnected'
    | 'error';

interface UseTiptapCollaborationOptions {
    /** ID du document à synchroniser */
    docId: string;
    /** URL du serveur Socket.io, ex: http://localhost:3001 */
    socketUrl: string;
    /** Nom d'utilisateur pour la collaboration */
    userName?: string;
    /** Couleur du curseur (hex) */
    userColor?: string;
}

interface UseTiptapCollaborationReturn {
    /** Y.Doc partagé à passer à Collaboration.configure({ document }) */
    ydoc: Y.Doc | null;
    /** État de la connexion Socket.io */
    connectionStatus: ConnectionStatus;
    /** Socket.io instance (pour awareness si besoin) */
    socket: Socket | null;
}

/**
 * Hook gérant la connexion Socket.io et la synchro Y.js.
 *
 * Utilisation dans useEditor :
 *   const { ydoc } = useTiptapCollaboration({ docId, socketUrl });
 *
 *   extensions: [
 *     Collaboration.configure({ document: ydoc }),
 *     ...
 *   ]
 */
export function useTiptapCollaboration({
    docId,
    socketUrl,
    userName = 'Anonymous',
    userColor = '#' + Math.floor(Math.random() * 16777215).toString(16),
}: UseTiptapCollaborationOptions): UseTiptapCollaborationReturn {
    const [connectionStatus, setConnectionStatus] =
        useState<ConnectionStatus>('connecting');

    const socketRef = useRef<Socket | null>(null);
    // Créer le Y.Doc UNE SEULE FOIS et garder la même référence
    const ydocRef = useRef<Y.Doc>(new Y.Doc());
    const syncedRef = useRef(false);

    useEffect(() => {
        if (!docId || !socketUrl) return;

        const ydoc = ydocRef.current;

        // Connexion Socket.io
        const socket = io(socketUrl, {
            transports: ['websocket'],
            reconnection: true,
        });
        socketRef.current = socket;

        // ── Gestion de la connexion ──────────────────────────────────────────
        socket.on('connect', () => {
            console.log('[Socket.io] Connecté');
            setConnectionStatus('connected');

            // Rejoindre le document
            socket.emit('join-document', {
                documentId: docId,
                userName,
                userColor,
            });
        });

        socket.on('disconnect', () => {
            console.log('[Socket.io] Déconnecté');
            setConnectionStatus('disconnected');
            syncedRef.current = false;
        });

        socket.on('connect_error', (err) => {
            console.error('[Socket.io] Erreur de connexion :', err);
            setConnectionStatus('error');
        });

        // ── Synchro Y.js ──────────────────────────────────────────────────────

        // Recevoir l'état initial du serveur
        socket.on('document-sync', ({ update }) => {
            console.log('[Y.js] Synchronisation initiale reçue');
            const updateBuffer = new Uint8Array(update);
            Y.applyUpdate(ydoc, updateBuffer);
            syncedRef.current = true;
        });

        // Recevoir les mises à jour des autres clients
        socket.on('document-update', ({ update }) => {
            const updateBuffer = new Uint8Array(update);
            Y.applyUpdate(ydoc, updateBuffer);
        });

        // Envoyer les mises à jour locales au serveur
        const onUpdate = (update: Uint8Array, origin: any) => {
            // Ne pas renvoyer les updates qu'on vient de recevoir
            if (origin !== 'remote' && syncedRef.current) {
                socket.emit('document-update', {
                    documentId: docId,
                    update: Array.from(update),
                });
            }
        };
        ydoc.on('update', onUpdate);

        // ── Présence (optionnel) ──────────────────────────────────────────────
        socket.on(
            'user-joined',
            ({ userId, userName: name, userColor: color }) => {
                console.log(`[Présence] ${name} a rejoint le document`);
            }
        );

        socket.on('user-left', ({ userId }) => {
            console.log(`[Présence] Utilisateur ${userId} a quitté`);
        });

        // ── Nettoyage ─────────────────────────────────────────────────────────
        return () => {
            ydoc.off('update', onUpdate);
            socket.emit('leave-document', { documentId: docId });
            socket.disconnect();
            socketRef.current = null;
        };
    }, [docId, socketUrl]); // Enlever userName et userColor des dépendances

    return {
        ydoc: ydocRef.current,
        connectionStatus,
        socket: socketRef.current,
    };
}
