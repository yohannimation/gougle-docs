export interface User {
    socketId: string;
    username: string;
    userColor: string;
}

export interface DocState {
    ydoc: import('yjs').Doc;
    clients: Set<string>;
    users: Map<string, User>;
    debounceTimer: NodeJS.Timeout | null;
    maxTimer: NodeJS.Timeout | null;
    pendingSave: boolean;
}

export interface JoinDocumentPayload {
    documentId: string;
    username: string;
    userColor: string;
}

export interface DocumentUpdatePayload {
    documentId: string;
    update: number[];
}

export interface AwarenessUpdatePayload {
    documentId: string;
    update: number[];
}

export interface LeaveDocumentPayload {
    documentId: string;
}
