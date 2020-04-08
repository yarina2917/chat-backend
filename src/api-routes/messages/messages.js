const express = require('express')
const router = express.Router()

const messagesService = require('../../services/messages/messages')

const authentication = require('../../services/passport/authentificate-midleware')

router.get('/messages/:chatId', authentication.apiKey, (req, res, next) => {
  messagesService.getMessages(req.params.chatId)
    .then(data => res.status(200).send(data))
    .catch(next)
})

module.exports = router
