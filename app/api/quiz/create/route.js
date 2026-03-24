import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import supabase from '@/lib/supabase';

export async function POST(request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { courseId, chapterId, title, description, durationMinutes, passingScore, questions } = await request.json();

        if (!courseId || !title || !questions || questions.length === 0) {
            return NextResponse.json({ success: false, message: 'Missing required fields' });
        }

        const { data: quiz, error: quizError } = await supabase
            .from('quizzes')
            .insert({
                course_id: courseId,
                chapter_id: chapterId,
                title,
                description: description || '',
                duration_minutes: durationMinutes || 30,
                passing_score: passingScore || 70,
                is_published: false
            })
            .select()
            .single();

        if (quizError) {
            return NextResponse.json({ success: false, message: quizError.message });
        }

        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];

            const { data: questionData, error: questionError } = await supabase
                .from('quiz_questions')
                .insert({
                    quiz_id: quiz.id,
                    question_text: question.text,
                    question_type: question.type || 'multiple_choice',
                    points: question.points || 1,
                    order_index: i
                })
                .select()
                .single();

            if (questionError) {
                await supabase.from('quizzes').delete().eq('id', quiz.id);
                return NextResponse.json({ success: false, message: questionError.message });
            }

            if (question.options && question.options.length > 0) {
                const options = question.options.map((opt, idx) => ({
                    question_id: questionData.id,
                    option_text: opt.text,
                    is_correct: opt.isCorrect || false,
                    order_index: idx
                }));

                const { error: optionsError } = await supabase
                    .from('quiz_options')
                    .insert(options);

                if (optionsError) {
                    await supabase.from('quizzes').delete().eq('id', quiz.id);
                    return NextResponse.json({ success: false, message: optionsError.message });
                }
            }
        }

        return NextResponse.json({ success: true, message: 'Quiz created successfully', quizId: quiz.id });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
