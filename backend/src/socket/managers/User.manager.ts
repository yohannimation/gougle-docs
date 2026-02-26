import { Server } from 'socket.io';
import { DocState } from '../../types/collaboration.types';

export class UserManager {
    addUser(
        state: DocState,
        socketId: string,
        username: string,
        userColor: string
    ): void {
        state.clients.add(socketId);
        state.users.set(socketId, { socketId, username, userColor });
    }

    removeUser(state: DocState, socketId: string): void {
        state.clients.delete(socketId);
        state.users.delete(socketId);
    }

    broadcastUsers(io: Server, documentId: string, state: DocState): void {
        const usersList = Array.from(state.users.values()).map((user) => ({
            username: user.username,
            userColor: user.userColor,
        }));

        io.to(documentId).emit('users-update', { users: usersList });
    }

    getUserCount(state: DocState): number {
        return state.clients.size;
    }
}
