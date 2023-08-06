import dotenv from 'dotenv'

import createServer from './createServer.js'
import createSocketIoServer from './createSocketIoServer.js'

dotenv.config()

const APP_URL = process.env.APP_URL
const APP_PORT = process.env.APP_PORT
// const __dirname = path.dirname(fileURLToPath(import.meta.url))

createServer()
  .then(createSocketIoServer)
  .then(({ httpServer }) => {
    httpServer.listen(APP_PORT, () => {
      console.log(`[APP SERVER] Cows-and-Bulls listen on port ${APP_PORT} || ${APP_URL}`)
    })
  })
