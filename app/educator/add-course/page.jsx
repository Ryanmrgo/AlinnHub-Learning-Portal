'use client'

import { AppContextProvider } from '@/app/context/AppContext'
import Educator from '@/app/educator/Educator'
import AddCourse from '@/app/educator/AddCourse'

export default function AddCoursePage() {
  return (
    <AppContextProvider>
      <Educator>
        <AddCourse />
      </Educator>
    </AppContextProvider>
  )
}