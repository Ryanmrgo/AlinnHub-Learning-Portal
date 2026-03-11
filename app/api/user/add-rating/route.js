import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Course from '@/lib/models/Course';
import User from '@/lib/models/User';

export async function POST(request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { courseId, rating } = await request.json();

        // Validate inputs
        if (!courseId || !rating || rating < 1 || rating > 5) {
            return NextResponse.json({ success: false, message: 'Invalid Details' });
        }

        await connectDB();

        const course = await Course.findById(courseId);

        if (!course) {
            return NextResponse.json({ success: false, message: 'Course not found.' });
        }

        const user = await User.findById(userId);

        if (!user || !user.enrolledCourses.includes(courseId)) {
            return NextResponse.json({ success: false, message: 'User has not purchased this course.' });
        }

        // Check if user already rated
        const existingRatingIndex = course.courseRatings.findIndex(r => r.userId === userId);

        if (existingRatingIndex > -1) {
            // Update the existing rating
            course.courseRatings[existingRatingIndex].rating = rating;
        } else {
            // Add a new rating
            course.courseRatings.push({ userId, rating });
        }

        await course.save();

        return NextResponse.json({ success: true, message: 'Rating added' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
