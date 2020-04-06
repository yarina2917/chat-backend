const mongoose = require('mongoose')

const { MESSAGE, REPORT } = require('../config/message-types')
const messageTypes = [REPORT, MESSAGE]

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  messageType: {
    type: String,
    required: true,
    default: MESSAGE,
    enum: { values: messageTypes }
  },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
})

const Message = mongoose.model('Message', messageSchema)

module.exports = Message
