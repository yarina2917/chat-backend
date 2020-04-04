const pick = require('lodash/pick')

const createError = require('http-errors')

const Message = require('../../models/message')
const User = require('../../models/user')
const Chat = require('../../models/chat')

function saveMessage (messageData) {
  return new Promise((resolve, reject) => {
    const message = new Message(messageData)
    message.save()
      .then(message => {
        Chat
          .findById(messageData.chatId)
          .then(chat => {
            chat.lastMessage = message._id
            return chat.save()
          })
          .then(() => {
            User
              .findById(messageData.authorId)
              .then(user => {
                resolve(generateMessagesObject(message, user))
              })
          })
      })
      .catch(error => reject(error))
  })
}

function getMessages (chatId) {
  console.log('getMessages', chatId)
  return new Promise((resolve, reject) => {
    Message
      .find({ chatId })
      .populate('authorId')
      .sort({ createdAt: -1 })
      .then((messages) => {
        resolve(messages.map(message => generateMessagesObject(message, message.authorId)))
      })
      .catch(error => reject(error))
  })
}

function generateMessagesObject (message, user) {
  console.log('!generateMessagesObject')
  return {
    _id: message.id,
    message: message.message,
    date: message.createdAt,
    selected: false,
    chatId: message.chatId,
    user: {
      _id: user._id,
      username: user.username,
      avatar: user.avatar && user.avatar.url ? user.avatar.url : '',
      selected: false
    }
  }
}

function deleteMessages (messageData, chatId) {
  return new Promise((resolve, reject) => {
    Message
      .deleteMany({ _id: messageData })
      .then(() => {
        Chat
          .findById(chatId)
          .then(chat => {
            if (chat.lastMessage && messageData.includes(chat.lastMessage.toString())) {
              Message
                .find({ chatId })
                .sort({ _id: -1 }).limit(1)
                .then((data) => {
                  chat.lastMessage = data[0] || null
                  return chat.save()
                })
            }
            resolve()
          })
          .then(() => resolve())
      })
      .catch(error => reject(error))
  })
}

module.exports = {
  saveMessage,
  getMessages,
  deleteMessages
}
