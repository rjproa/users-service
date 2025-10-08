const logger = require('../utils/logger')

const requestLogger = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    const body = { ...req.body }
    if (body.password) body.password = '[HIDDEN]'
    console.log('Method:', req.method)
    console.log('Path:', req.path)
    console.log('Body:', body)
    console.log('---')
  }
  next()
}


module.exports = requestLogger