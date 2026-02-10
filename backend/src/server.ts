import { createServer } from 'http'
import app from './app'
import { config } from './config/env'
import { setupSocketHandlers } from './socket/index'

const httpServer = createServer(app)

// Setup Socket.io
setupSocketHandlers(httpServer)

httpServer.listen(config.port, () => {
    console.log(`🚀 Server running on port ${config.port}`)
    console.log(`📝 API: http://localhost:${config.port}/api`)
    console.log(`🔌 Socket.io: http://localhost:${config.port}`)
    console.log(`🌍 Environment: ${config.nodeEnv}`)
})