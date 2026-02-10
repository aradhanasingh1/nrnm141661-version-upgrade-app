import { Router } from 'express'
import { ObjectId } from 'mongodb'
import { connect } from '../services/mongodb'
import { CreditApplication } from '../models/CreditApplication'

const router = Router()
const COLLECTION = 'credit_applications'

// CREATE application
router.post('/', async (req, res) => {
  try {
    const db = await connect()

    const application: CreditApplication = {
      ...req.body,
      status: 'CREATED',
      stage: 'INFO',
      createdAt: new Date()
      
    }

    console.log('Creating application:', application);

    const result = await db
      .collection(COLLECTION)
      .insertOne(application)

      console.log('Application created with ID:', result);

    res.status(201).json({
      id: result.insertedId,
      ...application
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to create application' })
  }
})

// GET all applications
router.get('/', async (_req, res) => {
  try {
    const db = await connect()
    const apps = await db
      .collection(COLLECTION)
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    res.json(apps)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch applications' })
  }
})

// GET application by ID
router.get('/:id', async (req, res) => {
  try {
    const db = await connect()

    const { id } = req.params

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid application id' })
    }

    const app = await db.collection(COLLECTION).findOne({
      _id: new ObjectId(id)
    })

    if (!app) {
      return res.status(404).json({ message: 'Application not found' })
    }

    res.json(app)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch application' })
  }
})


export default router
