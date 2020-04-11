const express = require('express')
const router = express.Router()

const avatarsService = require('../../services/avatars/avatars')

const authentication = require('../../services/passport/authentificate-midleware')
const requireContentType = require('../../validators/require-content-type-middleware')

router.put('/avatars/:id', authentication.apiKey, requireContentType, (req, res, next) => {
  const chunks = []
  req.on('data', chunk => chunks.push(chunk))
  req.on('end', () => {
    avatarsService.updateAvatar(req.params.id, Buffer.concat(chunks), req.headers['x-file-name'], req.query.type)
      .then(data => res.status(200).send(data))
      .catch(next)
  })
})

router.delete('/avatars/:id', authentication.apiKey, (req, res, next) => {
  avatarsService.deleteAvatar(req.params.id, req.query.type)
    .then(data => res.status(200).send(data))
    .catch(next)
})

module.exports = router
