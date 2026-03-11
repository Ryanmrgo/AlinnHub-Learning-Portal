import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Course from '@/lib/models/Course';
import { Purchase } from '@/lib/models/Purchase';

async function checkEducatorRole(userId) {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    return user.publicMetadata.role === 'educator';
}

export async function POST(request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const isEducator = await checkEducatorRole(userId);
        if (!isEducator) {
            return NextResponse.json({ success: false, message: 'Unauthorized Access' });
        }

        const { requestId } = await request.json();
        if (!requestId) {
            return NextResponse.json({ success: false, message: 'Request ID is required' });
        }

        await connectDB();

        const enrollmentRequest = await Purchase.findById(requestId);
        if (!enrollmentRequest) {
            return NextResponse.json({ success: false, message: 'Enrollment request not found' });
        }

        const course = await Course.findById(enrollmentRequest.courseId);
        if (!course) {
            return NextResponse.json({ success: false, message: 'Course not found' });
        }

        // Ensure the educator owns this course
        if (course.educator.toString() !== userId.toString()) {
            return NextResponse.json({ success: false, message: 'Unauthorized Access' });
        }

        if (enrollmentRequest.status !== 'pending') {
            return NextResponse.json({ success: true, message: 'Request already processed.' });
        }

        enrollmentRequest.status = 'failed';
        await enrollmentRequest.save();

        return NextResponse.json({
            success: true,
            message: 'Enrollment request declined.',
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message,
        });
    }
}

