import { Router } from 'express';
import documentRoutes from './documents.routes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// Routes API
router.use('/documents', documentRoutes);

export default router;
