import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.BACK_PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'prod',
    frontendUrl: process.env.FRONT_URL || 'http://localhost:3000',
    databaseUrl: process.env.DB_URL,
} as const;

// Required env var
const requiredEnvVars = ['DB_URL'] as const;

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}
