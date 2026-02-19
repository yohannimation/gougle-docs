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

    /**
     * Load Y.js binary of a document
     *
     * @param id string
     * @returns promise
     */
    async loadYDoc(id: string): Promise<Buffer | null> {
        const doc = await prisma.document.findUnique({
            where: { id },
            select: { ydoc: true },
        });
        return (doc?.ydoc ?? null) as any;
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

    /**
     * Persist Y.js binary
     *
     * @param id string
     * @param ydocBuffer Buffer
     * @returns promise
     */
    async saveYDoc(id: string, ydocBuffer: Buffer): Promise<void> {
        await prisma.document.update({
            where: { id },
            data: { ydoc: ydocBuffer as any },
        });
    }

    async delete(id: string) {
        return prisma.document.delete({
            where: { id },
        });
    }
}

export default new DocumentService();
