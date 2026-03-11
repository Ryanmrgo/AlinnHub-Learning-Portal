import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Course from '@/lib/models/Course';

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

        return NextResponse.json({ success: true, courses });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
