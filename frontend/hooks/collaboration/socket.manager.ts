import { io, Socket } from 'socket.io-client';

export class SocketManager {
    private socket: Socket | null = null;

    connect(socketUrl: string): Socket {
        this.socket = io(socketUrl, {
            path: '/socket.io',
            transports: ['websocket'],
            reconnection: true,
            reconnectionDelay: 1000,
            timeout: 20000,
            autoConnect: true,
            withCredentials: true,
        });

        return this.socket;
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    getSocket(): Socket | null {
        return this.socket;
    }
}
