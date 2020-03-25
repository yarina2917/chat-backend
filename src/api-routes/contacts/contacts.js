const express = require('express')
const router = express.Router()

const authentication = require('../../services/passport/authentificate-midleware')

const contactsService = require('../../services/contacts/contacts')

router.get('/contacts', authentication.apiKey, (req, res, next) => {
  contactsService.getContacts(req.headers['x-api-key'])
    .then(data => res.status(200).send(data))
    .catch(next)
})

router.post('/contacts/:username', authentication.apiKey, (req, res, next) => {
  contactsService.addContact(req.headers['x-api-key'], req.params.username)
    .then(data => res.status(200).send(data))
    .catch(next)
})

router.delete('/contacts/:id', authentication.apiKey, (req, res, next) => {
  contactsService.deleteContact(req.headers['x-api-key'], req.params.id)
    .then(data => res.status(200).send(data))
    .catch(next)
})

module.exports = router
