import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Course from '@/lib/models/Course';
import User from '@/lib/models/User';
import { Purchase } from '@/lib/models/Purchase';

export async function POST(request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const courseId = body.courseId;
        // Support both studentName and fullName from client
        const studentName = (body.studentName ?? body.fullName ?? '').toString().trim();
        const age = body.age != null && body.age !== '' ? Number(body.age) : null;
        const education = (body.education ?? '').toString().trim();
        const reason = (body.reason ?? '').toString().trim();
        const additionalInfo = (body.additionalInfo ?? '').toString().trim();

        await connectDB();

        const courseData = await Course.findById(courseId);
        const userData = await User.findById(userId);

        if (!userData || !courseData) {
            return NextResponse.json({ success: false, message: 'Data Not Found' });
        }

        // If user already enrolled, short-circuit
        const alreadyEnrolled = userData.enrolledCourses?.some(
            (cid) => cid.toString() === courseData._id.toString()
        );
        if (alreadyEnrolled) {
            return NextResponse.json({ success: true, message: 'Already Enrolled' });
        }

        // Check for existing enrollment request/purchase
        const existing = await Purchase.findOne({ courseId: courseData._id, userId });
        if (existing) {
            if (existing.status === 'pending') {
                return NextResponse.json({
                    success: true,
                    message: 'Enrollment request already pending approval.',
                });
            }

            if (existing.status === 'completed') {
                return NextResponse.json({
                    success: true,
                    message: 'Already Enrolled',
                });
            }
        }

        // Create a "free" enrollment request (pending) with form data
        const amount = 0;

        const purchase = await Purchase.create({
            courseId: courseData._id,
            userId,
            amount,
            status: 'pending',
            studentName: studentName || undefined,
            age: age != null && !Number.isNaN(age) ? age : undefined,
            education: education || undefined,
            reason: reason || undefined,
            additionalInfo: additionalInfo || undefined,
        });

        return NextResponse.json({
            success: true,
            message: 'Enrollment request sent to educator for approval.',
            purchaseId: purchase._id,
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
