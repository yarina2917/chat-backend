const createError = require('http-errors')

module.exports = (req, res, next) => {
  req.headers['content-type'] ? next() : next(createError(403, 'File not recognized'))
}
