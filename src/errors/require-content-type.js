const createError = require('http-errors')

module.exports = (req, res, next) => {
  if (req.header['Content-Type']) {
    next()
  } else {
    next(createError(403, 'File not recognized'))
  }
}
