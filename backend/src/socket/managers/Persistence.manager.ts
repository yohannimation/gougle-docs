import * as Y from 'yjs';
import { DocState } from '../../types/collaboration.types';
import documentService from '../../services/documents.service';

const DEBOUNCE_MIN_MS = 5000;
const DEBOUNCE_MAX_MS = 8000;

export class PersistenceManager {
    async persist(documentId: string, state: DocState): Promise<void> {
        if (!state.pendingSave) return;

        this.clearTimers(state);
        state.pendingSave = false;

        try {
            const update = Y.encodeStateAsUpdate(state.ydoc);
            await documentService.saveYDoc(documentId, Buffer.from(update));
            console.log(`Document "${documentId}" persisted`);
        } catch (err) {
            console.error(`Persist error "${documentId}":`, err);
        }
    }

    schedule(documentId: string, state: DocState): void {
        if (!state.pendingSave) {
            state.pendingSave = true;
            state.maxTimer = setTimeout(
                () => this.persist(documentId, state),
                DEBOUNCE_MAX_MS
            );
        }

        if (state.debounceTimer) clearTimeout(state.debounceTimer);
        state.debounceTimer = setTimeout(
            () => this.persist(documentId, state),
            DEBOUNCE_MIN_MS
        );
    }

    private clearTimers(state: DocState): void {
        if (state.debounceTimer) {
            clearTimeout(state.debounceTimer);
            state.debounceTimer = null;
        }
        if (state.maxTimer) {
            clearTimeout(state.maxTimer);
            state.maxTimer = null;
        }
    }
}
