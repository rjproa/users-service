const mongoose = require('mongoose')
const logger = require('../../src/utils/logger')
const { MongoMemoryServer } = require('mongodb-memory-server')

let mongoServer

dbConnect = async () => {
  try {

    if (!mongoServer) {
      mongoServer = await MongoMemoryServer.create()
    }

    const uri = mongoServer.getUri()

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(uri)
    }

  } catch (error) {
    logger.error('Error al conectar a memoria de MONGODB', error)
    throw error
  }
}

dbDisconnect = async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase()
      await mongoose.connection.close()
    }

    if (mongoServer) {
      await mongoServer.stop()
      mongoServer = null
    }
  } catch (error) {
    logger.error("Error desconectando de memoria de MONGODB", error)
    throw error
  }
}

module.exports = { dbConnect, dbDisconnect }