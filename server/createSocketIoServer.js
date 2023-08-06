import http from 'http';
import { Server as ServerIO } from 'socket.io'
import { instrument } from '@socket.io/admin-ui'

const createSocketIoServer = async ({ app }) => {
  const httpServer = http.createServer(app)
  const io = new ServerIO(httpServer)

  // instrument(io, {
  //   auth: false,
  //   mode: "development",
  // })

  io.on('connection', (socket) => {
    console.log('a user connected');
    socket.broadcast.emit('chat message', 'hello');
    io.emit('chat message', 'hi');

    socket.on('chat message', (msg) => {
      console.log('message: ' + msg);
      io.emit('chat message', 'niezła wiadomość: ' + msg)
      socket.broadcast.emit('chat message', 'hello');
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  })

  return {
    app,
    httpServer
  }
}

export default createSocketIoServer
