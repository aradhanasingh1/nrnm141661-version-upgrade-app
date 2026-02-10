import React from 'react'
import MainLayout from '../components/Layout/MainLayout'
import Offers from '../components/Offers/Offers'

export default function Dashboard() {
  return (
    <MainLayout title="Dashboard">
      <Offers />
    </MainLayout>
  )
}