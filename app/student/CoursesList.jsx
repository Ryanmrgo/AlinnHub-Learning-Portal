'use client'

import React, { useContext, useEffect, useState } from 'react'
import Footer from '@/components/student/Footer'
import { assets } from '@/lib/assets'
import CourseCard from '@/components/student/CourseCard';
import { AppContext } from '@/app/context/AppContext';
import { useParams , useRouter} from 'next/navigation';
import SearchBar from '@/components/student/SearchBar';

const CoursesList = () => {

    const { input } = useParams()
    const router = useRouter()

    const { allCourses, calculateRating } = useContext(AppContext)

    const [filteredCourse, setFilteredCourse] = useState([])
    const [sortBy, setSortBy] = useState('popular')
    const [priceFilter, setPriceFilter] = useState('all')
    const [ratingFilter, setRatingFilter] = useState('all')

    const getDiscountedPrice = (course) => Number((course.coursePrice - course.discount * course.coursePrice / 100).toFixed(2))

    const getCategory = (title = '') => {
        const lower = title.toLowerCase()
        if (lower.includes('python') || lower.includes('javascript') || lower.includes('web') || lower.includes('react')) return 'Development'
        if (lower.includes('data') || lower.includes('machine learning') || lower.includes('ai')) return 'Data Science'
        if (lower.includes('design') || lower.includes('ui') || lower.includes('ux')) return 'Design'
        return 'General'
    }

    useEffect(() => {

        if (allCourses && allCourses.length > 0) {

            let tempCourses = allCourses.slice()

            if (input) {
                tempCourses = tempCourses.filter(
                    item => item.courseTitle.toLowerCase().includes(input.toLowerCase())
                )
            }

            if (priceFilter === 'under50') {
                tempCourses = tempCourses.filter((item) => getDiscountedPrice(item) < 50)
            } else if (priceFilter === '50to100') {
                tempCourses = tempCourses.filter((item) => getDiscountedPrice(item) >= 50 && getDiscountedPrice(item) <= 100)
            } else if (priceFilter === 'above100') {
                tempCourses = tempCourses.filter((item) => getDiscountedPrice(item) > 100)
            }

            if (ratingFilter === '4plus') {
                tempCourses = tempCourses.filter((item) => calculateRating(item) >= 4)
            } else if (ratingFilter === '3plus') {
                tempCourses = tempCourses.filter((item) => calculateRating(item) >= 3)
            }

            if (sortBy === 'priceLowToHigh') {
                tempCourses.sort((a, b) => getDiscountedPrice(a) - getDiscountedPrice(b))
            } else if (sortBy === 'priceHighToLow') {
                tempCourses.sort((a, b) => getDiscountedPrice(b) - getDiscountedPrice(a))
            } else if (sortBy === 'ratingHighToLow') {
                tempCourses.sort((a, b) => calculateRating(b) - calculateRating(a))
            } else {
                tempCourses.sort((a, b) => b.enrolledStudents.length - a.enrolledStudents.length)
            }

            setFilteredCourse(tempCourses)

        }

    }, [allCourses, input, sortBy, priceFilter, ratingFilter])

    return (
        <>
            <div className="relative md:px-36 px-8 pt-20 text-left">
                <div className='flex md:flex-row flex-col gap-6 items-start justify-between w-full'>
                    <div>
                        <h1 className='text-4xl font-semibold text-gray-800'>Course List</h1>
                        <p className='text-gray-500'><span onClick={() => router.push('/')} className='text-blue-600 cursor-pointer'>Home</span> / <span>Course List</span></p>
                    </div>
                    <SearchBar data={input} />
                </div>

                <div className='mt-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between'>
                    <div className='flex flex-wrap gap-2'>
                        {['Development', 'Data Science', 'Design', 'General'].map((category) => (
                            <span key={category} className='text-xs px-3 py-1 rounded-full border border-gray-300 text-gray-600'>
                                {category}
                            </span>
                        ))}
                    </div>
                    <div className='flex flex-wrap gap-2'>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className='border border-gray-300 rounded px-3 py-2 text-sm text-gray-600'>
                            <option value="popular">Most Popular</option>
                            <option value="ratingHighToLow">Top Rated</option>
                            <option value="priceLowToHigh">Price: Low to High</option>
                            <option value="priceHighToLow">Price: High to Low</option>
                        </select>
                        <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)} className='border border-gray-300 rounded px-3 py-2 text-sm text-gray-600'>
                            <option value="all">All Prices</option>
                            <option value="under50">Under $50</option>
                            <option value="50to100">$50 - $100</option>
                            <option value="above100">Above $100</option>
                        </select>
                        <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} className='border border-gray-300 rounded px-3 py-2 text-sm text-gray-600'>
                            <option value="all">All Ratings</option>
                            <option value="4plus">4★ & above</option>
                            <option value="3plus">3★ & above</option>
                        </select>
                    </div>
                </div>

                {input && <div className='inline-flex items-center gap-4 px-4 py-2 border mt-8 -mb-8 text-gray-600'>
                    <p>{input}</p>
                    <img onClick={() => router.push('/course-list')} className='cursor-pointer' src={assets.cross_icon} alt="" />
                </div>}

                <p className='mt-6 text-sm text-gray-500'>
                    Showing {filteredCourse.length} courses
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-3 px-2 md:p-0">
                    {filteredCourse.map((course, index) => <CourseCard key={index} course={course} />)}
                </div>

                {filteredCourse.length === 0 && (
                    <div className='border border-gray-200 rounded-lg p-8 text-center text-gray-500 my-10'>
                        <p className='text-lg font-medium text-gray-700'>No courses found</p>
                        <p className='mt-2'>Try another keyword or clear your filters.</p>
                        <button onClick={() => { setSortBy('popular'); setPriceFilter('all'); setRatingFilter('all'); router.push('/course-list') }} className='mt-4 px-4 py-2 rounded bg-blue-600 text-white'>
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>
            <Footer />
        </>
    )
}

export default CoursesList 

