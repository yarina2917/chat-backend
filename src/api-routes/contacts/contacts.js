const express = require('express')
const router = express.Router()

const contactsService = require('../../services/contacts/contacts')

const authentication = require('../../services/passport/authentificate-midleware')

router.get('/contacts/:id', authentication.apiKey, (req, res) => {
  res.status(200).send({ data: !!req.user.contacts.includes(req.params.id) })
})

router.get('/contacts', authentication.apiKey, (req, res, next) => {
  contactsService.getContacts(req.user._id)
    .then(data => res.status(200).send(data))
    .catch(next)
})

router.post('/contacts/:username', authentication.apiKey, (req, res, next) => {
  contactsService.addContact(req.user._id, req.params.username)
    .then(data => res.status(200).send(data))
    .catch(next)
})

router.delete('/contacts/:id', authentication.apiKey, (req, res, next) => {
  contactsService.deleteContacts(req.user._id, req.params.id)
    .then(data => res.status(200).send(data))
    .catch(next)
})

module.exports = router
