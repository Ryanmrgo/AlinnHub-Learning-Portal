import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const client = await clerkClient();

        await client.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator',
            },
        });

        return NextResponse.json({ success: true, message: 'You can publish a course now' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
