import http from 'http';
import { Server as ServerIO } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import * as core from 'express-serve-static-core';
import { CONNECT_TO_GAME_BY_CODES, GUESS, SET_NUMBER_FOR_USER_IN_GAME } from 'constants/SocketMessages.ts';
import messageHandler, { connectToGameByCodes, setNumberForUserInGame, guess } from 'server/messageHandler.ts';

type Params = {
  app: core.Express
}

const createSocketIoServer = ({app}: Params) => {
  const httpServer = http.createServer(app)
  const io = new ServerIO(httpServer)

  instrument(io, {
    auth: false,
    mode: "development" // "production"
  })

  io.on('connection', (socket) => {
    const handle = messageHandler(io, socket)

    console.log('a user connected');

    socket.on(CONNECT_TO_GAME_BY_CODES, (msg) => {
      handle.connectToGameByCodes(msg as connectToGameByCodes)
    });

    socket.on(SET_NUMBER_FOR_USER_IN_GAME, (msg) => {
      handle.setNumberForUserInGame(msg as setNumberForUserInGame)
    });

    socket.on(GUESS, (msg) => {
      handle.guess(msg as guess)
    });

    socket.on('disconnect', () => {
      handle.disconnectUserFromGame()
      // handle.unsubscribeUserFromGame()
      console.log('user disconnected');
    });
  })

  return {
    app,
    httpServer
  }
}

export default createSocketIoServer
