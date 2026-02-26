import * as Y from 'yjs';
import documentService from '../../services/documents.service';

export class YjsOperations {
    async loadFromDatabase(documentId: string, ydoc: Y.Doc): Promise<boolean> {
        const savedYDoc = await documentService.loadYDoc(documentId);
        if (!savedYDoc) return false;

        Y.applyUpdate(ydoc, savedYDoc);
        console.log(`Document "${documentId}" load from DB`);
        return true;
    }

    isEmpty(ydoc: Y.Doc): boolean {
        return Y.encodeStateAsUpdate(ydoc).length <= 2;
    }

    getCurrentState(ydoc: Y.Doc): number[] {
        const state = Y.encodeStateAsUpdate(ydoc);
        return Array.from(state);
    }

    applyUpdate(ydoc: Y.Doc, update: number[]): void {
        const updateBuffer = new Uint8Array(update);
        Y.applyUpdate(ydoc, updateBuffer);
    }
}
