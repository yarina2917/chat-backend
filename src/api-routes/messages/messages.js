const express = require('express')
const router = express.Router()

const authentication = require('../../services/passport/authentificate-midleware')

const messagesService = require('../../services/messages/messages')

router.get('/messages/:chatId', authentication.apiKey, (req, res, next) => {
  messagesService.getMessages(req.params.chatId, req.query.lastMessage)
    .then(data => res.status(200).send(data))
    .catch(next)
})

module.exports = router
