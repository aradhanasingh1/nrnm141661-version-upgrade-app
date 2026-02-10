import React from 'react'
import ApplicationDetail from '../components/Applications/ApplicationDetail'
import MainLayout from '../components/Layout/MainLayout'

export default function ApplicationDetailPage() {
  return (
    <MainLayout title="Application Details">
      <ApplicationDetail />
    </MainLayout>
  )
}
