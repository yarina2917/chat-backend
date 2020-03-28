const uuid = require('uuid')
const pick = require('lodash/pick')
const createError = require('http-errors')

const publicChatFields = ['_id', 'chatName', 'author', 'users']

const Chat = require('../../models/chat')
const User = require('../../models/user')

// TODO add filters, search
function getChats (userId) {
  return new Promise((resolve, reject) => {
    User.findById(userId)
      .populate('chats')
      .then(data => resolve(data.chats.map(chat => pick(chat, publicChatFields))))
      .catch(err => reject(err.message))
  })
}

function createChat (author, chatData) {
  return new Promise((resolve, reject) => {
    const chat = new Chat(chatData)
    chat.author = author
    chat.users.push(author)
    chat.save()
      .then((data) => {
        User.findById(author)
          .populate('chats')
          .then(async user => {
            user.chats.push(data._id)
            await user.save()
            resolve(pick(data, publicChatFields))
          })
          .catch(error => reject(error.message))
      })
      .catch(error => reject(error.message))
  })
}

function updateChat (id, chatData) {
  return new Promise((resolve, reject) => {
    Chat.findOneAndUpdate({ _id: id }, chatData, { upsert: true })
      .then(data => resolve(pick(data, publicChatFields)))
      .catch(error => reject(error.message))
  })
}

function addMembers(chatId, users) {
  return new Promise((resolve, reject) => {
    Chat.findById(chatId)
        .then(chat => {
          users.forEach((userId) => {
            if (chat.users.indexOf(userId) <= -1) {
              chat.users.push(userId)
            }
          })
          return chat.save()
        })
        .catch(error => reject(error.message))
  })
}

module.exports = {
  getChats,
  createChat,
  updateChat,
  addMembers
}
