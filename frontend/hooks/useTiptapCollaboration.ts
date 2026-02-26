// hooks/useTiptapCollaboration.ts

import { useEffect, useRef, useState } from 'react';
import { SocketManager } from './collaboration/socket.manager';
import { YjsManager } from './collaboration/yjs.manager';
import { EventHandler } from './collaboration/eventHandler.manager';
import {
    CollaborationConfig,
    CollaborationReturn,
    ConnectionStatus,
    User,
    ProviderLike,
} from '../interface/Collaboration.interface';

export function useTiptapCollaboration({
    docId,
    socketUrl,
    username = 'Anonymous',
    userColor = '#' + Math.floor(Math.random() * 16777215).toString(16),
}: CollaborationConfig): CollaborationReturn {
    const [connectionStatus, setConnectionStatus] =
        useState<ConnectionStatus>('connecting');
    const [users, setUsers] = useState<User[]>([]);

    const socketManagerRef = useRef<SocketManager>(new SocketManager());
    const yjsManagerRef = useRef<YjsManager>(new YjsManager());
    const eventHandlerRef = useRef<EventHandler>(new EventHandler());
    const providerRef = useRef<ProviderLike>({
        awareness: yjsManagerRef.current.getAwareness(),
    });

    useEffect(() => {
        if (!docId || !socketUrl) return;

        const socketManager = socketManagerRef.current;
        const yjsManager = yjsManagerRef.current;
        const eventHandler = eventHandlerRef.current;

        // Connect
        const socket = socketManager.connect(socketUrl);

        // Setup Y.js
        yjsManager.setUserInfo(username, userColor);
        const cleanupUpdate = yjsManager.setupUpdateListener(socket, docId);
        const cleanupAwareness = yjsManager.setupAwarenessListener(
            socket,
            docId
        );

        // Setup events
        eventHandler.setupSocketEvents(
            socket,
            yjsManager,
            docId,
            username,
            userColor,
            {
                onConnect: () => setConnectionStatus('connected'),
                onDisconnect: () => {
                    setConnectionStatus('disconnected');
                    setUsers([]);
                },
                onError: () => setConnectionStatus('error'),
                onUsersUpdate: (usersList) => setUsers(usersList),
            }
        );

        // Cleanup
        return () => {
            cleanupUpdate();
            cleanupAwareness();
            eventHandler.cleanup(socket, docId);
            socketManager.disconnect();
        };
    }, [docId, socketUrl]);

    return {
        ydoc: yjsManagerRef.current.getYDoc(),
        connectionStatus,
        socket: socketManagerRef.current.getSocket(),
        users,
        provider: providerRef.current,
    };
}

// Re-export types for convenience
export type {
    ConnectionStatus,
    User,
} from '../interface/Collaboration.interface';
