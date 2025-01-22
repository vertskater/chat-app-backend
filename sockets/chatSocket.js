import {saveMessage} from '../db/messages.js'

export default (io) => {
  io.on('connection', (socket) => {
    console.log('user connected');
    //console.log("Handshake data:", socket.handshake);

    socket.on('joinRoom', (room) => {
      socket.join(room);
    });

    socket.on('sendMessage', async (data) => {
      const {room, content} = data;
      const message = await saveMessage({room, content, userId: socket.user});
      io.to(room).emit('receiveMessage', message);
    })
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  })
}