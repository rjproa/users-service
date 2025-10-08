const logger = require('../utils/logger')

const requestLogger = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    const body = { ...req.body }
    if (body.password) body.password = '[HIDDEN]'
    logger.info('Method:', req.method)
    logger.info('Path:', req.path)
    logger.info('Body:', body)
    logger.info('---')
  }
  next()
}


module.exports = requestLogger