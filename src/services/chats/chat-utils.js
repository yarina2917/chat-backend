const pick = require('lodash/pick')

const User = require('../../models/user')
const Message = require('../../models/message')

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

function updateAllUsersInChat (users, chatId, action) {
  return Promise.all(users.map(user => {
    return User.findById(user)
      .then(currentUser => {
        if (!currentUser.chats) {
          currentUser = []
        }
        const index = currentUser.chats.indexOf(chatId);
        if (action === 'add' && index === -1) {
          currentUser.chats.push(chatId)
        } else if (action === 'delete' && index > -1) {
          currentUser.chats.splice(index, 1)
        }
        return currentUser.save()
      })
  }))
}

// TODO promise all to aggregation
function getLastMessageOfChats (chats) {
  if (Array.isArray(chats)) {
    return Promise.all(chats.map(chat => {
      return Message.findOne({ chatId: chat._id })
        .populate('authorId')
        .sort({ createdAt: -1 })
        .then(lastMessage => {
          chat.lastMessage = lastMessage
          return chat
        })
    }))
  } else {
    return Message.findOne({ chatId: chats._id })
      .populate('authorId')
      .sort({ createdAt: -1 })
      .then(lastMessage => {
        chats.lastMessage = lastMessage
        return chats
      })
  }
}

module.exports = {
  normalizeDialog,
  updateAllUsersInChat,
  getLastMessageOfChats
}
