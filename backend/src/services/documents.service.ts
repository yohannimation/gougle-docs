// src/services/documents.service.ts
import prisma from '../config/database';
import {
    DocumentCreateInput,
    DocumentUpdateInput,
} from '../types/document.types';

export class DocumentService {
    async findAll() {
        return prisma.document.findMany({
            orderBy: { updatedAt: 'desc' },
            select: {
                id: true,
                name: true,
                isEditable: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async findById(id: string) {
        return prisma.document.findUnique({
            where: { id },
        });
    }

    async create(data: DocumentCreateInput) {
        return prisma.document.create({
            data: {
                name: data.name || 'Document sans titre',
                isEditable: data.isEditable ?? true,
                content: data.content || null,
            },
        });
    }

    async update(id: string, data: DocumentUpdateInput) {
        return prisma.document.update({
            where: { id },
            data,
        });
    }

    async delete(id: string) {
        return prisma.document.delete({
            where: { id },
        });
    }

    // ─── Méthodes Y.js (utilisées par document.handler.ts) ───────────────────

    /** Charge le binaire Y.js d'un document */
    async loadYDoc(id: string): Promise<Buffer | null> {
        const doc = await prisma.document.findUnique({
            where: { id },
            select: { ydoc: true },
        });
        return (doc?.ydoc ?? null) as any;
    }

    /** Persiste le binaire Y.js */
    async saveYDoc(id: string, ydocBuffer: Buffer): Promise<void> {
        await prisma.document.update({
            where: { id },
            data: { ydoc: ydocBuffer as any },
        });
    }
}

export default new DocumentService();
