// create ajv error
class ValidationError extends Error {
  constructor (errors, status = 400, message = 'Invalid data') {
    super(message)
    this.status = status
    this.errors = errors
    this.name = 'ValidationError'
  }
}

const validate = (validator) => (req, res, next) => {
  if (!validator(req.body)) {
    return next(new ValidationError(validator.errors))
  }
  next()
}

const validateData = (validator, data) => {
  if (!validator(data)) {
    return (new ValidationError(validator.errors))
  } else {
    return null
  }
}

module.exports.validate = validate
module.exports.validateData = validateData
