const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.json({ api: { status: 'success', version: '1' } })
})

const users = require('./users')
const contacts = require('./contacts/contacts')

module.exports = [router, users, contacts]
