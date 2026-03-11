import { NextResponse } from 'next/server';

// In Alinn-Hub, educator roles are pre-assigned manually.
// This endpoint is intentionally disabled to prevent students from upgrading themselves.

export async function GET() {
    return NextResponse.json(
        { success: false, message: 'Educator role cannot be self-assigned.' },
        { status: 403 }
    );
}
