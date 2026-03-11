import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Course from '@/lib/models/Course';
import { Purchase } from '@/lib/models/Purchase';
import User from '@/lib/models/User';

async function checkEducatorRole(userId) {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    return user.publicMetadata.role === 'educator';
}

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const isEducator = await checkEducatorRole(userId);
        if (!isEducator) {
            return NextResponse.json({ success: false, message: 'Unauthorized Access' });
        }

        await connectDB();

        const courses = await Course.find({ educator: userId });
        const courseIds = courses.map(course => course._id);

        const requests = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'pending',
        })
            .populate('courseId', 'courseTitle')
            .populate('userId', 'name imageUrl');

        const enrollmentRequests = requests.map((req) => ({
            id: req._id,
            courseTitle: req.courseId.courseTitle,
            student: req.userId,
            studentName: req.studentName,
            age: req.age,
            education: req.education,
            reason: req.reason,
            additionalInfo: req.additionalInfo,
            createdAt: req.createdAt,
        }));

        return NextResponse.json({
            success: true,
            enrollmentRequests,
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message,
        });
    }
}

