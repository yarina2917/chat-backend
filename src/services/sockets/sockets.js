const messagesService = require('../messages/messages')
const chatsService = require('../chats/chats')
let user

function socketConnect (socket, io, userId) {
  chatsService.getChatsId(userId)
    .then(chats => {
      chats.forEach(chat => {
        console.log('JOIN to chat', chat)
        socket.join(chat)
      })
    })
    .catch(err => console.log('err', err))

  socket.on('disconnect', () => {
    console.log('user disconnected', user)
    chatsService.getChatsId(user)
      .then(chats => {
        chats.forEach(chat => {
          socket.leave(chat)
        })
      })
      .catch(err => console.log('err', err))
  })

  socket.on('typing', user => {
    socket.broadcast.emit('notifyTyping', user)
  })

  socket.on('stopTyping', user => {
    socket.broadcast.emit('notifyStopTyping', user)
  })

  socket.on('message', messageData => {
    messagesService.saveMessage(messageData)
      .then(data => {
        socket.in(messageData.chatId).emit('notifyMessage', data)
        // socket.to(messageData.chatId).emit('notifyMessage', data)
        // socket.broadcast.to(messageData.chatId).emit('notifyMessage', data)
        // socket.broadcast.emit('notifyStopTyping', data.user.username)
      })
      .catch(err => console.log(err))
  })

  socket.on('deleteMessages', data => {
    messagesService.deleteMessages(data.messages, data.chatId)
      .then(() => {
        // TODO: replace with room io.in('chat').emit()
        socket.emit('notifyDeleteMessage', data.messages)
        socket.broadcast.emit('notifyDeleteMessage', data.messages)
      })
      .catch(err => console.log(err))
  })
}

module.exports = socketConnect
