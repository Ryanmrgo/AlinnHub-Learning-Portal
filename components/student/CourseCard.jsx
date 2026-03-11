'use client'

import React, { useContext } from 'react'
import Link from 'next/link'
import { assets } from '@/lib/assets'
import { AppContext } from '@/app/context/AppContext'

const CourseCard = ({ course }) => {

    const { currency, calculateRating, calculateNoOfLectures, calculateCourseDuration, wishlistCourses, toggleWishlistCourse } = useContext(AppContext)

    const discountedPrice = (course.coursePrice - course.discount * course.coursePrice / 100).toFixed(2)
    const isWishlisted = wishlistCourses.some((item) => item._id === course._id)

    return (
        <Link href={'/course/' + course._id} onClick={() => scrollTo(0, 0)} className="border border-gray-500/30 pb-6 overflow-hidden rounded-lg block hover:shadow-md transition-all duration-200">
            <div className='relative'>
                <img className="w-full h-44 object-cover" src={course.courseThumbnail} alt='' />
                <span className='absolute top-3 left-3 text-xs bg-black/75 text-white px-2 py-1 rounded'>
                    {calculateNoOfLectures(course)} lessons
                </span>
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        toggleWishlistCourse(course._id)
                    }}
                    className={`absolute top-3 right-3 text-sm px-2 py-1 rounded ${isWishlisted ? 'bg-red-600 text-white' : 'bg-white/90 text-gray-700'}`}
                >
                    {isWishlisted ? '♥ Saved' : '♡ Save'}
                </button>
            </div>
            <div className="p-3 text-left">
                <h3 className="text-base font-semibold line-clamp-2 min-h-[48px]">{course.courseTitle}</h3>
                <p className="text-gray-500 text-sm mt-1">By {course.educator.name}</p>
                <div className="flex items-center space-x-2">
                    <p>{calculateRating(course)}</p>
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <img
                                key={i}
                                className="w-3.5 h-3.5"
                                src={i < Math.floor(calculateRating(course)) ? assets.star : assets.star_blank}
                                alt=""
                            />
                        ))}
                    </div>
                    <p className="text-gray-500">({course.courseRatings?.length ?? 0})</p>
                </div>
                <div className='mt-2 flex items-center justify-between text-xs text-gray-500'>
                    <span>{calculateCourseDuration(course)}</span>
                    <span>{course.enrolledStudents?.length ?? 0} learners</span>
                </div>
                <div className='mt-3 flex items-center gap-2'>
                    <p className="text-base font-semibold text-gray-800">{currency}{discountedPrice}</p>
                    {course.discount > 0 && <p className='text-xs text-gray-400 line-through'>{currency}{course.coursePrice}</p>}
                    {course.discount > 0 && <span className='text-xs text-green-700 bg-green-100 px-2 py-1 rounded'>{course.discount}% OFF</span>}
                </div>
            </div>
        </Link>
    )
}

export default CourseCard
