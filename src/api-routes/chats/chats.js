const express = require('express')
const router = express.Router()

const authentication = require('../../services/passport/authentificate-midleware')
const validator = require('../../validators/chat/validator-chat')
const { validate } = require('../../validators/validate-middleware')

const chatService = require('../../services/chats/chats')

// TODO ADD AUTHOR middleware
router.get('/chats', authentication.apiKey, (req, res, next) => {
  chatService.getChats(req.user._id)
    .then(data => res.status(200).send(data))
    .catch(next)
})

router.post('/chats/add-members', authentication.apiKey, (req, res, next) => {
  chatService.addMembers(req.params.id, req.body)
      .then(data => res.status(200).send(data))
      .catch(next)
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


module.exports = router
