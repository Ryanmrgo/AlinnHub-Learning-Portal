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

        // Check educator role
        const isEducator = await checkEducatorRole(userId);
        if (!isEducator) {
            return NextResponse.json({ success: false, message: 'Unauthorized Access' });
        }

        await connectDB();

        const courses = await Course.find({ educator: userId });
        const totalCourses = courses.length;
        const courseIds = courses.map(course => course._id);

        // Calculate total earnings from purchases
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        });

        const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

        // Collect unique enrolled student IDs with their course titles
        const enrolledStudentsData = [];
        for (const course of courses) {
            const students = await User.find({
                _id: { $in: course.enrolledStudents }
            }, 'name imageUrl');

            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                });
            });
        }

        return NextResponse.json({
            success: true,
            dashboardData: {
                totalEarnings,
                enrolledStudentsData,
                totalCourses
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
