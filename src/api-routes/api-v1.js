const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.json({ api: { status: 'success', version: '1' } })
})

const users = require('./users/users')
const chats = require('./chats/chats')
const contacts = require('./contacts/contacts')
const avatars = require('./avatars/avatars')

module.exports = [router, users, chats, contacts, avatars]
