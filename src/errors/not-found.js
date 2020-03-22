const HttpError = require('./error')
const createError = require('http-errors')

class NotFoundError extends HttpError {
  constructor (message = 'Not found') {
    super(message, 404)
  }
}

module.exports = (data) => {
  console.log('asdsadsadsa')
  if (!data) {
    return new NotFoundError()
  }
  return data
}

module.exports.NOtFoundError = NotFoundError
