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

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        // Check educator role
        const isEducator = await checkEducatorRole(userId);
        if (!isEducator) {
            return NextResponse.json({ success: false, message: 'Unauthorized Access' });
        }

        await connectDB();

        // Fetch all courses created by the educator
        const courses = await Course.find({ educator: userId });

        // Get the list of course IDs
        const courseIds = courses.map(course => course._id);

        // Fetch purchases with user and course data
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle');

        // enrolled students data
        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
        }));

        return NextResponse.json({
            success: true,
            enrolledStudents
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message
        });
    }
}
