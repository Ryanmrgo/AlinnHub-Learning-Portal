'use client'

import React, { useContext, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { AppContextProvider, AppContext } from '@/app/context/AppContext'

const CertificateContent = () => {
  const { courseId } = useParams()
  const router = useRouter()
  const { userData, enrolledCourses, getToken, fetchUserEnrolledCourses, calculateNoOfLectures } = useContext(AppContext)
  const [course, setCourse] = useState(null)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    if (!enrolledCourses.length) {
      fetchUserEnrolledCourses()
    }
  }, [])

  useEffect(() => {
    const found = enrolledCourses.find((item) => item._id === courseId)
    if (found) setCourse(found)
  }, [enrolledCourses, courseId])

  useEffect(() => {
    const checkProgress = async () => {
      if (!course) return

      const token = await getToken()
      const { data } = await axios.post(
        '/api/user/get-course-progress',
        { courseId: course._id },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const total = calculateNoOfLectures(course)
      const completed = data.progressData?.lectureCompleted?.length || 0
      setIsCompleted(total > 0 && completed === total)
    }

    checkProgress()
  }, [course])

  if (!course) {
    return <div className='min-h-screen flex items-center justify-center text-gray-600'>Loading certificate...</div>
  }

  return (
    <div className='min-h-screen bg-gray-100 py-10 px-4'>
      <div className='max-w-4xl mx-auto mb-4 flex justify-between'>
        <button onClick={() => router.back()} className='px-4 py-2 rounded bg-gray-800 text-white'>Back</button>
        {isCompleted && (
          <button onClick={() => window.print()} className='px-4 py-2 rounded bg-blue-600 text-white'>Download / Print</button>
        )}
      </div>

      <div className='max-w-4xl mx-auto bg-white border-8 border-blue-100 rounded-xl p-10 text-center'>
        <p className='text-blue-600 font-semibold tracking-[0.2em]'>CERTIFICATE OF COMPLETION</p>
        <h1 className='text-4xl font-bold text-gray-800 mt-6'>Awarded to</h1>
        <p className='text-3xl font-semibold text-blue-700 mt-4'>{userData?.name || 'Learner'}</p>
        <p className='text-gray-600 mt-6'>for successfully completing the course</p>
        <p className='text-2xl font-semibold text-gray-800 mt-2'>{course.courseTitle}</p>
        <p className='text-gray-500 mt-8'>Date: {new Date().toLocaleDateString()}</p>

        {!isCompleted && (
          <div className='mt-8 p-4 rounded bg-yellow-50 text-yellow-800 border border-yellow-200'>
            Complete all lectures to unlock a valid completion certificate.
          </div>
        )}
      </div>
    </div>
  )
}

export default function CertificatePage() {
  return (
    <AppContextProvider>
      <CertificateContent />
    </AppContextProvider>
  )
}
