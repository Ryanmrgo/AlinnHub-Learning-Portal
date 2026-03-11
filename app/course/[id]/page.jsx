'use client'

import { AppContextProvider } from '@/app/context/AppContext'
import Navbar from '@/components/student/Navbar'
import CourseDetails from '@/app/student/CourseDetails'

export default function CourseDetailsPage() {
  return (
    <AppContextProvider>
      <Navbar />
      <CourseDetails />
    </AppContextProvider>
  )
}
