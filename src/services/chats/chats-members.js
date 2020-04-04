const createError = require('http-errors')

const Chat = require('../../models/chat')
const User = require('../../models/user')

const { updateAllUsersInChat } = require('./chat-utils')

function addMembers (chatId, users) {
  return new Promise((resolve, reject) => {
    Chat.findById(chatId)
      .populate({
        path: 'lastMessage',
        populate: {
          path: 'authorId',
          select: ['username']
        }
      })
      .then(async chat => {
        users.forEach((userId) => {
          if (chat.users.indexOf(userId) <= -1) {
            chat.users.push(userId)
          }
        })
        updateAllUsersInChat(users, chatId)
          .then(async users => {
            await chat.save()
            resolve({ users, chat })
          })
      })
      .catch(error => reject(error.message))
  })
}

function removeMember (chatId, userId) {
  return new Promise((resolve, reject) => {
    Chat.findById(chatId)
      .then(async chat => {
        const position = chat.users.indexOf(userId)
        if (position > -1) {
          chat.users.splice(position, 1)
          !chat.users.length ? await chat.remove() : await chat.save()
          User.findById(userId)
            .then(async user => {
              const userPosition = user.chats.indexOf(chatId)
              user.chats.splice(userPosition, 1)
              await user.save()
              resolve({ userId, chatId })
            })
            .catch(reject)
        } else {
          reject(createError(404, 'The user was not found!'))
        }
      })
      .catch(reject)
  })
}

module.exports = {
  addMembers,
  removeMember
}
