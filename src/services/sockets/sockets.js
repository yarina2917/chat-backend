const messagesService = require('../messages/messages')
const chatsService = require('../chats/chats')
const chatsMembersService = require('../chats/chats-members')

let connected = []

function socketConnect (io) {
  io.sockets.on('connection', (socket) => {
    const userId = socket.handshake.query.userId
    connected.push({ userId, socketId: socket.id })

    chatsService.getChatsId(userId)
      .then(chats => chats.forEach(chat => socket.join(chat)))
      .catch(error => console.error('Get chats data error', error))

    socket.on('disconnect', () => {
      chatsService.getChatsId(userId)
        .then(chats => {
          chats.forEach(chat => socket.leave(chat))
          connected = connected.filter(user => user.userId !== userId)
        })
        .catch(error => console.error('Get chats data error', error))
    })

    socket.on('typing', data => {
      socket.in(data.chatId).emit('notify-typing', data)
    })

    socket.on('stop-typing', data => {
      socket.in(data.chatId).emit('notify-stop-typing', data)
    })

    socket.on('message', messageData => {
      messagesService.saveMessage(messageData)
        .then(data => {
          socket.in(messageData.chatId).emit('notify-stop-typing', { chatId: messageData.chatId, username: data.user.username })
          io.in(messageData.chatId).emit('notify-message', data)
        })
        .catch(error => console.error('Save message error', error))
    })

    socket.on('delete-messages', data => {
      messagesService.deleteMessages(data.messages)
        .then(() => {
          io.in(data.chatId).emit('notify-delete-message', { chatId: data.chatId, messages: data.messages })
        })
        .catch(error => console.error('Delete message error', error))
    })

    socket.on('add-members', data => {
      chatsMembersService.addMembers(data.chatId, data.users)
        .then((res) => {
          io.in(data.chatId).emit('notify-add-members', { users: res.users, chatId: data.chatId })
          data.users.forEach(userId => {
            const connectedUser = connected.find(user => user.userId === userId)
            if (connectedUser) {
              io.sockets.connected[connectedUser.socketId].join(data.chatId)
              io.to(connectedUser.socketId).emit('notify-add-chat', res.chat)
            }
          })
        })
        .catch(error => console.error('Add member error', error))
    })

    socket.on('remove-members', data => {
      chatsMembersService.removeMember(data.chatId, data.userId)
        .then(res => {
          io.in(data.chatId).emit('notify-remove-members', res)
          const connectedUser = connected.find(user => user.userId === data.userId)
          if (connectedUser) {
            io.sockets.connected[connectedUser.socketId].leave(data.chatId)
          }
        })
        .catch(error => console.error('Remove member error', error))
    })
  })
}

function getConnectedUsers () {
  return connected
}

module.exports = {
  socketConnect,
  getConnectedUsers
}
