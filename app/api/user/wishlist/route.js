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
            .populate({
                path: 'wishlistCourses',
                populate: { path: 'educator' }
            });

        if (!userData) {
            return NextResponse.json({ success: false, message: 'User Not Found' });
        }

        return NextResponse.json({ success: true, wishlistCourses: userData.wishlistCourses || [] });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
