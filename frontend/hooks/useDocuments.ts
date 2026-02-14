'use client';

import { useState, useEffect } from 'react';
import {
    documentsApi,
    Document,
    DocumentCreateInput,
} from '@/lib/api/documents';

export function useDocuments() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDocuments = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await documentsApi.getAll();
            setDocuments(response.data);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Failed to fetch documents'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const createDocument = async (data: DocumentCreateInput) => {
        try {
            const response = await documentsApi.create(data);
            setDocuments((prev) => [response.data, ...prev]);
            return response.data;
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Failed to create document'
            );
            throw err;
        }
    };

    const deleteDocument = async (id: string) => {
        try {
            await documentsApi.delete(id);
            setDocuments((prev) => prev.filter((doc) => doc.id !== id));
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Failed to delete document'
            );
            throw err;
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    return {
        documents,
        isLoading,
        error,
        refetch: fetchDocuments,
        createDocument,
        deleteDocument,
    };
}
