import express, { Request, Response } from 'express'
import next from 'next'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const PORT = 3000

app.prepare().then(() => {
  const server = express()

  server.use(bodyParser.json())
  server.use(cookieParser())

  // API routes
  server.use('/api/auth', require('./routes/auth'))

  // Next.js page handling
  server.get('*', (req: Request, res: Response) => {
    return handle(req, res)
  })

  server.listen(PORT, (err?: any) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${PORT}`)
  })
})
