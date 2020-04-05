const mongoose = require('mongoose')

const { CHANNEL, DIALOG, GROUP } = require('../config/chat-types')
const chatTypes = [CHANNEL, DIALOG, GROUP]

const chatSchema = new mongoose.Schema({
  chatName: {
    type: String,
    required: true
  },
  description: { type: String },
  chatType: {
    type: String,
    required: true,
    enum: { values: chatTypes }
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  avatar: {
    url: { type: String, default: null },
    dataId: { type: mongoose.Schema.Types.ObjectId, ref: 'File'}
  },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
})

const Chat = mongoose.model('Chat', chatSchema)

module.exports = Chat
