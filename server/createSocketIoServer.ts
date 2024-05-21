import http from 'http';
import { Server as ServerIO } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import * as core from 'express-serve-static-core';
import { MSG_CONNECT_TO_GAME_BY_CODES, MSG_GUESS, MSG_QUIT_GAME, MSG_SET_NUMBER_FOR_USER_IN_GAME } from 'constants/SocketMessages.ts';
import messageHandler from 'server/messageHandler.ts';
import { connectToGameByCodesMsg, guessMsg, setNumberForUserInGameMsg } from 'types/SocketMessages.ts';
import dotenv from 'dotenv'

dotenv.config()

type Params = {
  app: core.Express
}

const createSocketIoServer = ({app}: Params) => {
  const httpServer = http.createServer(app)
  const io = new ServerIO(httpServer, {
    cors: {
      origin: ["https://admin.socket.io"],
      credentials: true
    }
  })

  instrument(io, {
    auth: {
      type: "basic",
      username: "admin",
      password: process.env.ADMIN_IO_PASSWORD || 'zxc' // FranekMajeranek@50
    },
    mode: "development" // "production"
  })

  io.on('connection', (socket) => {
    const handle = messageHandler(io, socket)

    console.log('a user connected');

    socket.on(MSG_CONNECT_TO_GAME_BY_CODES, (msg) => {
      handle.connectToGameByCodes(msg as connectToGameByCodesMsg)
    });

    socket.on(MSG_SET_NUMBER_FOR_USER_IN_GAME, (msg) => {
      handle.setNumberForUserInGame(msg as setNumberForUserInGameMsg)
    });

    socket.on(MSG_GUESS, (msg) => {
      handle.guess(msg as guessMsg)
    });

    socket.on(MSG_QUIT_GAME, () => {
      handle.disconnectUserFromGame()
      console.log('user quit game');
    });

    socket.on('disconnect', () => {
      handle.disconnectUserFromGame()
      console.log('user disconnected');
    });
  })

  return {
    app,
    httpServer
  }
}

export default createSocketIoServer
