import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const userData = await User.findById(userId)
            .populate('enrolledCourses');

        return NextResponse.json({ success: true, enrolledCourses: userData.enrolledCourses });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
