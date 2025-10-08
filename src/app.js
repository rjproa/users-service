const config = require('./utils/config')
const express = require('express')
const cors = require('cors')
const errorHandler = require('./middlewares/errorHandler')
const requestLogger = require('./middlewares/requestLogger')
const unknowEndpoint = require('./middlewares/unknowEndpoint')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const routerUser = require('./routes/routerUser')
const app = express()

const path = require('path')

mongoose.set('strictQuery', false)

logger.info('Conectando a :', config.MONGODB_URL)

mongoose.connect(config.MONGODB_URL)
  .then(() => {
    logger.info('Conectado a mongoDB')
  })
  .catch((error) => {
    logger.error('Error conectando a mongodb: ', error.message)
  })

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, "../public")))
app.use(requestLogger)
app.use('/api/users', routerUser)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'users-service',
    timestamp: new Date().toISOString()
  })
})
app.use(unknowEndpoint)
app.use(errorHandler)

module.exports = app