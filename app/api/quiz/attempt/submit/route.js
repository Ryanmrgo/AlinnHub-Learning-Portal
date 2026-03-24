import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import supabase from '@/lib/supabase';

export async function POST(request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { quizId, answers, startedAt } = await request.json();

        if (!quizId || !answers) {
            return NextResponse.json({ success: false, message: 'Missing required fields' });
        }

        const { data: questions, error: questionsError } = await supabase
            .from('quiz_questions')
            .select('*, quiz_options(*)')
            .eq('quiz_id', quizId);

        if (questionsError) {
            return NextResponse.json({ success: false, message: questionsError.message });
        }

        let totalPoints = 0;
        let maxPoints = 0;

        const gradedAnswers = answers.map(answer => {
            const question = questions.find(q => q.id === answer.questionId);
            if (!question) return { ...answer, isCorrect: false, points: 0 };

            maxPoints += question.points;

            const correctOption = question.quiz_options.find(opt => opt.is_correct);
            const isCorrect = correctOption && correctOption.id === answer.selectedOptionId;

            if (isCorrect) {
                totalPoints += question.points;
            }

            return {
                ...answer,
                isCorrect,
                points: isCorrect ? question.points : 0,
                correctOptionId: correctOption ? correctOption.id : null
            };
        });

        const score = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;

        const completedAt = new Date();
        const timeTakenSeconds = startedAt ? Math.floor((completedAt - new Date(startedAt)) / 1000) : 0;

        const { data: attempt, error: attemptError } = await supabase
            .from('quiz_attempts')
            .insert({
                quiz_id: quizId,
                user_id: userId,
                score,
                total_points: totalPoints,
                max_points: maxPoints,
                answers: gradedAnswers,
                started_at: startedAt || new Date().toISOString(),
                completed_at: completedAt.toISOString(),
                time_taken_seconds: timeTakenSeconds
            })
            .select()
            .single();

        if (attemptError) {
            return NextResponse.json({ success: false, message: attemptError.message });
        }

        return NextResponse.json({
            success: true,
            message: 'Quiz submitted successfully',
            result: {
                attemptId: attempt.id,
                score,
                totalPoints,
                maxPoints,
                gradedAnswers,
                timeTakenSeconds
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
