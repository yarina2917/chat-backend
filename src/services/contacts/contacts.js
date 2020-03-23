const uuid = require('uuid')
const pick = require('lodash/pick')

const createError = require('http-errors')

const User = require('../../models/user')

function addContact (apiKey, username) {
  return new Promise((resolve, reject) => {
    User
      .findOne({ username })
      .then((contact) => {
        User
          .findOne({ apiKey })
          .then(user => {
            user.contacts.push(contact._id)
            return user.save()
          })
          .then(() => resolve({ _id: contact._id }))
      })
      .catch(error => reject(error))
  })
}

function deleteContact (apiKey, id) {
  return new Promise((resolve, reject) => {
    User
      .findOne({ apiKey })
      .then((user) => {
        const index = user.contacts.findIndex(el => el === id)
        user.contacts.splice(index, 1)
        return user.save()
      })
      .then(() => resolve({ message: 'Success' }))
      .catch(error => reject(error))
  })
}

module.exports = {
  addContact,
  deleteContact
}
