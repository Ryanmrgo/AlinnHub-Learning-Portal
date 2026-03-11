'use client'

import { AppContextProvider } from '@/app/context/AppContext'
import Navbar from '@/components/student/Navbar'
import MyEnrollments from '@/app/student/MyEnrollments'

export default function MyEnrollmentsPage() {
  return (
    <AppContextProvider>
      <Navbar />
      <MyEnrollments />
    </AppContextProvider>
  )
}
