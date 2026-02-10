import React from 'react'
import MainLayout from '../components/Layout/MainLayout'
import DashboardPage from '../components/Dashboard/DashboardPage'

export default function Dashboard() {
  return (
    <MainLayout title="Dashboard">
      <DashboardPage />
    </MainLayout>
  )
}

