'use client'


import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '@/app/context/AppContext'
import axios from 'axios'
import { Line } from 'rc-progress';
import Footer from '@/components/student/Footer';
import { toast } from 'react-toastify';

const MyEnrollments = () => {

    const router = useRouter()

    const { userData, enrolledCourses, fetchUserEnrolledCourses, getToken, calculateCourseDuration, calculateNoOfLectures } = useContext(AppContext)

    const [progressArray, setProgressData] = useState([])

    const completedCourses = progressArray.filter(
        (item) => item.totalLectures > 0 && item.lectureCompleted / item.totalLectures === 1
    ).length

    const inProgressCourses = progressArray.filter(
        (item) => item.lectureCompleted > 0 && item.lectureCompleted < item.totalLectures
    ).length

    const continueCourseIndex = progressArray.findIndex(
        (item) => item.totalLectures > 0 && item.lectureCompleted < item.totalLectures
    )

    const getCourseProgress = async () => {
        try {
            const token = await getToken();

            // Use Promise.all to handle multiple async operations
            const tempProgressArray = await Promise.all(
                enrolledCourses.map(async (course) => {
                    const { data } = await axios.post(
                        '/api/user/get-course-progress',
                        { courseId: course._id },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    // Calculate total lectures
                    let totalLectures = calculateNoOfLectures(course);

                    const lectureCompleted = data.progressData ? data.progressData.lectureCompleted.length : 0;
                    return { totalLectures, lectureCompleted };
                })
            );

            setProgressData(tempProgressArray);
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (userData) {
            fetchUserEnrolledCourses()
        }
    }, [userData])

    useEffect(() => {

        if (enrolledCourses.length > 0) {
            getCourseProgress()
        }

    }, [enrolledCourses])

    return (
        <>

            <div className='md:px-36 px-8 pt-10'>

                <h1 className='text-2xl font-semibold'>My Enrollments</h1>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-3 mt-6'>
                    <div className='border border-gray-200 rounded-lg p-4'>
                        <p className='text-sm text-gray-500'>Total Enrolled</p>
                        <p className='text-2xl font-semibold text-gray-800'>{enrolledCourses.length}</p>
                    </div>
                    <div className='border border-gray-200 rounded-lg p-4'>
                        <p className='text-sm text-gray-500'>In Progress</p>
                        <p className='text-2xl font-semibold text-gray-800'>{inProgressCourses}</p>
                    </div>
                    <div className='border border-gray-200 rounded-lg p-4'>
                        <p className='text-sm text-gray-500'>Completed</p>
                        <p className='text-2xl font-semibold text-gray-800'>{completedCourses}</p>
                    </div>
                </div>

                {continueCourseIndex > -1 && enrolledCourses[continueCourseIndex] && (
                    <div className='mt-4 border border-blue-200 bg-blue-50 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
                        <div>
                            <p className='text-sm text-blue-700'>Continue Learning</p>
                            <p className='font-semibold text-gray-800'>{enrolledCourses[continueCourseIndex].courseTitle}</p>
                        </div>
                        <button
                            onClick={() => router.push('/player/' + enrolledCourses[continueCourseIndex]._id)}
                            className='px-4 py-2 rounded bg-blue-600 text-white w-fit'
                        >
                            Resume Course
                        </button>
                    </div>
                )}

                <table className="md:table-auto table-fixed w-full overflow-hidden border mt-10">
                    <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden">
                        <tr>
                            <th className="px-4 py-3 font-semibold truncate">Course</th>
                            <th className="px-4 py-3 font-semibold truncate max-sm:hidden">Duration</th>
                            <th className="px-4 py-3 font-semibold truncate max-sm:hidden">Completed</th>
                            <th className="px-4 py-3 font-semibold truncate">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {enrolledCourses.map((course, index) => (
                            <tr key={index} className="border-b border-gray-500/20">
                                <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 ">
                                    <img src={course.courseThumbnail} alt="" className="w-14 sm:w-24 md:w-28" />
                                    <div className='flex-1'>
                                        <p className='mb-1 max-sm:text-sm'>{course.courseTitle}</p>
                                        <Line className='bg-gray-300 rounded-full' strokeWidth={2} percent={progressArray[index] ? (progressArray[index].lectureCompleted * 100) / progressArray[index].totalLectures : 0} />
                                    </div>
                                </td>
                                <td className="px-4 py-3 max-sm:hidden">{calculateCourseDuration(course)}</td>
                                <td className="px-4 py-3 max-sm:hidden">
                                    {progressArray[index] && `${progressArray[index].lectureCompleted} / ${progressArray[index].totalLectures}`}
                                    <span className='text-xs ml-2'>Lectures</span>
                                </td>
                                <td className="px-4 py-3 max-sm:text-right">
                                    <div className='flex flex-col sm:flex-row gap-2 items-end sm:items-center'>
                                        <button onClick={() => router.push('/player/' + course._id)} className='px-3 sm:px-5 py-1.5 sm:py-2 bg-blue-600 max-sm:text-xs text-white'>
                                            {progressArray[index] && progressArray[index].lectureCompleted / progressArray[index].totalLectures === 1 ? 'Completed' : 'On Going'}
                                        </button>
                                        {progressArray[index] && progressArray[index].lectureCompleted / progressArray[index].totalLectures === 1 && (
                                            <button
                                                onClick={() => router.push('/certificate/' + course._id)}
                                                className='px-3 sm:px-5 py-1.5 sm:py-2 bg-emerald-600 max-sm:text-xs text-white'
                                            >
                                                Certificate
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>

            <Footer />

        </>
    )
}

export default MyEnrollments

