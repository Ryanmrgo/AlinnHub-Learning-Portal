'use client'

import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/nextjs";
import humanizeDuration from "humanize-duration";

export const AppContext = createContext()

export const AppContextProvider = ({ children }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY

    const { getToken } = useAuth()
    const { user } = useUser()

    const [showLogin, setShowLogin] = useState(false)
    const [isEducator, setIsEducator] = useState(false)
    const [allCourses, setAllCourses] = useState([])
    const [userData, setUserData] = useState(null)
    const [enrolledCourses, setEnrolledCourses] = useState([])
    const [wishlistCourses, setWishlistCourses] = useState([])

    const handleAxiosError = (error) => {
        // Ignore canceled/aborted requests (common during navigation or sign in)
        if (axios.isCancel?.(error) || error.code === 'ERR_CANCELED' || error.name === 'CanceledError') {
            return
        }
        if (typeof error.message === 'string' && error.message.toLowerCase().includes('aborted')) {
            return
        }
        toast.error(error.message)
    }

    // Fetch All Courses
    const fetchAllCourses = async () => {
        try {
            const { data } = await axios.get('/api/course/all');

            if (data.success) {
                setAllCourses(data.courses)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            handleAxiosError(error)
        }
    }

    // Fetch UserData 
    const fetchUserData = async () => {
        try {
            if (user?.publicMetadata?.role === 'educator') {
                setIsEducator(true)
            }

            const token = await getToken();

            const { data } = await axios.get('/api/user/data',
                { headers: { Authorization: `Bearer ${token}` } })

            if (data.success) {
                setUserData(data.user)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            handleAxiosError(error)
        }
    }

    // Fetch User Enrolled Courses
    const fetchUserEnrolledCourses = async () => {
        try {
            const token = await getToken();

            const { data } = await axios.get('/api/user/enrolled-courses',
                { headers: { Authorization: `Bearer ${token}` } })

            if (data.success) {
                setEnrolledCourses(data.enrolledCourses.reverse())
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            handleAxiosError(error)
        }
    }

    const fetchWishlistCourses = async () => {
        try {
            const token = await getToken();

            const { data } = await axios.get('/api/user/wishlist',
                { headers: { Authorization: `Bearer ${token}` } })

            if (data.success) {
                setWishlistCourses(data.wishlistCourses)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            handleAxiosError(error)
        }
    }

    const toggleWishlistCourse = async (courseId) => {
        try {
            if (!user) {
                toast.warn('Login to use wishlist')
                return false
            }

            const token = await getToken()
            const { data } = await axios.post('/api/user/wishlist/toggle',
                { courseId },
                { headers: { Authorization: `Bearer ${token}` } }
            )

            if (data.success) {
                toast.success(data.message)
                await fetchWishlistCourses()
                return true
            }

            toast.error(data.message)
            return false
        } catch (error) {
            handleAxiosError(error)
            return false
        }
    }

    // Function to Calculate Course Chapter Time
    const calculateChapterTime = (chapter) => {
        let time = 0
        chapter.chapterContent.map((lecture) => time += lecture.lectureDuration)
        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] })
    }

    // Function to Calculate Course Duration
    const calculateCourseDuration = (course) => {
        if (!course || !Array.isArray(course.courseContent)) {
            return humanizeDuration(0, { units: ["h", "m"] })
        }

        let time = 0

        course.courseContent.forEach((chapter) => {
            if (Array.isArray(chapter?.chapterContent)) {
                chapter.chapterContent.forEach((lecture) => {
                    time += lecture?.lectureDuration || 0
                })
            }
        })

        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] })
    }

    const calculateRating = (course) => {
        if (!course || !Array.isArray(course.courseRatings) || course.courseRatings.length === 0) {
            return 0
        }

        let totalRating = 0
        course.courseRatings.forEach(rating => {
            totalRating += rating.rating
        })
        return Math.floor(totalRating / course.courseRatings.length)
    }

    const calculateNoOfLectures = (course) => {
        if (!course || !Array.isArray(course.courseContent)) {
            return 0
        }

        let totalLectures = 0;
        course.courseContent.forEach(chapter => {
            if (Array.isArray(chapter.chapterContent)) {
                totalLectures += chapter.chapterContent.length;
            }
        });
        return totalLectures;
    }

    useEffect(() => {
        fetchAllCourses()
    }, [])

    // Fetch User's Data if User is Logged In
    useEffect(() => {
        if (user) {
            fetchUserData()
            fetchUserEnrolledCourses()
            fetchWishlistCourses()
        }
    }, [user])

    const value = {
        showLogin, setShowLogin,
        currency,
        userData, setUserData, getToken,
        allCourses, fetchAllCourses,
        enrolledCourses, fetchUserEnrolledCourses,
        wishlistCourses, fetchWishlistCourses, toggleWishlistCourse,
        calculateChapterTime, calculateCourseDuration,
        calculateRating, calculateNoOfLectures,
        isEducator, setIsEducator
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}
