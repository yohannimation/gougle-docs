import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'standalone', // Important pour Docker

    // En dev, garde turbopack
    ...(process.env.NODE_ENV === 'development' && { turbopack: {} }),

    // Proxy les requêtes API et WebSocket vers le backend
    async rewrites() {
        // En prod, le backend est sur http://backend:3001
        // En dev, il est sur http://localhost:3001 ou http://backend:3001
        const backendUrl = process.env.INTERNAL_API_URL ||
                        (process.env.NODE_ENV === 'production'
                            ? 'http://backend:3001'
                            : 'http://localhost:3001');

        return [
        {
            source: '/api/:path*',
            destination: `${backendUrl}/api/:path*`,
        },
        {
            source: '/socket.io/:path*',
            destination: `${backendUrl}/socket.io/:path*`,
        },
        ];
    },
}

export default nextConfig;