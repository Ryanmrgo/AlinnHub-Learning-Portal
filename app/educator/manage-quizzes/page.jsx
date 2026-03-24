'use client'

import { AppContextProvider } from '@/app/context/AppContext'
import Educator from '@/app/educator/Educator'
import ManageQuizzes from '@/app/educator/ManageQuizzes'

export default function ManageQuizzesPage() {
  return (
    <AppContextProvider>
      <Educator>
        <ManageQuizzes />
      </Educator>
    </AppContextProvider>
  )
}
