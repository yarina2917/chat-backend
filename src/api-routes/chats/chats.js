const express = require('express')
const router = express.Router()

const chatService = require('../../services/chats/chats')

const authentication = require('../../services/passport/authentificate-midleware')
const validator = require('../../validators/chat/validator-chat')
const { validate } = require('../../validators/validate-middleware')
const { canDeleteChannel } = require('../../validators/can-delete-channel-middleware')

router.get('/chats', authentication.apiKey, (req, res, next) => {
  chatService.getChats(req.user._id)
    .then(data => res.status(200).send(data))
    .catch(next)
})

router.get('/chats/:id', authentication.apiKey, (req, res, next) => {
  chatService.getChatById(req.params.id, req.user._id)
    .then(data => res.status(200).send(data))
    .catch(err => next(err))
})

router.post('/chats', validate(validator.createChat), authentication.apiKey, (req, res, next) => {
  chatService.createChat(req.user._id, req.body)
    .then(data => res.status(200).send(data))
    .catch(next)
})

router.put('/chats/:id', validate(validator.updateChat), authentication.apiKey, (req, res, next) => {
  chatService.updateChat(req.params.id, req.body)
    .then(data => res.status(200).send(data))
    .catch(next)
})

router.delete('/chats/:id', authentication.apiKey, canDeleteChannel, (req, res, next) => {
  chatService.deleteChannel(req.params.id)
    .then(data => res.status(200).send(data))
    .catch(next)
})

module.exports = router
