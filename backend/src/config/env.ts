import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || '3001',
    nodeEnv: process.env.NODE_ENV || 'prod',
    databaseUrl: process.env.DB_URL,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
} as const;

// Required env var
const requiredEnvVars = ['DB_URL'] as const;

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}
