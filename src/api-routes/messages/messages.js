const express = require('express')
const router = express.Router()

const authentication = require('../../services/passport/authentificate-midleware')
const validator = require('../../validators/chat/validator-chat')
const { validate } = require('../../validators/validate-middleware')

const messagesService = require('../../services/messages/messages')

router.get('/messages/chatId', authentication.apiKey, (req, res, next) => {
  messagesService.getMessages(req.params.chatId)
    .then(data => res.status(200).send(data))
    .catch(next)
})

router.delete('/messages/chatId', authentication.apiKey, (req, res, next) => {
  messagesService.deleteMessages(req.params.chatId)
    .then(data => res.status(200).send(data))
    .catch(next)
})

module.exports = router
