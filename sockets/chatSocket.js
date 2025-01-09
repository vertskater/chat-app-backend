import {saveMessage} from '../db/messages.js'

export default (io) => {
  io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('joinRoom', (room) => {
      socket.join(room);
    });

    socket.on('sendMessage', async (data) => {
      const {room, content, userId} = data;
      const message = await saveMessage({room, content, userId});
      io.to(room).emit('receiveMessage', message);
    })
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  })
}