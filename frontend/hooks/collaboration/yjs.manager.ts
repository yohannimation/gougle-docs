import * as Y from 'yjs';
import {
    Awareness,
    applyAwarenessUpdate,
    encodeAwarenessUpdate,
} from 'y-protocols/awareness';
import { Socket } from 'socket.io-client';

export class YjsManager {
    private ydoc: Y.Doc;
    private awareness: Awareness;

    constructor() {
        this.ydoc = new Y.Doc();
        this.awareness = new Awareness(this.ydoc);
    }

    setUserInfo(username: string, userColor: string): void {
        this.awareness.setLocalStateField('user', {
            name: username,
            color: userColor,
        });
    }

    applyUpdate(update: number[]): void {
        const updateBuffer = new Uint8Array(update);
        Y.applyUpdate(this.ydoc, updateBuffer);
    }

    applyAwarenessUpdate(update: number[], origin: string): void {
        const awarenessUpdate = new Uint8Array(update);
        applyAwarenessUpdate(this.awareness, awarenessUpdate, origin);
    }

    setupUpdateListener(socket: Socket, docId: string): () => void {
        const onUpdate = (update: Uint8Array, origin: any) => {
            if (origin !== 'remote') {
                socket.emit('document-update', {
                    documentId: docId,
                    update: Array.from(update),
                });
            }
        };

        this.ydoc.on('update', onUpdate);

        return () => this.ydoc.off('update', onUpdate);
    }

    setupAwarenessListener(socket: Socket, docId: string): () => void {
        const onAwarenessChange = ({ added, updated, removed }: any) => {
            const changedClients = added.concat(updated).concat(removed);
            const awarenessUpdate = encodeAwarenessUpdate(
                this.awareness,
                changedClients
            );

            socket.emit('awareness-update', {
                documentId: docId,
                update: Array.from(awarenessUpdate),
            });
        };

        this.awareness.on('change', onAwarenessChange);

        return () => this.awareness.off('change', onAwarenessChange);
    }

    getYDoc(): Y.Doc {
        return this.ydoc;
    }

    getAwareness(): Awareness {
        return this.awareness;
    }
}
