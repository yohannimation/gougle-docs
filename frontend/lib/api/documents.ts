import { apiClient } from './client';

export interface Document {
    id: string;
    name: string;
    isEditable: boolean;
    content: any;
    createdAt: string;
    updatedAt: string;
}

export interface DocumentCreateInput {
    name: string;
    isEditable?: boolean;
    content?: any;
}

export interface DocumentUpdateInput {
    name?: string;
    isEditable?: boolean;
    content?: any;
}

export interface DocumentListResponse {
    data: Document[];
    total: number;
}

export interface DocumentResponse {
    data: Document;
}

export const documentsApi = {
    getAll: () => apiClient.get<DocumentListResponse>('/api/documents'),

    getById: (id: string) =>
        apiClient.get<DocumentResponse>(`/api/documents/${id}`),

    create: (data: DocumentCreateInput) =>
        apiClient.post<DocumentResponse>('/api/documents', data),

    update: (id: string, data: DocumentUpdateInput) =>
        apiClient.put<DocumentResponse>(`/api/documents/${id}`, data),

    delete: (id: string) => apiClient.delete(`/api/documents/${id}`),
};
