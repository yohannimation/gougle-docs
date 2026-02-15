import { Document } from '@prisma/client';

export type DocumentCreateInput = {
    name: string;
    isEditable?: boolean;
    content?: any;
};

export type DocumentUpdateInput = {
    name?: string;
    isEditable?: boolean;
    content?: any;
};

export type DocumentResponse = Document;

export type DocumentListResponse = {
    documents: Document[];
    total: number;
};
