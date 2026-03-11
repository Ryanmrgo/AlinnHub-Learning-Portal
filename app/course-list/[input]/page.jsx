'use client'

import { AppContextProvider } from '@/app/context/AppContext'
import Navbar from '@/components/student/Navbar'
import CoursesList from '@/app/student/CoursesList'

export default function CoursesListWithInputPage() {
  return (
    <AppContextProvider>
      <Navbar />
      <CoursesList />
    </AppContextProvider>
  )
}
