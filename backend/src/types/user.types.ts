export type User = {
    socketId: string;
    username: string;
    userColor: string;
};

export type UserJoinPayload = {
    documentId: string;
    username: string;
    userColor: string;
};

export type UserLeavePayload = {
    documentId: string;
};
