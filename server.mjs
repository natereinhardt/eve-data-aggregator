// server.mjs
import { createServer } from 'node:http'
import { main as runOauthFlow } from './eve-esi/esiOauthNative.mjs'

const server = createServer((req, res) => {
  if (req.url === '/run-oauth' && req.method === 'GET') {
    runOauthFlow()
      .then(() => {
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('OAuth flow completed successfully.\n')
      })
      .catch((error) => {
        res.writeHead(500, { 'Content-Type': 'text/plain' })
        res.end(`Error during OAuth flow: ${error.message}\n`)
      })
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('Not Found\n')
  }
})

// starts a simple http server locally on port 3000
server.listen(3000, '127.0.0.1', () => {
  console.log('Listening on 127.0.0.1:3000')
})

// run with `node server.mjs`