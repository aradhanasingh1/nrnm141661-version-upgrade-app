import { Router } from 'express'
import { ObjectId } from 'mongodb'
import { connect } from '../services/mongodb'
import { CreditApplication } from '../models/CreditApplication'
import { z } from 'zod'

const router = Router()
const COLLECTION = 'credit_applications'

/* ======================================================
   ZOD SCHEMAS
====================================================== */

const createApplicationSchema = z.object({
  applicantName: z.string().min(1, 'Applicant name is required'),
  email: z.string().email('Invalid email'),
  mobile: z.string().min(10, 'Mobile number is required'),

  loanAmount: z.coerce.number().min(1, 'Loan amount is required'),
  annualIncome: z.coerce.number().min(1, 'Annual income is required'),

  loanType: z.string().min(1, 'Loan type is required'),
  employmentType: z.string().min(1, 'Employment type is required'),
  purpose: z.string().min(1, 'Purpose is required')
})

const updateInfoSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  dob: z.string().min(1, 'Date of birth is required'),
  pan: z.string().min(1, 'PAN is required')
})

/* ======================================================
   CREATE APPLICATION
====================================================== */
router.post('/', async (req, res) => {
  try {
    const validation = createApplicationSchema.safeParse(req.body)

    if (!validation.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validation.error.flatten()
      })
    }

    const db = await connect()

    const application: CreditApplication = {
      id: new ObjectId().toHexString(), // required by interface
      ...validation.data,
      status: 'CREATED',
      stage: 'INFO',
      createdAt: new Date()
    }

    const result = await db.collection(COLLECTION).insertOne(application)

    res.status(201).json({
      id: result.insertedId,
      ...application
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to create application' })
  }
})

/* ======================================================
   GET ALL APPLICATIONS
====================================================== */
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

/* ======================================================
   GET APPLICATION BY ID
====================================================== */
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

/* ======================================================
   UPDATE INFO
   PUT /applications/:id/info
====================================================== */
router.put('/:id/info', async (req, res) => {
  try {
    const validation = updateInfoSchema.safeParse(req.body)

    if (!validation.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: validation.error.flatten()
      })
    }

    const db = await connect()
    const { id } = req.params

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid application id' })
    }

    const result = await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          info: validation.data,
          stage: 'KYC'
        }
      }
    )

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Application not found' })
    }

    res.json({
      success: true,
      message: 'Info updated successfully. Stage moved to KYC.'
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to update application info' })
  }
})

export default router
