import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { config } from '../config/env';
import { documentHandler } from './handlers/document.handler';

export function setupSocketHandlers(httpServer: HttpServer) {
    const io = new SocketServer(httpServer, {
        cors: {
            origin: config.frontendUrl,
            methods: ['GET', 'POST'],
            credentials: true,
        },
        transports: ['websocket'],
        pingTimeout: 60000,
        pingInterval: 25000,
    });

    io.on('connection', (socket) => {
        console.log(`✅ User connected: ${socket.id}`);

        // Document Handler
        documentHandler(io, socket);

        socket.on('disconnect', () => {
            console.log(`❌ User disconnected: ${socket.id}`);
        });
    });

    return io;
}
