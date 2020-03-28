const mongoose = require('mongoose')
const uuid = require('uuid')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  apiKey: {
    type: String,
    required: true,
    default: uuid.v4
  },
  chats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' }],
  avatar: {
    url: String,
    dataId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'File'
    }
  },
  contacts: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
