import { Server, Socket } from 'socket.io';

export function documentHandler(io: Server, socket: Socket) {
    // Join a document
    socket.on('join-document', ({ documentId, userName, userColor }) => {
        console.log(`📄 ${socket.id} joining document ${documentId}`);
        socket.join(documentId);

        // Notify users
        socket.to(documentId).emit('user-joined', {
            userId: socket.id,
            userName,
            userColor,
        });
    });

    // Receive update
    socket.on('document-update', ({ documentId, update }) => {
        socket.to(documentId).emit('document-update', { update });
    });
}
