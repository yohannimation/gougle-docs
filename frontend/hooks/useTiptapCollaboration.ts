import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import * as Y from 'yjs';
import {
    Awareness,
    applyAwarenessUpdate,
    encodeAwarenessUpdate,
} from 'y-protocols/awareness';

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

interface ProviderLike {
    awareness: Awareness;
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
    /** Used for CollaborationCaret */
    provider: ProviderLike | null;
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
    const awarenessRef = useRef<Awareness>(new Awareness(ydocRef.current));
    const providerRef = useRef<ProviderLike>({
        awareness: awarenessRef.current,
    });

    useEffect(() => {
        if (!docId || !socketUrl) return;

        const ydoc = ydocRef.current;
        const awareness = awarenessRef.current;

        // Socket.io connection
        const socket = io(socketUrl, {
            path: '/socket.io', // Explicite
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 20000,
            autoConnect: true,
            withCredentials: true,
        });
        socketRef.current = socket;

        awareness.setLocalStateField('user', {
            name: username,
            color: userColor,
        });

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

        // Awareness update
        socket.on('awareness-update', ({ update }) => {
            const awarenessUpdate = new Uint8Array(update);
            applyAwarenessUpdate(awareness, awarenessUpdate, socket.id);
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

        const onAwarenessChange = ({ added, updated, removed }: any) => {
            const changedClients = added.concat(updated).concat(removed);
            const awarenessUpdate = encodeAwarenessUpdate(
                awareness,
                changedClients
            );

            socket.emit('awareness-update', {
                documentId: docId,
                update: Array.from(awarenessUpdate),
            });
        };
        awareness.on('change', onAwarenessChange);

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
            awareness.off('change', onAwarenessChange);
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
        provider: providerRef.current,
    };
}
