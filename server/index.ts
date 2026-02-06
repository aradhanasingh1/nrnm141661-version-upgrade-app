// import express, { Request, Response } from 'express'
// import next from 'next'
// import bodyParser from 'body-parser'
// import cookieParser from 'cookie-parser'

// const dev = process.env.NODE_ENV !== 'production'
// const app = next({ dev })
// const handle = app.getRequestHandler()

// const PORT = 3000

// app.prepare().then(() => {
//   const server = express()

//   server.use(bodyParser.json())
//   server.use(cookieParser())

//   // API routes
//   server.use('/api/auth', require('./routes/auth'))

//   // Next.js page handling
//   server.get('*', (req: Request, res: Response) => {
//     return handle(req, res)
//   })

//   server.listen(PORT, (err?: any) => {
//     if (err) throw err
//     console.log(`> Ready on http://localhost:${PORT}`)
//   })
// })

// import express, { Request, Response } from 'express'
// import next from 'next'
// import bodyParser from 'body-parser'
// import cookieParser from 'cookie-parser'
// import authRoutes from './routes/auth' // <- ES import
 
// const dev = process.env.NODE_ENV !== 'production'
// const app = next({ dev })
// const handle = app.getRequestHandler()
 
// const PORT = 3000
 
// app.prepare().then(() => {
//   const server = express()
 
//   server.use(bodyParser.json())
//   server.use(cookieParser())
 
//   // API routes
//   server.use('/api/auth', authRoutes) // <- use the imported router directly
 
//   // Next.js page handling
//   server.get('*', (req: Request, res: Response) => {
//     return handle(req, res)
//   })
 
//   server.listen(PORT, (err?: any) => {
//     if (err) throw err
//     console.log(`> Ready on http://localhost:${PORT}`)
//   })
// })

// import express from 'express'
// import next from 'next'
// import path from 'path'

// const port = 3000
// const dev = process.env.NODE_ENV !== 'production'

// async function start() {
//   const app = next({
//     dev,
//     dir: path.join(__dirname, '..')
//   })

//   const handle = app.getRequestHandler()

//   await app.prepare()   // ⭐ MUST be awaited before creating server

//   const server = express()

//   // API routes
//   const authRouter = require('./routes/auth').default
//   server.use('/api/auth', authRouter)

//   // Let Next handle EVERYTHING else
//   server.all('*', (req, res) => handle(req, res))

//   server.listen(port, () => {
//     console.log(`> Ready on http://localhost:${port}`)
//   })
// }

// start()


import path from 'path'
process.chdir(path.join(__dirname, '..'))
import auth from './middleware/auth';

import express from 'express'
import next from 'next'

console.log('NODE_ENV =', process.env.NODE_ENV)

const port = 3000
const dev = true
// const dev = process.env.NODE_ENV !== 'production'


const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()
server.use(express.json())
  const authRouter = require('./routes/auth').default
  server.use('/api/auth', authRouter)


  server.all('*', (req, res) => handle(req, res))

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})
