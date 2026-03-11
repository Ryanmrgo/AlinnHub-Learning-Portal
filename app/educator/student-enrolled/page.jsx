'use client'

import { AppContextProvider } from '@/app/context/AppContext'
import Educator from '@/app/educator/Educator'
import StudentsEnrolled from '@/app/educator/StudentsEnrolled'

export default function StudentsEnrolledPage() {
  return (
    <AppContextProvider>
      <Educator>
        <StudentsEnrolled />
      </Educator>
    </AppContextProvider>
  )
}