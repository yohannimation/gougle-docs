import { Request, Response, NextFunction } from 'express';
import documentService from '../services/documents.service';

interface DocumentParams {
    id: string;
}

export class DocumentController {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const documents = await documentService.findAll();
            res.json({ data: documents, total: documents.length });
        } catch (error) {
            next(error);
        }
    }

    async getById(
        req: Request<DocumentParams>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { id } = req.params;
            const document = await documentService.findById(id);

            if (!document) {
                return res.status(404).json({ error: 'Document not found' });
            }

            res.json({ data: document });
        } catch (error) {
            next(error);
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            let { name, isEditable, content } = req.body;

            // Name verification
            if (name !== undefined) {
                if (typeof name !== 'string') {
                    return res.status(400).json({
                        error: true,
                        message: 'Name must be a string',
                    });
                }
                if (name.trim().length < 2 || name.trim().length > 32) {
                    return res.status(400).json({
                        error: true,
                        message:
                            'Name length must be between 2 and 32 characters',
                    });
                }
            }

            // Set document default value
            isEditable = true;
            content = '';

            const document = await documentService.create({
                name: name?.trim(),
                isEditable,
                content,
            });
            res.status(201).json({ data: document });
        } catch (error) {
            next(error);
        }
    }

    async update(
        req: Request<DocumentParams>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { id } = req.params;
            const { name, isEditable, content } = req.body;

            // Name verification
            if (name !== undefined) {
                if (typeof name !== 'string') {
                    return res.status(400).json({
                        error: true,
                        message: 'Name must be a string',
                    });
                }
                if (name.trim().length < 2 || name.trim().length > 32) {
                    return res.status(400).json({
                        error: true,
                        message:
                            'Name length must be between 2 and 32 characters',
                    });
                }
            }

            // Field verification
            if (
                name === undefined &&
                isEditable === undefined &&
                content === undefined
            ) {
                return res.status(400).json({
                    error: true,
                    message: 'At least one field must be provided for update',
                });
            }

            const document = await documentService.update(id, {
                name: name?.trim(),
                isEditable,
                content,
            });

            res.json({
                success: true,
                data: document,
            });
        } catch (error) {
            next(error);
        }
    }

    async delete(
        req: Request<DocumentParams>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { id } = req.params;
            await documentService.delete(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export default new DocumentController();
