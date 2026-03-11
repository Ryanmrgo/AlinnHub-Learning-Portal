import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import { CourseProgress } from '@/lib/models/CourseProgress';

export async function POST(request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { courseId } = await request.json();

        await connectDB();

        const progressData = await CourseProgress.findOne({ userId, courseId });

        return NextResponse.json({ success: true, progressData });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
