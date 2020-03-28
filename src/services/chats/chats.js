const uuid = require('uuid')
const pick = require('lodash/pick')
const createError = require('http-errors')

const publicChatFields = ['_id', 'chatName', 'chatType', 'avatar', 'author', 'users', 'lastMessage', 'createdAt']
const publicChatUsersFields = ['_id', 'username', 'avatar']

const Chat = require('../../models/chat')
const User = require('../../models/user')

const { CHANNEL, DIALOG, GROUP } = require('../../config/chat-types')

// TODO add filters, search
function getChats (userId) {
  return new Promise((resolve, reject) => {
    User.findById(userId)
      .populate({
        path: 'chats',
        populate: {
          path: 'users',
          select: ['username']
        }
      })
      .then(data => resolve(data.chats.map(chat => pick(chat, publicChatFields))))
      .catch(err => reject(err.message))
  })
}

function getChatById (chatId) {
  return new Promise((resolve, reject) => {
    Chat.findById(chatId)
      .populate({ path: 'users' })
      .populate({ path: 'avatar' })
      .then(data => resolve(pick(data, publicChatFields)))
      .catch(err => reject(err.message))
  })
}

function createChat (author, chatData) {
  return new Promise((resolve, reject) => {
    User.findById(author)
      .populate('chats')
      .then(async currentUser => {
        const chatExist = chatData.chatType === DIALOG && currentUser.chats.find(chat => chat.chatType === DIALOG && (chat.users.find(user => user.toString() === chatData.users[0].toString())))
        if (chatExist) {
          return resolve({
            message: 'Chat already exist!',
            chat: pick(chatExist, publicChatFields)
          })
        }
        if (chatData.chatType === DIALOG) {
          chatData.chatName = uuid.v4()
        }
        const chat = new Chat(chatData)
        chat.author = author
        chat.users.push(author)
        chat.save()
          .then(async data => {
            updateAllUsersInChat(chatData.users, data._id)
              .then(async () => {
                currentUser.chats.push(data._id)
                await currentUser.save()
                resolve({
                  message: 'New chat!',
                  chat: pick(data, publicChatFields)
                })
              })
          })
          .catch(reject)
      })
      .catch(reject)
  })
}

function updateAllUsersInChat (users, chatId) {
  return Promise.all(users.map(user => {
    return User.findById(user)
      .then(currentUser => {
        if (!currentUser.chats) {
          currentUser = []
        }
        if (!currentUser.chats.indexOf(chatId) > -1) {
          currentUser.chats.push(chatId)
          return currentUser.save()
        }
      })
  }))
}

function updateChat (id, chatData) {
  return new Promise((resolve, reject) => {
    Chat.findOneAndUpdate({ _id: id }, chatData, { upsert: true })
      .then(data => resolve(pick(data, publicChatFields)))
      .catch(error => reject(error.message))
  })
}

function addMembers (chatId, users) {
  return new Promise((resolve, reject) => {
    Chat.findById(chatId)
      .then(async chat => {
        users.forEach((userId) => {
          if (chat.users.indexOf(userId) <= -1) {
            chat.users.push(userId)
          }
        })
        await updateAllUsersInChat(users, chatId)
        return resolve(chat.save())
      })
      .catch(error => reject(error.message))
  })
}

module.exports = {
  getChats,
  getChatById,
  createChat,
  updateChat,
  addMembers
}
