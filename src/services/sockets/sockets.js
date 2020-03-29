const messagesService = require('../messages/messages')

function socketConnect (socket) {
  socket.on('disconnect', () => {
    console.log('user disconnected')
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
        // TODO: replace with room io.in('chat').emit()
        socket.emit('notifyMessage', data)
        socket.broadcast.emit('notifyMessage', data)
        socket.broadcast.emit('notifyStopTyping', data.user.username)
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
