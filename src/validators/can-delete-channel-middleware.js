const createError = require('http-errors')

const Chat = require('../models/chat')

const { CHANNEL } = require('../config/chat-types')

const canDeleteChannelMiddleware = (req, res, next) => {
  if (req.params.id) {
    Chat.findById(req.params.id)
      .then(data => {
        data.chatType !== CHANNEL || (data.chatType === CHANNEL && data.admins.indexOf(req.user.id) > -1)
          ? next()
          : next(createError(403, 'Forbidden'))
      })
      .catch(next)
  } else {
    next(createError(403, 'Forbidden'))
  }
}

module.exports.canDeleteChannel = canDeleteChannelMiddleware
