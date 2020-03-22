const mongoose = require('mongoose')
const uuid = require('uuid')

const { ROLE_APP_USER, ROLE_SUPER_ADMIN } = require('../config/user-roles')
const roles = [ROLE_SUPER_ADMIN, ROLE_APP_USER]

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
  role: {
    type: String,
    enum: { values: roles },
    required: true,
    default: ROLE_APP_USER
  },
  apiKey: {
    type: String,
    required: true,
    default: uuid.v4
  },
  avatar: { type: mongoose.Schema.Types.ObjectId, ref: 'File' }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
