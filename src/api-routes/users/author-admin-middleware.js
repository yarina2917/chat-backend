const createError = require('http-errors')

const NotFound = require('../../services/errors/not-found')

const { ROLE_SUPER_ADMIN } = require('../config/user-roles')

const adminOrAuthor = (entity, fieldId) => (req, res, next) => {
  if (req.user.role === ROLE_SUPER_ADMIN) {
    next()
  } else if (req.params[fieldId]) {
    entity.findById(req.params[fieldId])
      .then(NotFound)
      .then(data => {
        if (data.author === req.user.id) {
          next()
        } else {
          createError(403, 'Forbidden')
        }
      })
      .catch(next)
  } else {
    next(createError(403, 'Forbidden'))
  }
}

module.exports.adminOrAuthor = adminOrAuthor
