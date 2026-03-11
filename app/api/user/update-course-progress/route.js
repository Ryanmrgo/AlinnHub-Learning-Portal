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

        const { courseId, lectureId } = await request.json();

        await connectDB();

        const progressData = await CourseProgress.findOne({ userId, courseId });

        if (progressData) {
            if (progressData.lectureCompleted.includes(lectureId)) {
                return NextResponse.json({ success: true, message: 'Lecture Already Completed' });
            }

            progressData.lectureCompleted.push(lectureId);
            await progressData.save();
        } else {
            await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted: [lectureId]
            });
        }

        return NextResponse.json({ success: true, message: 'Progress Updated' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
