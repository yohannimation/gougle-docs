'use client';

import { useState, useEffect } from 'react';
import { useToast } from './useToast';

import {
    documentsApi,
    Document,
    DocumentCreateInput,
} from '@/lib/api/documents';

export function useDocuments() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const toast = useToast();

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
            toast.error('Failed to fetch documents');
        } finally {
            setIsLoading(false);
        }
    };

    const createDocument = async (data: DocumentCreateInput) => {
        const promise = (async () => {
            try {
                const response = await documentsApi.create(data);
                setDocuments((prev) => [response.data, ...prev]);
                return response.data;
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to create document'
                );
                throw err;
            }
        })();

        return toast.promise(promise, {
            loading: 'Document creation ...',
            success: (data) => `Document "${data.name}" created successfully`,
            error: (err) => 'Document creation failed',
        });
    };

    const deleteDocument = async (id: string) => {
        const promise = (async () => {
            try {
                await documentsApi.delete(id);
                setDocuments((prev) => prev.filter((doc) => doc.id !== id));
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to delete document'
                );
                throw err;
            }
        })();

        return toast.promise(promise, {
            loading: 'Document deletion ...',
            success: (data) => `Document deleted successfully`,
            error: (err) => 'Document deletion failed',
        });
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
