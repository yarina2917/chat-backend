const uuid = require('uuid')
const pick = require('lodash/pick')

const { normalizeDialog, updateAllUsersInChat, getLastMessageOfChats, publicChatFields } = require('./chat-utils')

const Chat = require('../../models/chat')
const User = require('../../models/user')
const Message = require('../../models/message')

const { DIALOG } = require('../../config/chat-types')
const { REPORT } = require('../../config/message-types')

let io
function importIO (importIO) {
  io = importIO
}

function getChats (userId) {
  return new Promise((resolve, reject) => {
    User.findById(userId)
      .populate({ path: 'chats' })
      .then(user => normalizeDialog(user.chats, userId))
      .then(data => getLastMessageOfChats(data))
      .then(data => {
        resolve(data.sort((a, b) =>
          a.lastMessage.createdAt > b.lastMessage.createdAt ? -1 : a.lastMessage.createdAt < b.lastMessage.createdAt ? 1 : 0
        ))
      })
      .catch(error => reject(error))
  })
}

function getChatsId (userId) {
  return new Promise((resolve, reject) => {
    User.findById(userId)
      .then(data => resolve(data.chats))
      .catch(error => reject(error))
  })
}

function getChatById (chatId, userId) {
  return new Promise((resolve, reject) => {
    Chat.findById(chatId)
      .populate({ path: 'users' })
      .then(data => {
        if (data.chatType === DIALOG) {
          normalizeDialog(data, userId)
            .then(chat => resolve(chat))
            .catch(error => reject(error))
        } else {
          resolve(pick(data, publicChatFields))
        }
      })
      .catch(error => reject(error))
  })
}

function createChat (author, chatData) {
  return new Promise((resolve, reject) => {
    User.findById(author)
      .populate('chats')
      .then(async currentUser => {
        const dialogExist = checkDialogs(chatData, currentUser)
        if (dialogExist) {
          normalizeDialog(dialogExist, author)
            .then(chat => resolve({ message: 'Chat already exist!', chat }))
            .catch(err => reject(err))
        } else {
          if (chatData.chatType === DIALOG) {
            chatData.chatName = uuid.v4()
            await saveContact(chatData.users[0], author.toString())
          }
          const chat = new Chat(chatData)
          chat.author = author
          chat.users.push(author)
          chat.admins.push(author)
          chat.save()
            .then(async data => {
              await new Message({
                chatId: data._id,
                authorId: author,
                message: `New chat was created by ${currentUser.username}`,
                messageType: REPORT
              }).save()
              updateAllUsersInChat(chatData.users, data._id, 'add')
                .then(async () => {
                  currentUser.chats.push(data._id)
                  await currentUser.save()
                  return getLastMessageOfChats(data)
                })
                .then(chat => chatData.chatType === DIALOG ? normalizeDialog(chat, author) : pick(chat, publicChatFields))
                .then(async chat => {
                  chatData.chatType === DIALOG ? await joinDialog(chat, author, chatData.users[0]) : await joinChat(chat)
                  resolve({ message: 'New chat!', chat })
                })
            })
            .catch(error => reject(error))
        }
      })
      .catch(error => reject(error))
  })
}

function checkDialogs(chatData, currentUser) {
  return chatData.chatType === DIALOG &&
  currentUser.chats.find(chat => chat.chatType === DIALOG &&
    (chat.users.find(user => user.toString() === chatData.users[0].toString())))
}

function saveContact (user, newContact) {
  User
    .findById(user)
    .then(contact => {
      if (contact.contacts.indexOf(newContact) === -1) {
        contact.contacts.push(newContact)
      }
      return contact.save()
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

function joinDialog (chat, author, contact) {
  const connected = require('../sockets/sockets').getConnectedUsers()
  chat.users.forEach(async userId => {
    const connectedUser = connected.find(user => user.userId === userId.toString())
    if (connectedUser) {
      io.sockets.connected[connectedUser.socketId].join(chat._id)
      if (userId.toString() === author.toString()) {
        io.to(connectedUser.socketId).emit('notify-add-chat', chat)
      } else {
        const contactChat = await normalizeDialog(chat, contact)
        io.to(connectedUser.socketId).emit('notify-add-chat', contactChat)
      }
    }
  })
}

function updateChat (id, chatData) {
  return new Promise((resolve, reject) => {
    Chat.findOneAndUpdate({ _id: id }, chatData, { upsert: true })
      .then(data => {
        io.in(id).emit('notify-update-chat', { chatId: id, chatData })
        resolve(pick(data, publicChatFields))
      })
      .catch(error => reject(error))
  })
}

function deleteChannel (chatId) {
  return new Promise((resolve, reject) => {
    Chat
      .findById(chatId)
      .then(chat => {
        updateAllUsersInChat(chat.users, chatId, 'delete')
          .then(() => chat.remove())
          .then(() => Message.deleteMany({ chatId }))
          .then(() => {
            io.in(chatId).emit('notify-delete-chat', { chatId })
            resolve({ message: 'Success' })
          })
      })
      .catch(error => reject(error))
  })
}

// TODO optimize with aggregate
// function getChats (userId) {
//   return new Promise((resolve, reject) => {
//     Message.aggregate(
//       [
//         // Matching pipeline, similar to find
//         {
//           '$match': {
//             'chatId': { "$in": user.chats }
//           }
//         },
//         // Grouping pipeline
//         {
//           '$group': {
//             '_id': '$chatId',
//             'chatId': {
//               '$first': '$chatId'
//             },
//             'lastMessage': {
//               '$last': '$_id'
//             },
//             'createdAt': {
//               '$first': '$createdAt'
//             }
//           }
//         },
//         // Sorting pipeline
//         {
//           '$sort': {
//             'createdAt': -1
//           }
//         },
//         // Project pipeline, similar to select
//         {
//           '$project': {
//             '_id': 0,
//             'chatId': '$_id',
//             'lastMessage': 1,
//             'createdAt': 1
//           }
//         }
//       ],
//       function (err, messages) {
//         // Result is an array of documents
//         if (err) {
//           console.log('err', err)
//         } else {
//           Message.populate(messages, [
//             {
//               path: 'lastMessage',
//               populate: {
//                 path: 'authorId',
//                 select: ['avatar', 'createdAt', 'authotId', 'username']
//               },
//               select: ['chatId', 'createdAt', 'message']
//             },
//             { path: 'chatId' }]
//           ).then(result => resolve(result.filter(chat => chat.chatId)))
//         }
//       }
//     )
//   })
// }

module.exports = {
  importIO,
  getChats,
  getChatById,
  getChatsId,
  createChat,
  updateChat,
  deleteChannel
}
