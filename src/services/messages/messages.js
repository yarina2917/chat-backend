const Message = require('../../models/message')
const User = require('../../models/user')

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

function getMessages (chatId) {
  return new Promise((resolve, reject) => {
    Message
      .find({ chatId })
      .populate('authorId')
      .sort({ createdAt: -1 })
      .then((messages) => resolve(messages.map(message => generateMessagesObject(message, message.authorId))))
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

module.exports = {
  saveMessage,
  getMessages,
  deleteMessages
}
