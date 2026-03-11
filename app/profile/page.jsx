'use client'

import React, { useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import Navbar from '@/components/student/Navbar'
import Footer from '@/components/student/Footer'
import { AppContextProvider, AppContext } from '@/app/context/AppContext'

const ProfileContent = () => {
  const {
    userData,
    enrolledCourses,
    wishlistCourses,
    fetchUserEnrolledCourses,
    fetchWishlistCourses,
    getToken,
    calculateNoOfLectures,
    calculateCourseDuration,
  } = useContext(AppContext)

  const [progressMap, setProgressMap] = useState({})
  const [loading, setLoading] = useState(true)

  const fetchProgress = async () => {
    try {
      const token = await getToken()
      const responses = await Promise.all(
        enrolledCourses.map((course) =>
          axios.post(
            '/api/user/get-course-progress',
            { courseId: course._id },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      )

      const mapped = {}
      enrolledCourses.forEach((course, idx) => {
        const completed = responses[idx].data.progressData?.lectureCompleted?.length || 0
        const total = calculateNoOfLectures(course)
        mapped[course._id] = {
          completed,
          total,
          percent: total > 0 ? Math.floor((completed * 100) / total) : 0,
        }
      })

      setProgressMap(mapped)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserEnrolledCourses()
    fetchWishlistCourses()
  }, [])

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      fetchProgress()
    } else {
      setLoading(false)
    }
  }, [enrolledCourses])

  const stats = useMemo(() => {
    const list = enrolledCourses.map((course) => progressMap[course._id]).filter(Boolean)
    const completedCourses = list.filter((item) => item.total > 0 && item.completed === item.total).length
    const inProgress = list.filter((item) => item.completed > 0 && item.completed < item.total).length
    const totalPercent = list.length ? Math.floor(list.reduce((sum, item) => sum + item.percent, 0) / list.length) : 0
    const momentum = Math.min(100, completedCourses * 20 + inProgress * 10)

    return {
      completedCourses,
      inProgress,
      totalPercent,
      momentum,
    }
  }, [enrolledCourses, progressMap])

  const recentLearning = enrolledCourses
    .filter((course) => (progressMap[course._id]?.completed || 0) > 0)
    .slice(0, 3)

  return (
    <>
      <Navbar />
      <div className='md:px-36 px-8 pt-10 min-h-[70vh]'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
          <div>
            <h1 className='text-2xl font-semibold text-gray-800'>Learner Profile</h1>
            <p className='text-gray-500 mt-1'>Track your growth and learning activity.</p>
          </div>
          <div className='text-sm text-gray-500'>
            {userData?.name ? `Welcome back, ${userData.name}` : 'Welcome back'}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-5 gap-3 mt-6'>
          <div className='border rounded-lg p-4'>
            <p className='text-sm text-gray-500'>Enrolled</p>
            <p className='text-2xl font-semibold text-gray-800'>{enrolledCourses.length}</p>
          </div>
          <div className='border rounded-lg p-4'>
            <p className='text-sm text-gray-500'>Completed</p>
            <p className='text-2xl font-semibold text-gray-800'>{stats.completedCourses}</p>
          </div>
          <div className='border rounded-lg p-4'>
            <p className='text-sm text-gray-500'>In Progress</p>
            <p className='text-2xl font-semibold text-gray-800'>{stats.inProgress}</p>
          </div>
          <div className='border rounded-lg p-4'>
            <p className='text-sm text-gray-500'>Wishlist</p>
            <p className='text-2xl font-semibold text-gray-800'>{wishlistCourses.length}</p>
          </div>
          <div className='border rounded-lg p-4'>
            <p className='text-sm text-gray-500'>Avg Progress</p>
            <p className='text-2xl font-semibold text-gray-800'>{stats.totalPercent}%</p>
          </div>
        </div>

        <div className='mt-5 border border-blue-200 bg-blue-50 rounded-lg p-4'>
          <p className='text-sm text-blue-700'>Momentum Score</p>
          <p className='text-2xl font-semibold text-blue-900'>{stats.momentum}/100</p>
          <div className='mt-3 w-full h-2 rounded bg-blue-100'>
            <div className='h-2 rounded bg-blue-600' style={{ width: `${stats.momentum}%` }} />
          </div>
        </div>

        <div className='mt-8'>
          <h2 className='text-lg font-semibold text-gray-800'>Recent Learning</h2>
          {loading ? (
            <p className='text-gray-500 mt-2'>Loading...</p>
          ) : recentLearning.length === 0 ? (
            <p className='text-gray-500 mt-2'>Start a lesson to see your recent activity.</p>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-3 mt-3'>
              {recentLearning.map((course) => (
                <div key={course._id} className='border rounded-lg p-4'>
                  <p className='font-semibold text-gray-800 line-clamp-2'>{course.courseTitle}</p>
                  <p className='text-sm text-gray-500 mt-2'>
                    Progress: {progressMap[course._id]?.completed || 0}/{progressMap[course._id]?.total || 0} lectures
                  </p>
                  <p className='text-sm text-gray-500'>Duration: {calculateCourseDuration(course)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default function ProfilePage() {
  return (
    <AppContextProvider>
      <ProfileContent />
    </AppContextProvider>
  )
}
