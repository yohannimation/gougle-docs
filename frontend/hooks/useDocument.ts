'use client';

import { useState, useCallback } from 'react';
import { useToast } from './useToast';

import {
    documentsApi,
    Document,
    DocumentUpdateInput,
} from '@/lib/api/documents';

export function useDocument(id: string) {
    const [document, setDocument] = useState<Document | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const toast = useToast();

    const fetchDocument = useCallback(async () => {
        if (!id) return;

        try {
            setIsLoading(true);
            setError(null);
            const response = await documentsApi.getById(id);
            setDocument(response.data);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Failed to fetch document'
            );
            toast.error('Failed to fetch document');
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    const updateDocument = async (data: DocumentUpdateInput) => {
        try {
            const response = await documentsApi.update(id, data);
            setDocument(response.data);
            return response.data;
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Failed to update document'
            );
            toast.error('Failed to update document');
            throw err;
        }
    };

    return {
        document,
        isLoading,
        error,
        fetchDocument,
        refetch: fetchDocument,
        updateDocument,
    };
}
