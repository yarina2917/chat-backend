const express = require('express')
const router = express.Router()

const authentication = require('../../services/passport/authentificate-midleware')
const validator = require('../../validators/user/validator-user')
const { validate } = require('../../validators/validate-middleware')

const userService = require('../../services/users/users')

router.post('/users/create', validate(validator.createUser), (req, res, next) => {
  userService.createUser(req.body)
    .then(data => res.status(200).send(data))
    .catch(next)
})

router.post('/users/login', authentication.local, (req, res, next) => {
  userService.loginUser(req.user._id)
    .then(data => res.status(200).send(data))
    .catch(next)
})

router.get('/users/logout', authentication.apiKey, (req, res, next) => {
  userService.logoutUser(req.headers)
    .then(data => res.status(200).send(data))
    .catch(next)
})

router.get('/users/get-one', authentication.apiKey, (req, res, next) => {
  userService.getUserByToken(req.headers)
    .then(data => res.status(200).send(data))
    .catch(next)
})

router.get('/users/:id', authentication.apiKey, (req, res, next) => {
  userService.getUser(req.params.id)
    .then(data => res.status(200).send(data))
    .catch(next)
})

router.put('/users/:id', authentication.apiKey, validate(validator.updateUser), (req, res, next) => {
  userService.updateUser(req.params.id, req.body)
    .then(data => res.status(200).send(data))
    .catch(next)
})

module.exports = router
