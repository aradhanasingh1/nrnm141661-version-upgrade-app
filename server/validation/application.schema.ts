import { z } from 'zod'

const trimString = (val: unknown) =>
  typeof val === 'string' ? val.trim() : val

const lowerTrimString = (val: unknown) =>
  typeof val === 'string' ? val.trim().toLowerCase() : val

export const createApplicationSchema = z.object({
  applicantName: z.preprocess(
    trimString,
    z.string().min(1, 'Applicant name is required')
  ),

  applicantEmail: z.preprocess(
    lowerTrimString,
    z.string().email('Invalid email')
  ),

  applicantPhone: z.preprocess(
    trimString,
    z.string().regex(/^[0-9]{10}$/, 'Phone must be 10 digits')
  ),

  amount: z.preprocess(
    val => Number(val),
    z.number().positive('Amount must be a positive number')
  ),

  currency: z.preprocess(
    trimString,
    z.string().min(1, 'Currency is required')
  ),

  applicationType: z.preprocess(
    trimString,
    z.string().min(1, 'Application type is required')
  ),

  purpose: z.preprocess(
    trimString,
    z.string().min(1, 'Purpose is required')
  ),

  purposeDescription: z.preprocess(
    trimString,
    z.string().optional()
  )
})
