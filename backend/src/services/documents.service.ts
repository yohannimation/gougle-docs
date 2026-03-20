import prisma from '../config/database';
import {
    DocumentCreateInput,
    DocumentUpdateInput,
} from '../types/document.types';

import * as Y from 'yjs';
import { yXmlFragmentToProsemirrorJSON } from 'y-prosemirror';

import { validate as isValidUUID } from 'uuid';

export class DocumentService {
    // ═══════════════════════════════════════════════════════════════════════════
    // CRUD REST (used by the controllers)
    // ═══════════════════════════════════════════════════════════════════════════

    async findAll() {
        // No content returned
        return prisma.document.findMany({
            orderBy: [{ isEditable: 'asc' }, { updatedAt: 'desc' }],
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
            select: {
                id: true,
                name: true,
                isEditable: true,
                content: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async create(data: DocumentCreateInput) {
        return prisma.document.create({
            data: {
                name: data.name,
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

    // ═══════════════════════════════════════════════════════════════════════════
    // Methods Y.js (Used by the handler Socket.io)
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Load Y.js binary of a document
     * Used by the Socket.io handle when user join a document
     */
    async loadYDoc(id: string): Promise<Buffer | null> {
        if (!isValidUUID(id)) {
            throw new Error(`Invalid document ID format: ${id}`);
        }

        try {
            const doc = await prisma.document.findUnique({
                where: { id },
                select: { ydoc: true },
            });

            if (!doc) {
                throw new Error(`Document not found: ${id}`);
            }

            return (doc.ydoc ?? null) as any;
        } catch (err) {
            console.error(
                `[DocumentService] Error loading ydoc for ${id}:`,
                err
            );
            throw err;
        }
    }

    /**
     * Persist the Y.js binary and generate the JSON preview
     * Used by the Socket.io handle after the debounce
     */
    async saveYDoc(id: string, ydocBuffer: Buffer): Promise<void> {
        if (!isValidUUID(id)) {
            throw new Error(`Invalid document ID format: ${id}`);
        }
        if (!Buffer.isBuffer(ydocBuffer)) {
            throw new Error('Invalid ydoc buffer');
        }
        const MAX_SIZE = 10 * 1024 * 1024; // 10MB
        if (ydocBuffer.length > MAX_SIZE) {
            throw new Error(
                `Document too large: ${ydocBuffer.length} bytes (max: ${MAX_SIZE})`
            );
        }

        try {
            const json = this.ydocToJson(ydocBuffer);

            await prisma.document.update({
                where: { id },
                data: {
                    ydoc: ydocBuffer as any,
                    content: json,
                },
            });
        } catch (err) {
            if ((err as any).code === 'P2025') {
                throw new Error(`Document not found: ${id}`);
            }
            console.error(
                `[DocumentService] Error saving ydoc for ${id}:`,
                err
            );
            throw err;
        }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // Private utilities
    // ═══════════════════════════════════════════════════════════════════════════

    /**
     * Convert Y.js binary into JSON
     * Used uniquely by `saveYDoc` interne method
     */
    private ydocToJson(ydocBuffer: Buffer): any {
        try {
            const ydoc = new Y.Doc();
            Y.applyUpdate(ydoc, ydocBuffer);

            const xmlFragment = ydoc.getXmlFragment('default');
            const json = yXmlFragmentToProsemirrorJSON(xmlFragment);

            return json;
        } catch (err) {
            console.error(
                '[DocumentService] Conversion error Y.js → JSON :',
                err
            );
            return { type: 'doc', content: [{ type: 'paragraph' }] };
        }
    }
}

export default new DocumentService();
