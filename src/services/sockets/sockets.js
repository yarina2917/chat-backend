const messagesService = require('../messages/messages')
const chatsService = require('../chats/chats')

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
    console.log('user disconnected', userId)
    chatsService.getChatsId(userId)
      .then(chats => {
        chats.forEach(chat => socket.leave(chat))
      })
      .catch(err => console.log('err', err))
  })

  socket.on('typing', data => {
    socket.in(data.chatId).emit('notifyTyping', data.username)
  })

  socket.on('stopTyping', data => {
    socket.in(data.chatId).emit('notifyStopTyping', data.username)
  })

  socket.on('message', messageData => {
    messagesService.saveMessage(messageData)
      .then(data => {
        socket.in(messageData.chatId).emit('notifyStopTyping', data.user.username)
        io.in(messageData.chatId).emit('notifyMessage', data)
      })
      .catch(err => console.log(err))
  })

  socket.on('deleteMessages', data => {
    messagesService.deleteMessages(data.messages, data.chatId)
      .then(() => {
        io.in(data.chatId).emit('notifyDeleteMessage', data.messages)
      })
      .catch(err => console.log(err))
  })
}

module.exports = socketConnect
