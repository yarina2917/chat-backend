const pick = require('lodash/pick')

const createError = require('http-errors')

const User = require('../../models/user')
const contactsField = ['_id', 'username']

function getContacts (apiKey) {
  return new Promise((resolve, reject) => {
    User
      .findOne({ apiKey })
      .populate('contacts')
      .then(data => resolve(data.contacts.map(contact => pick(contact, contactsField))))
      .catch(error => reject(error))
  })
}

function addContact (apiKey, username) {
  return new Promise((resolve, reject) => {
    User
      .findOne({ username })
      .then((contact) => {
        if (!contact) {
          return reject(createError(404, 'User not found'))
        }
        User
          .findOne({ apiKey })
          .then(user => {
            if (user.contacts.indexOf(contact._id) > -1) {
              return reject(createError(401, 'User already exists in contacts'))
            }
            user.contacts.push(contact._id)
            return user.save()
          })
          .then(() => resolve(pick(contact, contactsField)))
      })
      .catch(error => reject(error))
  })
}

function deleteContact (apiKey, id) {
  return new Promise((resolve, reject) => {
    User
      .findOne({ apiKey })
      .then((user) => {
        const index = user.contacts.indexOf(id)
        if (index > -1) {
          user.contacts.splice(index, 1)
        }
        return user.save()
      })
      .then(() => resolve({ message: 'Success' }))
      .catch(error => reject(error))
  })
}

module.exports = {
  getContacts,
  addContact,
  deleteContact
}
