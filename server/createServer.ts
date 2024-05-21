import express from 'express';
import path from 'path';
import compression from 'compression';

import { createServer as createViteServer } from 'vite';
import cors from 'cors';
import { apiGetAll } from 'server/api/admin';


const createServer = async () => {
  const app = express()
  app.use(cors())

  // server rendered pages
  app.get("/api/admin/getall", apiGetAll);

  if (process.env.NODE_ENV === 'production') {
    app.use(compression())
    app.use('/assets', express.static(path.resolve(__dirname + '/../dist/assets')));
    // @ts-ignore
    app.use('*', function(req, res) {
      res.sendFile(path.resolve(__dirname + '/../dist/index.html'));
    });
  } else {
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
      appType: 'spa'
    })

    // Use vite's connect instance as middleware. If you use your own
    // express router (express.Router()), you should use router.use
    app.use(vite.middlewares)
  }

  // app.use('*', async (req, res) => {
  //   // Since `appType` is `'custom'`, should serve response here.
  //   // Note: if `appType` is `'spa'` or `'mpa'`, Vite includes middlewares to handle
  //   // HTML requests and 404s so user middlewares should be added
  //   // before Vite's middlewares to take effect instead
  // })

  return {
    app
  }
}

export default createServer
