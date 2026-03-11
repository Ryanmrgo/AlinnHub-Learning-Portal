'use client'

import { AppContextProvider } from '@/app/context/AppContext'
import Loading from '@/components/student/Loading'

export default function LoadingPage() {
  return (
    <AppContextProvider>
      <Loading />
    </AppContextProvider>
  )
}
