const pick = require('lodash/pick')

const User = require('../../models/user')
const Message = require('../../models/message')

const publicChatFields = ['_id', 'recipientId', 'chatName', 'description', 'chatType', 'avatar', 'author', 'users', 'admins', 'lastMessage', 'createdAt']

const { DIALOG } = require('../../config/chat-types')

async function normalizeDialog (data, currentUserId) {
  return new Promise((resolve, reject) => {
    if (Array.isArray(data)) {
      Promise.all(data.map(chat => {
        if (chat.chatType === DIALOG) {
          const recipient = chat.users.find(userId => userId.toString() !== currentUserId.toString())
          return normalizeRecipient(chat, recipient)
        } else {
          return pick(chat, publicChatFields)
        }
      }))
        .then(data => resolve(data))
        .catch(err => reject(err))
    } else {
      const recipient = data.users.find(userId => (typeof userId === 'string' ? userId : userId._id).toString() !== currentUserId.toString())
      normalizeRecipient(data, recipient)
        .then(chat => resolve(chat))
        .catch(reject)
    }
  })
}

function normalizeRecipient (data, recipient) {
  return User.findById(recipient._id)
    .then(user => {
      const newData = Object.assign({ recipientId: recipient._id }, pick(data, publicChatFields))
      newData.recipientId = recipient._id
      newData.chatName = user.username
      newData.avatar = user.avatar
      return newData
    })
}

function updateAllUsersInChat (users, chatId, action) {
  return Promise.all(users.map(user => {
    return User.findById(user)
      .then(currentUser => {
        if (!currentUser.chats) {
          currentUser = []
        }
        const index = currentUser.chats.indexOf(chatId)
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
