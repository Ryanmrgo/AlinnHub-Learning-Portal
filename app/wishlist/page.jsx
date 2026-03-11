'use client'

import React, { useContext, useEffect } from 'react'
import Navbar from '@/components/student/Navbar'
import Footer from '@/components/student/Footer'
import CourseCard from '@/components/student/CourseCard'
import { AppContextProvider, AppContext } from '@/app/context/AppContext'

const WishlistContent = () => {
  const { wishlistCourses, fetchWishlistCourses } = useContext(AppContext)

  useEffect(() => {
    fetchWishlistCourses()
  }, [])

  return (
    <>
      <Navbar />
      <div className='md:px-36 px-8 pt-10 min-h-[60vh]'>
        <h1 className='text-2xl font-semibold text-gray-800'>My Wishlist</h1>
        <p className='text-gray-500 mt-2'>Your saved courses for later.</p>

        {wishlistCourses.length === 0 ? (
          <div className='mt-8 border border-gray-200 rounded-lg p-8 text-center text-gray-500'>
            <p className='text-lg font-medium text-gray-700'>No saved courses yet</p>
            <p className='mt-2'>Tap “Save” on any course card to add it here.</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-10 gap-3'>
            {wishlistCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default function WishlistPage() {
  return (
    <AppContextProvider>
      <WishlistContent />
    </AppContextProvider>
  )
}
