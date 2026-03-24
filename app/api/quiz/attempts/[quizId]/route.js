import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import supabase from '@/lib/supabase';

export async function GET(request, { params }) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { quizId } = params;

        const { data: attempts, error } = await supabase
            .from('quiz_attempts')
            .select('*')
            .eq('quiz_id', quizId)
            .eq('user_id', userId)
            .order('completed_at', { ascending: false });

        if (error) {
            return NextResponse.json({ success: false, message: error.message });
        }

        return NextResponse.json({ success: true, attempts });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
