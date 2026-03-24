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

        const { data: quiz, error: quizError } = await supabase
            .from('quizzes')
            .select('*')
            .eq('id', quizId)
            .single();

        if (quizError || !quiz) {
            return NextResponse.json({ success: false, message: 'Quiz not found' });
        }

        const { data: questions, error: questionsError } = await supabase
            .from('quiz_questions')
            .select('*')
            .eq('quiz_id', quizId)
            .order('order_index');

        if (questionsError) {
            return NextResponse.json({ success: false, message: questionsError.message });
        }

        const questionsWithOptions = await Promise.all(
            questions.map(async (question) => {
                const { data: options, error: optionsError } = await supabase
                    .from('quiz_options')
                    .select('*')
                    .eq('question_id', question.id)
                    .order('order_index');

                if (optionsError) {
                    return { ...question, options: [] };
                }

                return { ...question, options };
            })
        );

        return NextResponse.json({
            success: true,
            quiz: {
                ...quiz,
                questions: questionsWithOptions
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}

export async function PUT(request, { params }) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { quizId } = params;
        const { isPublished } = await request.json();

        const { error } = await supabase
            .from('quizzes')
            .update({ is_published: isPublished, updated_at: new Date().toISOString() })
            .eq('id', quizId);

        if (error) {
            return NextResponse.json({ success: false, message: error.message });
        }

        return NextResponse.json({ success: true, message: 'Quiz updated successfully' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}

export async function DELETE(request, { params }) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { quizId } = params;

        const { error } = await supabase
            .from('quizzes')
            .delete()
            .eq('id', quizId);

        if (error) {
            return NextResponse.json({ success: false, message: error.message });
        }

        return NextResponse.json({ success: true, message: 'Quiz deleted successfully' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
