import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import * as Y from 'yjs';

export type ConnectionStatus =
    | 'connecting'
    | 'connected'
    | 'disconnected'
    | 'error';

export interface User {
    username: string;
    userColor: string;
}

interface UseTiptapCollaborationOptions {
    /** Document ID to synchronize */
    docId: string;
    /** Socket.io server URL, ex: http://localhost:3001 */
    socketUrl: string;
    /** User name for the collaboration */
    username?: string;
    /** Cursor color (hex) */
    userColor?: string;
}

interface UseTiptapCollaborationReturn {
    /** Y.Doc shared to give at Collaboration.configure({ document }) */
    ydoc: Y.Doc | null;
    /** Socket.io state */
    connectionStatus: ConnectionStatus;
    /** Socket.io instance (for awareness if needed) */
    socket: Socket | null;
    /** Users data */
    users: User[];
}

/**
 * Hook managing the Socket.io connection and Y.js synchronization.
 */
export function useTiptapCollaboration({
    docId,
    socketUrl,
    username = 'Anonymous',
    userColor = '#' + Math.floor(Math.random() * 16777215).toString(16),
}: UseTiptapCollaborationOptions): UseTiptapCollaborationReturn {
    const [connectionStatus, setConnectionStatus] =
        useState<ConnectionStatus>('connecting');
    const [users, setUsers] = useState<User[]>([]);

    const socketRef = useRef<Socket | null>(null);
    const ydocRef = useRef<Y.Doc>(new Y.Doc());

    useEffect(() => {
        if (!docId || !socketUrl) return;

        const ydoc = ydocRef.current;

        // Socket.io connection
        const socket = io(socketUrl, {
            transports: ['websocket'],
            reconnection: true,
        });
        socketRef.current = socket;

        // Connection management
        socket.on('connect', () => {
            console.log('[Socket.io] Connected');
            setConnectionStatus('connected');

            // Join document
            socket.emit('join-document', {
                documentId: docId,
                username,
                userColor,
            });
        });

        socket.on('disconnect', () => {
            console.log('[Socket.io] Disconnected');
            setConnectionStatus('disconnected');
            setUsers([]);
        });

        socket.on('connect_error', (err) => {
            console.error('[Socket.io] Connection error :', err);
            setConnectionStatus('error');
        });

        // ── Synchro Y.js ──────────────────────────────────────────────────────
        // Receive the initial state from backend
        socket.on('document-sync', ({ update }) => {
            console.log('[Y.js] Initial state received');
            const updateBuffer = new Uint8Array(update);
            Y.applyUpdate(ydoc, updateBuffer);
        });

        // Receive the update from other users
        socket.on('document-update', ({ update }) => {
            const updateBuffer = new Uint8Array(update);
            Y.applyUpdate(ydoc, updateBuffer);
        });

        // Check user list update
        socket.on('users-update', ({ users: usersList }) => {
            console.log('[Users] List updated :', usersList);
            setUsers(usersList);
        });

        // Send local update to the server
        const onUpdate = (update: Uint8Array, origin: any) => {
            // Don't resend the update received
            if (origin !== 'remote') {
                socket.emit('document-update', {
                    documentId: docId,
                    update: Array.from(update),
                });
            }
        };
        ydoc.on('update', onUpdate);

        // ── Other users ──────────────────────────────────────────────
        socket.on(
            'user-joined',
            ({ userId, username: name, userColor: color }) => {
                console.log(`[User] ${name} join the document`);
            }
        );

        socket.on('user-left', ({ userId }) => {
            console.log(`[User] ${userId} leaved the document`);
        });

        // ── Cleaning ─────────────────────────────────────────────────────────
        return () => {
            ydoc.off('update', onUpdate);
            socket.emit('leave-document', { documentId: docId });
            socket.disconnect();
            socketRef.current = null;
        };
    }, [docId, socketUrl]);

    return {
        ydoc: ydocRef.current,
        connectionStatus,
        socket: socketRef.current,
        users,
    };
}
