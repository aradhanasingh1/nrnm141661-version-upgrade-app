import path from "path"
process.chdir(path.join(__dirname, ".."))

import express from "express"
import next from "next"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"

import authRouter from "./routes/auth"
import profileRouter from "./routes/profile"

const port = 3000
const dev = process.env.NODE_ENV !== "production"

const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = express()

  // IMPORTANT
  server.use(bodyParser.json())
  server.use(cookieParser())

  // API routes
  server.use("/api/auth", authRouter)
  server.use("/api/profile", profileRouter)

  // Next handles pages
  server.all("*", (req, res) => handle(req, res))

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})
