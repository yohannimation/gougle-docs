export type ConnectionStatus =
    | 'connecting'
    | 'connected'
    | 'disconnected'
    | 'error';

export interface User {
    username: string;
    userColor: string;
}

export interface CollaborationConfig {
    docId: string;
    socketUrl: string;
    username?: string;
    userColor?: string;
}

export interface ProviderLike {
    awareness: import('y-protocols/awareness').Awareness;
}

export interface CollaborationReturn {
    ydoc: import('yjs').Doc | null;
    connectionStatus: ConnectionStatus;
    socket: import('socket.io-client').Socket | null;
    users: User[];
    provider: ProviderLike | null;
}
