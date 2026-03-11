import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Course from '@/lib/models/Course';

export async function GET() {
    try {
        await connectDB();

        const courses = await Course.find({ isPublished: true })
            .select(['-courseContent', '-enrolledStudents'])
            .populate({ path: 'educator', select: '-password' });

        return NextResponse.json({ success: true, courses });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
