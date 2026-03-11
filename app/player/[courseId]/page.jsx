'use client'

import { AppContextProvider } from '@/app/context/AppContext'
import Player from '@/app/student/Player'

export default function PlayerPage() {
  return (
    <AppContextProvider>
      <Player />
    </AppContextProvider>
  )
}
