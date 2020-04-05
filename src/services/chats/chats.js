const uuid = require('uuid')
const pick = require('lodash/pick')
const createError = require('http-errors')

const { normalizeDialog, updateAllUsersInChat } = require('./chat-utils')

const publicChatFields = ['_id', 'chatName', 'description', 'chatType', 'avatar', 'author', 'users', 'admins', 'lastMessage', 'createdAt']
const mainChatFields = ['_id', 'chatName', 'chatType', 'avatar', 'users', 'admins']

const Chat = require('../../models/chat')
const User = require('../../models/user')
const Message = require('../../models/message')

const { DIALOG } = require('../../config/chat-types')

let io
function importIO (importIO) {
  io = importIO
}

// TODO add filters, search
function getChats (userId) {
  return new Promise((resolve, reject) => {
    User.findById(userId)
      .populate({
        path: 'chats',
        populate: [{
          path: 'users',
          select: ['username']
        }, {
          path: 'lastMessage',
          populate: {
            path: 'authorId',
            select: ['username']
          }
        }]
      })
      .then(data => {
        normalizeDialog(data.chats, userId)
          .then(data => resolve(data))
          .catch(err => reject(err))
      })
      .catch(err => reject(err.message))
  })
}

function getChatsId (userId) {
  return new Promise((resolve, reject) => {
    User.findById(userId)
      .then(data => resolve(data.chats))
      .catch(err => reject(err))
  })
}

function getChatById (chatId, userId) {
  return new Promise((resolve, reject) => {
    Chat.findById(chatId)
      .populate({ path: 'users' })
      .populate({ path: 'avatar.chatId' })
      .then(data => {
        normalizeDialog(data, userId)
          .then(chat => resolve(chat))
          .then(err => reject(err))
      })
      .catch(err => reject(err.message))
  })
}

function createChat (author, chatData) {
  return new Promise((resolve, reject) => {
    User.findById(author)
      .populate('chats')
      .then(async currentUser => {
        const chatExist =
          chatData.chatType === DIALOG &&
          currentUser.chats.find(chat => chat.chatType === DIALOG &&
            (chat.users.find(user => user.toString() === chatData.users[0].toString())))
        if (chatExist) {
          normalizeDialog(chatExist, author)
            .then(chat => resolve({ message: 'Chat already exist!', chat: pick(chat, publicChatFields) }))
            .catch(err => reject(err))
        }
        if (chatData.chatType === DIALOG) {
          chatData.chatName = uuid.v4()
        }
        const chat = new Chat(chatData)
        chat.author = author
        chat.users.push(author)
        chat.admins.push(author)
        chat.save()
          .then(async data => {
            updateAllUsersInChat(chatData.users, data._id, 'add')
              .then(async () => {
                currentUser.chats.push(data._id)
                await currentUser.save()
                normalizeDialog(data, author)
                  .then(chat => {
                    joinChat(chat)
                    resolve({ message: 'New chat!', chat })
                  })
              })
          })
          .catch(reject)
      })
      .catch(reject)
  })
}

function joinChat (chat) {
  const connected = require('../sockets/sockets').getConnectedUsers()
  chat.users.forEach(userId => {
    const connectedUser = connected.find(user => user.userId === userId.toString())
    if (connectedUser) {
      io.sockets.connected[connectedUser.socketId].join(chat._id)
    }
  })
  io.in(chat._id).emit('notify-add-chat', chat)
}

function updateChat (id, chatData) {
  return new Promise((resolve, reject) => {
    Chat.findOneAndUpdate({ _id: id }, chatData, { upsert: true })
      .then(data => {
        io.in(id).emit('notify-update-chat', { chatId: id, chatData })
        resolve(pick(data, publicChatFields))
      })
      .catch(error => reject(error.message))
  })
}

function deleteChannel(chatId) {
  return new Promise((resolve, reject) => {
    Chat
      .findById(chatId)
      .then(chat => {
        updateAllUsersInChat(chat.users, chatId, 'delete')
          .then(() => chat.remove())
          .then(() => {
            Message
              .deleteMany({ chatId })
              .then(() => {
                io.in(chatId).emit('notify-delete-chat', { chatId })
                resolve()
              })
          })
      })
      .catch(err => reject(err))
  })
}


module.exports = {
  importIO,
  getChats,
  getChatById,
  getChatsId,
  createChat,
  updateChat,
  deleteChannel
}
