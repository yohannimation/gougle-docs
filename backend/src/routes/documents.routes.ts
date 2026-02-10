import { Router } from 'express'
import documentController from '../controllers/documents.controller'

const router = Router()

router.get('/', documentController.getAll)
router.get('/:id', documentController.getById)
router.post('/', documentController.create)
router.put('/:id', documentController.update)
router.delete('/:id', documentController.delete)

export default router