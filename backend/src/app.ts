import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import routes from './routes';

const app = express();

// Global middlewares
app.use(
    cors({
        origin: config.frontendUrl,
        credentials: true,
    })
);
app.use(express.json());

// Routes
app.use('/api', routes);

export default app;
