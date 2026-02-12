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

/* 🔥 INFO now stores dynamic ID */
const updateInfoSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  dob: z.string().min(1, 'Date of birth is required'),
  idType: z.enum(['PAN', 'AADHAR', 'PASSPORT']),
  idNumber: z.string().min(1, 'ID Number is required')
})

const kycSubmitSchema = z.object({
  idType: z.enum(['PAN', 'AADHAR', 'PASSPORT']),
  idNumber: z.string().min(1, 'ID Number is required'),
  address: z.string().min(1, 'Address is required')
})

const kycCompleteSchema = z.object({
  result: z.enum(['VERIFIED', 'FAILED'])
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
      id: new ObjectId().toHexString(),
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
   GET ALL
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
   GET BY ID
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
   UPDATE INFO (Now stores dynamic ID)
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
          status: 'IN_PROGRESS',
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

/* ======================================================
   KYC SUBMIT
====================================================== */
router.put('/:id/kyc/submit', async (req, res) => {
  try {
    const validation = kycSubmitSchema.safeParse(req.body)

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
          kyc: {
            ...validation.data,
            status: 'SUBMITTED'
          }
        }
      }
    )

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Application not found' })
    }

    res.json({
      success: true,
      message: 'KYC submitted successfully'
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to submit KYC' })
  }
})

/* ======================================================
   KYC COMPLETE (Dynamic DB Validation)
====================================================== */
router.put('/:id/kyc/complete', async (req, res) => {
  try {
    const validation = kycCompleteSchema.safeParse(req.body)

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

    const app = await db.collection(COLLECTION).findOne({
      _id: new ObjectId(id)
    })

    if (!app) {
      return res.status(404).json({ message: 'Application not found' })
    }

    const storedIdType = app.info?.idType
    const storedIdNumber = app.info?.idNumber

    const enteredIdType = app.kyc?.idType
    const enteredIdNumber = app.kyc?.idNumber

    let finalResult = validation.data.result

    /* 🔥 REAL DB VALIDATION */
    if (
      storedIdType !== enteredIdType ||
      storedIdNumber !== enteredIdNumber
    ) {
      finalResult = 'FAILED'
    }

    const updateData: any = {
      'kyc.status': finalResult
    }

    if (finalResult === 'VERIFIED') {
      updateData.stage = 'UNDERWRITING'
    }

    await db.collection(COLLECTION).updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    res.json({
      success: true,
      message:
        finalResult === 'VERIFIED'
          ? 'KYC verified. Stage moved to UNDERWRITING.'
          : 'KYC failed due to ID mismatch.'
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to complete KYC' })
  }
})

export default router
