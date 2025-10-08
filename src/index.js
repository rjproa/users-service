const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})

const gracefulShutdown = (signal) => {
  logger.info(`${signal} recibido, cerrando servidor...`)
  server.close(() => {
    logger.info('Servidor cerrado')
    process.exit(0)
  })

  setTimeout(() => {
    logger.error('Forzando cierre después de 10s')
    process.exit(1)
  }, 10000)
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))