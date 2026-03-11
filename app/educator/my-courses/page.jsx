'use client'

import { AppContextProvider } from '@/app/context/AppContext'
import Educator from '@/app/educator/Educator'
import MyCourses from '@/app/educator/MyCourses'

export default function MyCoursesPage() {
  return (
    <AppContextProvider>
      <Educator>
        <MyCourses />
      </Educator>
    </AppContextProvider>
  )
}