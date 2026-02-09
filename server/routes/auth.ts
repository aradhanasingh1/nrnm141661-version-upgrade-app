import * as express from "express"
import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import { connect } from "../services/mongodb"
import { sign } from "../services/jwt"

const router = express.Router()

router.post("/register", async (req: Request, res: Response) => {
  const { email, password, role } = req.body

  if (!email || !password || !role) {
    return res.status(400).json({ message: "Missing fields" })
  }

  if (!["USER", "UNDERWRITER", "ADMIN"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" })
  }

  try {
    const db = await connect()

    const existing = await db.collection("users").findOne({ email })
    if (existing) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashed = bcrypt.hashSync(password, 10)

    await db.collection("users").insertOne({
      email,
      password: hashed,
      role
    })

    return res.json({ success: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: "Server error" })
  }
})

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: "Missing credentials" })
  }

  try {
    const db = await connect()
    const user = await db.collection("users").findOne({ email })

    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    const isMatch = bcrypt.compareSync(password, user.password)

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" })
    }

    const token = sign({
      id: user._id,
      email: user.email,
      role: user.role
    })

    res.cookie("token", token, {
      httpOnly: true
    })

    return res.json({
      success: true,
      role: user.role
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: "Server error" })
  }
})

router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("token")
  return res.json({ success: true })
})

export default router
