const pick = require('lodash/pick')

const createError = require('http-errors')

const Message = require('../../models/message')
const User = require('../../models/user')

function saveMessage (messageData) {
    return new Promise((resolve, reject) => {
        const message = new Message(messageData)
        message.save()
            .then(data => {
                User
                    .findById(messageData.authorId)
                    .then(user => {
                        resolve({
                            _id: data.id,
                            message: data.message,
                            date: data.createdAt,
                            user: {
                                _id: user._id,
                                username: user.username,
                                avatar: user.avatar && user.avatar.url ? user.avatar.url : ''
                            },
                        })
                    })
            })
            .catch(error => reject(error))
    })
}

function getMessages (message, authorId, chatId) {

}

function deleteMessages (message, authorId, chatId) {

}

module.exports = {
    saveMessage,
    getMessages,
    deleteMessages,
}

