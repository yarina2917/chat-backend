const pick = require('lodash/pick')

const User = require('../../models/user')

const publicChatFields = ['_id', 'chatName', 'description', 'chatType', 'avatar', 'author', 'users', 'admins', 'lastMessage', 'createdAt']

const { DIALOG } = require('../../config/chat-types')

async function normalizeDialog (data, currentUserId) {
  return new Promise((resolve, reject) => {
    if (Array.isArray(data)) {
      Promise.all(data.map(chat => {
        const recipient = chat.users.find(userId => userId !== currentUserId)
        return normalizeRecipient(chat, recipient)
      }))
        .then(data => resolve(data))
        .catch(err => reject(err))
    } else {
      const recipient = data.users.find(userId => userId !== currentUserId)
      normalizeRecipient(data, recipient)
        .then(chat => resolve(chat))
        .catch(reject)
    }
  })
}

function normalizeRecipient (data, recipient) {
  return User.findById(recipient._id)
    .then(user => {
      if (data.chatType === DIALOG) {
        const newData = Object.assign({ recipientId: recipient._id }, pick(data, publicChatFields))
        newData.recipientId = recipient._id
        newData.chatName = user.username
        newData.avatar = user.avatar
        return newData
      }
      return pick(data, publicChatFields)
    })
}

function updateAllUsersInChat (users, chatId) {
  return Promise.all(users.map(user => {
    return User.findById(user)
      .then(currentUser => {
        if (!currentUser.chats) {
          currentUser = []
        }
        if (!currentUser.chats.indexOf(chatId) > -1) {
          currentUser.chats.push(chatId)
          return currentUser.save()
        }
      })
  }))
}

module.exports = {
  normalizeDialog,
  updateAllUsersInChat
}
