'use client'

import React, { useContext } from 'react';
import { AppContext } from '@/app/context/AppContext';
import CourseCard from './CourseCard';
import Link from 'next/link';

const CoursesSection = () => {

  const { allCourses } = useContext(AppContext)

  return (
    <div className="py-16 md:px-40 px-8">
      <h2 className="text-3xl font-medium text-gray-800">Learn from the best</h2>
      <p className="md:text-base text-sm text-gray-500 mt-3">
        Discover our top-rated courses across various categories. From coding and design to business and wellness, our courses are crafted to deliver results.
      </p>
      <div className='mt-6 grid grid-cols-2 md:grid-cols-4 gap-3'>
        <div className='border rounded-lg px-4 py-3 bg-white'>
          <p className='text-xl font-semibold text-gray-800'>{allCourses.length}+</p>
          <p className='text-sm text-gray-500'>Courses</p>
        </div>
        <div className='border rounded-lg px-4 py-3 bg-white'>
          <p className='text-xl font-semibold text-gray-800'>4.7/5</p>
          <p className='text-sm text-gray-500'>Average Rating</p>
        </div>
        <div className='border rounded-lg px-4 py-3 bg-white'>
          <p className='text-xl font-semibold text-gray-800'>10k+</p>
          <p className='text-sm text-gray-500'>Learners</p>
        </div>
        <div className='border rounded-lg px-4 py-3 bg-white'>
          <p className='text-xl font-semibold text-gray-800'>24/7</p>
          <p className='text-sm text-gray-500'>Access</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-4 md:px-0 md:my-16 my-10 gap-4">
        {allCourses.slice(0, 4).map((course, index) => <CourseCard key={index} course={course} />)}
      </div>
      <Link href={'/course-list'} onClick={() => scrollTo(0, 0)} className="text-gray-500 border border-gray-500/30 px-10 py-3 rounded">Show all courses</Link>
    </div>
  );
};

export default CoursesSection;


