import { Webhook } from "svix";
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(request) {
    try {
        await connectDB();

        // Create a Svix instance with clerk webhook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        const body = await request.text();
        const headers = {
            "svix-id": request.headers.get("svix-id"),
            "svix-timestamp": request.headers.get("svix-timestamp"),
            "svix-signature": request.headers.get("svix-signature")
        };

        // Verifying Headers
        const evt = whook.verify(body, headers);

        // Getting Data from request body
        const { data, type } = JSON.parse(body);

        // Switch Cases for different Events
        switch (type) {
            case 'user.created': {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url,
                };
                await User.create(userData);
                break;
            }

            case 'user.updated': {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url,
                };
                await User.findByIdAndUpdate(data.id, userData);
                break;
            }

            case 'user.deleted': {
                await User.findByIdAndDelete(data.id);
                break;
            }
            default:
                break;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}
