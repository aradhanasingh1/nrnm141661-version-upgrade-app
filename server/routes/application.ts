import * as express from 'express'
import { Request, Response } from 'express'
import { connect } from '../services/mongodb'
import { v4 as uuidv4 } from 'uuid'
import { createApplicationSchema } from '../validation/application.schema'
import { ZodError } from 'zod'



const router = express.Router()

// create application
router.post('/create', async (req: Request, res: Response) => {
  try {
    // ✅ Zod validation + normalization
    const data = createApplicationSchema.parse(req.body)

    const db = await connect()

    const applicationNumber = `APP-${uuidv4()}`

    // Extra safety check (optional but fine)
    const existingApplication = await db
      .collection('applications')
      .findOne({ applicationNumber })

    if (existingApplication) {
      return res.status(409).json({
        message: 'Application already present with this application number'
      })
    }

    const application = {
      applicationNumber,
      ...data,
      purposeDescription: data.purposeDescription || '',
      status: 'SUBMITTED',
      stage: 'APPLICATION',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await db.collection('applications').insertOne(application)

    return res.status(201).json({
      success: true,
      message: 'Application created successfully',
      applicationNumber
    })
  } catch (err) {
    // ❌ Zod validation error
    if (err instanceof ZodError) {
      console.warn('Validation error:', err.errors)
      return res.status(400).json({
        message: err.errors[0].message
      })
    }

    console.error('Create application error:', err)
    return res.status(500).json({
      message: 'Server error'
    })
  }
})


//get all applications
router.get('/applications', async (req: Request, res: Response) => {
  try {
    const db = await connect()

    const applications = await db
      .collection('applications')
      .find({})
      .sort({ createdAt: -1 })
      .project({
        _id: 0, // hide Mongo internal id
        applicationNumber: 1,
        applicantName: 1,
        applicantEmail: 1,
        applicantPhone: 1,
        amount: 1,
        currency: 1,
        applicationType: 1,
        purpose: 1,
        purposeDescription: 1
      })
      .toArray()

    return res.status(200).json(applications)
  } catch (err) {
    console.error('Fetch applications error:', err)
    return res.status(500).json({
      message: 'Server error'
    })
  }
})


// GET application by applicationNumber
router.get('/:applicationNumber', async (req: Request, res: Response) => {
  const { applicationNumber } = req.params

  if (!applicationNumber) {
    return res.status(400).json({
      message: 'Application number is required'
    })
  }

  try {
    const db = await connect()

    const application = await db
      .collection('applications')
      .findOne(
        { applicationNumber },
        {
          projection: {
            _id: 0,
            applicationNumber: 1,
            applicantName: 1,
            applicantEmail: 1,
            applicantPhone: 1,
            amount: 1,
            currency: 1,
            applicationType: 1,
            purpose: 1,
            purposeDescription: 1
          }
        }
      )

    if (!application) {
      return res.status(404).json({
        message: 'Application not found'
      })
    }

    return res.status(200).json(application)
  } catch (err) {
    console.error('Fetch application error:', err)
    return res.status(500).json({
      message: 'Server error'
    })
  }
})

export default router
