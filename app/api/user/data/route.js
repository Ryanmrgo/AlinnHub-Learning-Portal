import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        let user = await User.findById(userId);

        // If no local user exists yet, create one from Clerk data
        if (!user) {
            const clerkUser = await currentUser();

            if (!clerkUser) {
                return NextResponse.json({ success: false, message: 'User Not Found' });
            }

            const userData = {
                _id: clerkUser.id,
                email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
                name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
                imageUrl: clerkUser.imageUrl || '',
            };

            user = await User.create(userData);
        }

        if (!user) {
            return NextResponse.json({ success: false, message: 'User Not Found' });
        }

        return NextResponse.json({ success: true, user });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
