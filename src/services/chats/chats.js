const uuid = require('uuid')
const pick = require('lodash/pick')
const createError = require('http-errors')

const publicChatFields = ['_id', 'chatName', 'description', 'chatType', 'avatar', 'author', 'users', 'admins', 'lastMessage', 'createdAt']
const mainChatFields = ['_id', 'chatName', 'chatType', 'avatar', 'users', 'admins']

const Chat = require('../../models/chat')
const User = require('../../models/user')

const { CHANNEL, DIALOG, GROUP } = require('../../config/chat-types')

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
        normalizeDialog(data.chats)
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

function getChatById (chatId) {
  return new Promise((resolve, reject) => {
    Chat.findById(chatId)
      .populate({ path: 'users' })
      .populate({ path: 'avatar.chatId' })
      .then(data => {
        normalizeDialog(data)
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
          normalizeDialog(chatExist)
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
            updateAllUsersInChat(chatData.users, data._id)
              .then(async () => {
                currentUser.chats.push(data._id)
                await currentUser.save()
                normalizeDialog(data)
                  .then(chat => {
                    resolve({
                      message: 'New chat!',
                      chat: chat
                    })
                  })
              })
          })
          .catch(reject)
      })
      .catch(reject)
  })
}

async function normalizeDialog (data, currentUserId) {
  return new Promise((resolve, reject) => {
    if (Array.isArray(data)) {
      Promise.all(data.map(chat => {
        const recipient = chat.users.find(userId => userId !== currentUserId)
        return normalizeRecipient(chat, recipient)
      }))
        .then(data => resolve(data))
        .catch(err => reject(err))
    } else {
      const recipient = data.users.find(userId => userId !== currentUserId)
      normalizeRecipient(data, recipient)
        .then(chat => resolve(chat))
        .catch(reject)
    }
  })
}

function normalizeRecipient (data, recipient) {
  return User.findById(recipient._id)
    .then(user => {
      if (data.chatType === DIALOG) {
        const newData = Object.assign({ recipientId: recipient._id }, pick(data, publicChatFields))
        newData.recipientId = recipient._id
        newData.chatName = user.username
        newData.avatar = user.avatar
        return newData
      }
      return pick(data, publicChatFields)
    })
}

function updateAllUsersInChat (users, chatId) {
  return Promise.all(users.map(user => {
    return User.findById(user)
      .then(async currentUser => {
        if (!currentUser.chats) {
          currentUser = []
        }
        if (!currentUser.chats.indexOf(chatId) > -1) {
          currentUser.chats.push(chatId)
          const savedUser = await currentUser.save()
          return savedUser
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
        updateAllUsersInChat(users, chatId)
          .then(async users => {
            await chat.save()
            resolve(users)
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
          await chat.save()
          User.findById(userId)
            .then(async user => {
              const userPosition = user.chats.indexOf(chatId)
              user.chats.splice(userPosition, 1)
              await user.save()
              resolve({ userId: userId, chatId: chatId })
            })
            .catch(reject)
        } else {
          reject(new Error('The user was not found!'))
        }
      })
      .catch(reject)
  })
}

module.exports = {
  getChats,
  getChatById,
  getChatsId,
  createChat,
  updateChat,
  addMembers,
  removeMember
}
