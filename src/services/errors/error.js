class HttpError extends Error {
  constructor (message = 'Invalid request', status = 400) {
    super (message)
    this.status = status
  }
  toJson () {
    return {
      status: this.status,
      message: this.message
    }
  }
}

module.exports = HttpError
