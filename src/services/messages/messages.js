const Message = require('../../models/message')
const User = require('../../models/user')

const { MESSAGE } = require('../../config/message-types')

function saveMessage (messageData) {
  return new Promise((resolve, reject) => {
    const message = new Message(messageData)
    message.save()
      .then(message => {
        User
          .findById(messageData.authorId)
          .then(user => resolve(generateMessagesObject(message, user)))
      })
      .catch(error => reject(error))
  })
}

function getMessages (chatId, date) {
  return new Promise((resolve, reject) => {
    Message
      .find({ chatId, createdAt: { $lt: date ? new Date(date).toISOString() : new Date().toISOString() } })
      .populate('authorId')
      .limit(20)
      .sort({ createdAt: -1 })
      .then(messages => resolve(messages.map(message => generateMessagesObject(message, message.authorId))))
      .catch(error => reject(error))
  })
}

function deleteMessages (messageData) {
  return new Promise((resolve, reject) => {
    Message
      .deleteMany({ _id: messageData })
      .then(() => resolve())
      .catch(error => reject(error))
  })
}

function generateMessagesObject (message, user) {
  return {
    _id: message._id,
    message: message.message,
    date: message.createdAt,
    chatId: message.chatId,
    messageType: message.messageType || MESSAGE,
    createdAt: message.createdAt,
    selected: false,
    user: {
      _id: user._id,
      username: user.username,
      avatar: user.avatar && user.avatar.url ? user.avatar.url : '',
      selected: false
    }
  }
}

module.exports = {
  saveMessage,
  getMessages,
  deleteMessages
}
