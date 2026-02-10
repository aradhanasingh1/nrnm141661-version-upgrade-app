export type ApplicationStatus =
  | 'CREATED'
  | 'IN_PROGRESS'
  | 'APPROVED'
  | 'REJECTED'

  export type ApplicationStage = 'INFO' | 'KYC' | 'UNDERWRITING' | 'DECISION'

export interface CreditApplication {
  id: string
  applicantName: string
  email: string
  mobile: string
  loanAmount: number
  loanType: string
  employmentType: string
  annualIncome: number
  purpose: string
  status: ApplicationStatus
  stage: ApplicationStage
  createdAt: Date
}
