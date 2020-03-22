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
    }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User
