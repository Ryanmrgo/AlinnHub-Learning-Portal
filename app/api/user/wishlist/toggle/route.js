import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Course from '@/lib/models/Course';

export async function POST(request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { courseId } = await request.json();

        if (!courseId) {
            return NextResponse.json({ success: false, message: 'Course ID is required' });
        }

        await connectDB();

        const [userData, courseData] = await Promise.all([
            User.findById(userId),
            Course.findById(courseId)
        ]);

        if (!userData || !courseData) {
            return NextResponse.json({ success: false, message: 'Data Not Found' });
        }

        const isWishlisted = userData.wishlistCourses.some((id) => id.toString() === courseId);

        if (isWishlisted) {
            userData.wishlistCourses = userData.wishlistCourses.filter((id) => id.toString() !== courseId);
        } else {
            userData.wishlistCourses.push(courseId);
        }

        await userData.save();

        return NextResponse.json({
            success: true,
            message: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
            isWishlisted: !isWishlisted
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
