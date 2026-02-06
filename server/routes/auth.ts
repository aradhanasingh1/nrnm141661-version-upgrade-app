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
  if (!req.body) {
    return res.status(400).json({ message: 'Request body is missing' })
  }
  const body = req.body as LoginBody
  const email = body.email
  const password = body.password

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing credentials' })
  }

  try {
    const db = await connect()
    const user = await db.collection('users').findOne({ email })

    console.log('User found:', user) // Debugging log

    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    console.log('Comparing passwords',password,user.password) // Debugging log

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


// user register post call
router.post('/register', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const db = await connect();
    
    // Check if user exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Insert user
    await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      createdAt: new Date()
    });

    return res.status(201).json({ success: true, message: 'User created' });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});
// to log out the user
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('token');
  return res.json({ success: true, message: 'Logged out successfully' });
});

export default router
