'use client'

import React, { useContext, useEffect, useState } from 'react';
import Footer from '@/components/student/Footer';
import { assets } from '@/lib/assets';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { AppContext } from '@/app/context/AppContext';
import { toast } from 'react-toastify';
import humanizeDuration from 'humanize-duration'
import YouTube from 'react-youtube';
import { useAuth } from '@clerk/nextjs';
import Loading from '@/components/student/Loading';

const extractYoutubeVideoId = (url) => {
  if (!url) return '';

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace('www.', '');

    if (host === 'youtu.be') {
      return parsed.pathname.split('/').filter(Boolean)[0] || '';
    }

    if (host.includes('youtube.com')) {
      const fromQuery = parsed.searchParams.get('v');
      if (fromQuery) return fromQuery;

      const segments = parsed.pathname.split('/').filter(Boolean);
      const embedIndex = segments.indexOf('embed');
      if (embedIndex !== -1 && segments[embedIndex + 1]) return segments[embedIndex + 1];

      const shortsIndex = segments.indexOf('shorts');
      if (shortsIndex !== -1 && segments[shortsIndex + 1]) return segments[shortsIndex + 1];
    }

    return url;
  } catch {
    return url;
  }
};

const CourseDetails = () => {

  const { id } = useParams()

  const [courseData, setCourseData] = useState(null)
  const [playerData, setPlayerData] = useState(null)
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false)
  const [showEnrollForm, setShowEnrollForm] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    education: '',
    reason: '',
    additionalInfo: '',
  })

  const { userData, isEducator, calculateChapterTime, calculateCourseDuration, calculateRating, calculateNoOfLectures } = useContext(AppContext)
  const { getToken } = useAuth()


  const fetchCourseData = async () => {

    try {

      const { data } = await axios.get('/api/course/' + id)

      if (data.success) {
        setCourseData(data.courseData)
      } else {
        toast.error(data.message)
      }

    } catch (error) {

      toast.error(error.message)

    }

  }

  const [openSections, setOpenSections] = useState({});

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };


  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const submitEnrollmentRequest = async (e) => {
    e.preventDefault()

    try {

      if (!userData) {
        return toast.warn('Login to Enroll')
      }

      if (isAlreadyEnrolled) {
        return toast.warn('Already Enrolled')
      }

      if (!formData.fullName || !formData.age || !formData.education || !formData.reason) {
        return toast.warn('Please fill in all required fields')
      }

      const token = await getToken();
      const payload = {
        courseId: courseData._id,
        studentName: String(formData.fullName ?? '').trim(),
        age: formData.age === '' ? null : Number(formData.age),
        education: String(formData.education ?? '').trim(),
        reason: String(formData.reason ?? '').trim(),
        additionalInfo: String(formData.additionalInfo ?? '').trim(),
      }

      const { data } = await axios.post(
        '/api/user/purchase',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (data.success) {
        toast.success(data.message || 'Enrollment request sent')
        setShowEnrollForm(false)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchCourseData()
  }, [])

  useEffect(() => {

    if (userData && courseData) {
      setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id))
    }

  }, [userData, courseData])

  return courseData ? (
    <>
      <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-20 pt-10 text-left">
        <div className="absolute top-0 left-0 w-full h-section-height -z-1 bg-gradient-to-b from-cyan-100/70"></div>

        <div className="max-w-xl z-10 text-gray-500">
          <h1 className="md:text-course-deatails-heading-large text-course-deatails-heading-small font-semibold text-gray-800">
            {courseData.courseTitle}
          </h1>
          <p className="pt-4 md:text-base text-sm" dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 200) }}>
          </p>

          <div className='flex items-center space-x-2 pt-3 pb-1 text-sm'>
            <p>{calculateRating(courseData)}</p>
            <div className='flex'>
              {[...Array(5)].map((_, i) => (<img key={i} src={i < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank} alt=''
                className='w-3.5 h-3.5' />
              ))}
            </div>
            <p className='text-blue-600'>({courseData.courseRatings.length} {courseData.courseRatings.length > 1 ? 'ratings' : 'rating'})</p>

            <p>{courseData.enrolledStudents.length} {courseData.enrolledStudents.length > 1 ? 'students' : 'student'}</p>
          </div>

          <p className='text-sm'>Course by <span className='text-blue-600 underline'>{courseData.educator.name}</span></p>

          <div className="pt-8 text-gray-800">
            <h2 className="text-xl font-semibold">Course Structure</h2>
            <div className="pt-5">
              {courseData.courseContent.map((chapter, index) => (
                <div key={index} className="border border-gray-300 bg-white mb-2 rounded">
                  <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                    onClick={() => toggleSection(index)}
                  >
                    <div className="flex items-center gap-2">
                      <img src={assets.down_arrow_icon} alt="arrow icon" className={`transform transition-transform ${openSections[index] ? "rotate-180" : ""}`} />
                      <p className="font-medium md:text-base text-sm">{chapter.chapterTitle}</p>
                    </div>
                    <p className="text-sm md:text-default">{chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}</p>
                  </div>

                  <div className={`overflow-hidden transition-all duration-300 ${openSections[index] ? "max-h-96" : "max-h-0"}`} >
                    <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className="flex items-start gap-2 py-1">
                          <img src={assets.play_icon} alt="bullet icon" className="w-4 h-4 mt-1" />
                          <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
                            <p>{lecture.lectureTitle}</p>
                            <div className='flex gap-2'>
                              {lecture.isPreviewFree && <p onClick={() => setPlayerData({
                                videoId: extractYoutubeVideoId(lecture.lectureUrl)
                              })} className='text-blue-500 cursor-pointer'>Preview</p>}
                              <p>{humanizeDuration(lecture.lectureDuration * 60 * 1000, { units: ['h', 'm'] })}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="py-20 text-sm md:text-default">
            <h3 className="text-xl font-semibold text-gray-800">Course Description</h3>
            <p className="rich-text pt-3" dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}>
            </p>
          </div>
        </div>

        <div className="max-w-course-card z-10 shadow-custom-card rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px]">
          {
            playerData
              ? <YouTube videoId={playerData.videoId} opts={{ playerVars: { autoplay: 1 } }} iframeClassName='w-full aspect-video' />
              : <img src={courseData.courseThumbnail} alt="" />
          }
          <div className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <img className="w-3.5" src={assets.time_left_clock_icon} alt="time left clock icon" />
              <p className="text-green-600 font-medium">
                This course is free for all AlinHub students.
              </p>
            </div>
            <div className="flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4 text-gray-500">
              <div className="flex items-center gap-1">
                <img src={assets.star} alt="star icon" />
                <p>{calculateRating(courseData)}</p>
              </div>
              <div className="h-4 w-px bg-gray-500/40"></div>
              <div className="flex items-center gap-1">
                <img src={assets.time_clock_icon} alt="clock icon" />
                <p>{calculateCourseDuration(courseData)}</p>
              </div>
              <div className="h-4 w-px bg-gray-500/40"></div>
              <div className="flex items-center gap-1">
                <img src={assets.lesson_icon} alt="clock icon" />
                <p>{calculateNoOfLectures(courseData)} lessons</p>
              </div>
            </div>

            {!isEducator && (
              <>
                <button
                  onClick={() => {
                    if (!userData) {
                      toast.warn('Login to Enroll')
                      return
                    }
                    if (isAlreadyEnrolled) {
                      toast.warn('Already Enrolled')
                      return
                    }
                    setShowEnrollForm((prev) => !prev)
                  }}
                  className="md:mt-6 mt-4 w-full py-3 rounded bg-blue-600 text-white font-medium"
                >
                  {isAlreadyEnrolled ? 'Already Enrolled' : showEnrollForm ? 'Close Form' : 'Request Access'}
                </button>

                {showEnrollForm && (
                  <form onSubmit={submitEnrollmentRequest} className="mt-4 space-y-3 text-sm">
                    <div>
                      <label className="block text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Age *</label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Educational Background *</label>
                      <input
                        type="text"
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Why do you want to enroll in this class? *</label>
                      <textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        rows={3}
                        className="w-full border border-gray-300 rounded px-3 py-2 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">Additional Information (optional)</label>
                      <textarea
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleChange}
                        rows={2}
                        className="w-full border border-gray-300 rounded px-3 py-2 resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 rounded bg-blue-600 text-white font-medium mt-2"
                    >
                      Submit Request
                    </button>
                  </form>
                )}
              </>
            )}
            <div className="pt-6">
              <p className="md:text-xl text-lg font-medium text-gray-800">What's in the course?</p>
              <ul className="ml-4 pt-2 text-sm md:text-default list-disc text-gray-500">
                <li>Lifetime access with free updates.</li>
                <li>Step-by-step, hands-on project guidance.</li>
                <li>Downloadable resources and source code.</li>
                <li>Quizzes to test your knowledge.</li>
                <li>Certificate of completion.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : <Loading />
};

export default CourseDetails;

