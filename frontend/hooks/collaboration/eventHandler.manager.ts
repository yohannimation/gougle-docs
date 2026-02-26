import { Socket } from 'socket.io-client';
import { YjsManager } from './yjs.manager';
import { User } from '../../interface/Collaboration.interface';

export class EventHandler {
    setupSocketEvents(
        socket: Socket,
        yjsManager: YjsManager,
        docId: string,
        username: string,
        userColor: string,
        callbacks: {
            onConnect: () => void;
            onDisconnect: () => void;
            onError: (err: Error) => void;
            onUsersUpdate: (users: User[]) => void;
        }
    ): void {
        // Connection
        socket.on('connect', () => {
            console.log('[Socket.io] Connected');
            callbacks.onConnect();

            socket.emit('join-document', {
                documentId: docId,
                username,
                userColor,
            });
        });

        socket.on('disconnect', () => {
            console.log('[Socket.io] Disconnected');
            callbacks.onDisconnect();
        });

        socket.on('connect_error', (err) => {
            console.error('[Socket.io] Connection error:', err);
            callbacks.onError(err);
        });

        // Y.js sync
        socket.on('document-sync', ({ update }) => {
            console.log('[Y.js] Initial state received');
            yjsManager.applyUpdate(update);
        });

        socket.on('document-update', ({ update }) => {
            yjsManager.applyUpdate(update);
        });

        // Awareness
        socket.on('awareness-update', ({ update }) => {
            yjsManager.applyAwarenessUpdate(update, socket.id || '');
        });

        // Users
        socket.on('users-update', ({ users: usersList }) => {
            console.log('[Users] List updated:', usersList);
            callbacks.onUsersUpdate(usersList);
        });

        socket.on('user-joined', ({ username: name }) => {
            console.log(`[User] ${name} joined`);
        });

        socket.on('user-left', ({ userId }) => {
            console.log(`[User] ${userId} left`);
        });
    }

    cleanup(socket: Socket, docId: string): void {
        socket.emit('leave-document', { documentId: docId });
    }
}
