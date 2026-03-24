import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import supabase from '@/lib/supabase';

export async function GET(request, { params }) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { courseId } = params;

        const { data: quizzes, error } = await supabase
            .from('quizzes')
            .select('*')
            .eq('course_id', courseId)
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({ success: false, message: error.message });
        }

        return NextResponse.json({ success: true, quizzes });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
