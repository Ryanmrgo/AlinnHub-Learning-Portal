import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Course from '@/lib/models/Course';

export async function GET(request, { params }) {
    const { id } = params;

    try {
        await connectDB();

        const courseData = await Course.findById(id)
            .populate({ path: 'educator' });

        if (!courseData) {
            return NextResponse.json({ success: false, message: 'Course not found' });
        }

        // Remove lectureUrl if isPreviewFree is false
        courseData.courseContent.forEach(chapter => {
            chapter.chapterContent.forEach(lecture => {
                if (!lecture.isPreviewFree) {
                    lecture.lectureUrl = "";
                }
            });
        });

        return NextResponse.json({ success: true, courseData });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
