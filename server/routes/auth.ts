import * as express from 'express'
import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { connect } from '../services/mongodb'
import { sign } from '../services/jwt'

const router = express.Router()

interface LoginBody {
  email: string
  password: string
}

router.post('/login', async (req: Request, res: Response) => {
  const body = req.body as LoginBody
  const email = body.email
  const password = body.password

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing credentials' })
  }

  try {
    const db = await connect()
    const user = await db.collection('users').findOne({ email })

    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    const isMatch = bcrypt.compareSync(password, user.password)

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' })
    }

    const token = sign({
      id: user._id,
      email: user.email
    })

    res.cookie('token', token, {
      httpOnly: true
    })

    return res.json({ success: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
})

export default router
