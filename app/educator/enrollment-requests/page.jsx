'use client'

import { AppContextProvider } from '@/app/context/AppContext'
import Educator from '@/app/educator/Educator'
import EnrollmentRequests from '@/app/educator/EnrollmentRequests'

export default function EnrollmentRequestsPage() {
  return (
    <AppContextProvider>
      <Educator>
        <EnrollmentRequests />
      </Educator>
    </AppContextProvider>
  )
}

