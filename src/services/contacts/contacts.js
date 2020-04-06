const pick = require('lodash/pick')

const createError = require('http-errors')

const User = require('../../models/user')
const Chat = require('../../models/chat')
const Message = require('../../models/message')

const { DIALOG } = require('../../config/chat-types')
const contactsField = ['_id', 'username']

let io
function importIO (importIO) {
  io = importIO
}

function getContacts (userId) {
  return new Promise((resolve, reject) => {
    User
      .findById(userId)
      .populate('contacts')
      .then(data => resolve(data.contacts.map(contact => pick(contact, contactsField))))
      .catch(error => reject(error))
  })
}

function addContact (userId, username) {
  return new Promise((resolve, reject) => {
    User
      .findOne({ username })
      .then((contact) => {
        if (!contact) {
          return reject(createError(404, 'User not found'))
        }
        User
          .findById(userId)
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

function deleteContacts (userId, contactId) {
  return new Promise((resolve, reject) => {
    let dialogId
    Chat
      .findOne({
        users: { $all: [userId, contactId] },
        chatType: DIALOG
      })
      .then(async dialog => {
        if (!dialog) {
          await deleteContact(userId, contactId)
          resolve({ message: 'Success' })
        } else {
          dialogId = dialog._id
          return dialog.remove()
        }
      })
      .then(() => {
        Message
          .deleteMany({ chatId: dialogId })
          .then(() => deleteContact(userId, contactId, dialogId))
          .then(() => deleteContact(contactId, userId, dialogId))
          .then(() => {
            io.in(dialogId).emit('notify-delete-chat', { chatId: dialogId })
            resolve({ message: 'Success' })
          })
          .catch(error => reject(error))
      })
      .catch(error => reject(error))
  })
}

function deleteContact (userId, contactId, dialogId) {
  User.findById(userId)
    .then(user => {
      user.contacts = user.contacts.filter(id => id.toString() !== contactId.toString())
      if (dialogId) {
        user.chats = user.chats.filter(id => id.toString() !== dialogId.toString())
      }
      return user.save()
    })
    .catch(error => reject(error))
}

module.exports = {
  getContacts,
  addContact,
  deleteContacts,
  importIO
}
