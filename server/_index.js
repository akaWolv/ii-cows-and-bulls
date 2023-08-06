import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import http from "http"
import { createServer as createViteServer } from 'vite'
import dotenv from 'dotenv'
import { Server as ServerIO } from "socket.io"

dotenv.config()

const APP_URL = process.env.APP_URL
const APP_PORT = process.env.APP_PORT
const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createServer() {
  const app = express()

  app.use(express.static(path.join(__dirname, "../public")));
  app.use('/assets', express.static(path.join(__dirname, '../dist/assets')))

  app.get("/api/v1", (req, res) => {
    res.json({
      project: "React and Express Boilerplate",
      from: "Vanaldito",
    });
  });

  // Create Vite server in middleware mode and configure the app type as
  // 'custom', disabling Vite's own HTML serving logic so parent server
  // can take control
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      watch: {
        // During tests we edit the files too fast and sometimes chokidar
        // misses change events, so enforce polling for consistency
        usePolling: true,
        interval: 100,
      },
    },
    appType: 'custom'
  })

  // Use vite's connect instance as middleware. If you use your own
  // express router (express.Router()), you should use router.use
  app.use(vite.middlewares)

  // app.use('*', async (req, res) => {
  //   // serve index.html - we will tackle this next
  // })
  app.get("/*", (_req, res) => {
    res.sendFile(path.join(__dirname, "../dist", "index.html"));
  })

  return {
    app
  }
}



createServer().then(({ app }) => {
  const server = http.createServer(app)
  const io = new ServerIO(server)

  io.on('connection', (socket) => {
    console.log('a user connected');
  })

  server.listen(APP_PORT, () => {
    console.log(`[APP SERVER] Cows-and-Bulls listen on port ${APP_PORT} || ${APP_URL}`)
  })
})
