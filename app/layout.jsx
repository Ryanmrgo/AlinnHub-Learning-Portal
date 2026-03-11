import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import 'quill/dist/quill.snow.css'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'

export const metadata = {
  title: 'LMS - Learning Management System',
  description: 'A comprehensive learning management system',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="text-default min-h-screen bg-white">
          <ToastContainer />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
