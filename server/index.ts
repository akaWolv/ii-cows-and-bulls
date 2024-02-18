import dotenv from 'dotenv'

import createServer from 'server/createServer.ts'
import createSocketIoServer from 'server/createSocketIoServer.ts';

dotenv.config()

const APP_URL = process.env.APP_URL || 'http://localhost:3001'
const APP_PORT = process.env.APP_PORT || '3001'

void createServer()
  .then(createSocketIoServer)
  .then(({httpServer}) => {
    httpServer.listen(APP_PORT, () => {
      console.log(`[APP SERVER] Cows-and-Bulls listen on port ${APP_PORT} || ${APP_URL}`)
    })
  })
