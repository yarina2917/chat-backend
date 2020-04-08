const HttpError = require('./error')

class NotFoundError extends HttpError {
  constructor (message = 'Not found') {
    super(message, 404)
  }
}

module.exports = (data) => {
  if (!data) {
    return new NotFoundError()
  }
  return data
}

module.exports.NOtFoundError = NotFoundError
