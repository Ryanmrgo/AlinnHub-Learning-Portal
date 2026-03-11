'use client'

import { AppContextProvider } from '@/app/context/AppContext'
import Educator from '@/app/educator/Educator'
import Dashboard from '@/app/educator/Dashboard'

export default function EducatorPage() {
  return (
    <AppContextProvider>
      <Educator>
        <Dashboard />
      </Educator>
    </AppContextProvider>
  )
}
