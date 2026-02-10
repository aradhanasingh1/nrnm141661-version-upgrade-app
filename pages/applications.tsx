import React from 'react'
import MainLayout from '../components/Layout/MainLayout'
import ApplicationsList from '../components/Applications/ApplicationList'

export default function Applications() {
  return (
    <MainLayout title="Applications">
      <ApplicationsList />
    </MainLayout>
  )
}


