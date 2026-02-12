import React from 'react'
import ApplicationKYC from '../../components/Applications/ApplicationKYC'
import MainLayout from '../../components/Layout/MainLayout'

export default function InfoPage() {
    
  return(
  <MainLayout title='Applicant KYC Details'> 
  <ApplicationKYC />
  </MainLayout>
  )
}