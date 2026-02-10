import { Request, Response, NextFunction } from 'express'
import documentService from '../services/documents.service'

interface DocumentParams {
    id: string
}

export class DocumentController {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const documents = await documentService.findAll()
            res.json({ data: documents, total: documents.length })
        } catch (error) {
            next(error)
        }
    }

    async getById(req: Request<DocumentParams>, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const document = await documentService.findById(id)

            if (!document) {
                return res.status(404).json({ error: 'Document not found' })
            }

            res.json({ data: document })
        } catch (error) {
            next(error)
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const document = await documentService.create(req.body)
            res.status(201).json({ data: document })
        } catch (error) {
            next(error)
        }
    }

    async update(req: Request<DocumentParams>, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const document = await documentService.update(id, req.body)
            res.json({ data: document })
        } catch (error) {
            next(error)
        }
    }

    async delete(req: Request<DocumentParams>, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            await documentService.delete(id)
            res.status(204).send()
        } catch (error) {
            next(error)
        }
    }
}

export default new DocumentController()