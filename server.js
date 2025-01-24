import * as http from 'node:http'
import { Server } from 'socket.io'
import chatSocket from './sockets/chatSocket.js'
import app from './app.js'
import authenticateSocket from './controllers/authSocket.js'


const server = http.createServer(app);

const io = new Server(server);

/*{
  cors: {
    origin: 'http://localhost:5173', // Allow your frontend's URL
      methods: ['GET', 'POST'],       // Specify allowed methods
      credentials: true,              // Allow cookies or authorization headers
 }*/
io.use(authenticateSocket);
chatSocket(io);


const PORT = process.env.PORT || 3000;
server.listen(PORT);


