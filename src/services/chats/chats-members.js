const createError = require('http-errors')

const Chat = require('../../models/chat')
const User = require('../../models/user')
const Message = require('../../models/message')

const { updateAllUsersInChat, getLastMessageOfChats } = require('./chat-utils')

function addMembers (chatId, users) {
  return new Promise((resolve, reject) => {
    Chat.findById(chatId)
      .then(chat => {
        users.forEach((userId) => {
          if (chat.users.indexOf(userId) <= -1) {
            chat.users.push(userId)
          }
        })
        return chat.save()
      })
      .then(chat => getLastMessageOfChats(chat))
      .then(chat => {
        updateAllUsersInChat(users, chatId, 'add')
          .then(async users => {
            resolve({ users, chat })
          })
      })
      .catch(error => reject(error))
  })
}

function removeMember (chatId, userId) {
  return new Promise((resolve, reject) => {
    Chat.findById(chatId)
      .then(async chat => {
        const position = chat.users.indexOf(userId)
        if (position > -1) {
          chat.users.splice(position, 1)
          let promise
          if (!chat.users.length) {
            promise =
              Message
                .deleteMany({ chatId })
                .then(() => chat.remove())
                .catch(error => reject(error))
          } else {
            promise = chat.save()
          }
          promise
            .then(() => {
              User.findById(userId)
                .then(async user => {
                  const userPosition = user.chats.indexOf(chatId)
                  user.chats.splice(userPosition, 1)
                  await user.save()
                  resolve({ userId, chatId })
                })
            })
            .catch(error => reject(error))
        } else {
          reject(createError(404, 'The user was not found!'))
        }
      })
      .catch(error => reject(error))
  })
}

module.exports = {
  addMembers,
  removeMember
}
