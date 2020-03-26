const createError = require('http-errors')

module.exports = (req, res, next) => {
  req.header['Content-Type'] ? next() : next(createError(403, 'File not recognized'))
}
