import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Course from '@/lib/models/Course';
import User from '@/lib/models/User';
import { Purchase } from '@/lib/models/Purchase';
import stripe from 'stripe';

export async function POST(request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { courseId } = await request.json();
        const origin = request.headers.get('origin') || 'http://localhost:3000';

        await connectDB();

        const courseData = await Course.findById(courseId);
        const userData = await User.findById(userId);

        if (!userData || !courseData) {
            return NextResponse.json({ success: false, message: 'Data Not Found' });
        }

        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount: (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2),
        };

        const newPurchase = await Purchase.create(purchaseData);

        // Stripe Gateway Initialize
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
        const currency = process.env.CURRENCY.toLowerCase();

        // Creating line items for Stripe
        const line_items = [{
            price_data: {
                currency,
                product_data: {
                    name: courseData.courseTitle
                },
                unit_amount: Math.floor(newPurchase.amount) * 100
            },
            quantity: 1
        }];

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            line_items: line_items,
            mode: 'payment',
            metadata: {
                purchaseId: newPurchase._id.toString()
            }
        });

        return NextResponse.json({ success: true, session_url: session.url });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
