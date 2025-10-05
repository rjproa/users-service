const logger = require('../utils/logger')

const unknowEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknow endpoint' })
}

module.exports = unknowEndpoint