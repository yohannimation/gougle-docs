import * as Y from 'yjs';
import { DocState } from '../../types/collaboration.types';

export class DocumentStateManager {
    private states = new Map<string, DocState>();

    getOrCreate(documentId: string): DocState {
        if (!this.states.has(documentId)) {
            this.states.set(documentId, {
                ydoc: new Y.Doc(),
                clients: new Set(),
                users: new Map(),
                debounceTimer: null,
                maxTimer: null,
                pendingSave: false,
            });
        }
        return this.states.get(documentId)!;
    }

    get(documentId: string): DocState | undefined {
        return this.states.get(documentId);
    }

    delete(documentId: string): boolean {
        return this.states.delete(documentId);
    }

    entries(): IterableIterator<[string, DocState]> {
        return this.states.entries();
    }
}
