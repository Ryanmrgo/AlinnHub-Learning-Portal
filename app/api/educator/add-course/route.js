import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import connectCloudinary, { cloudinary } from '@/lib/cloudinary';
import Course from '@/lib/models/Course';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';

async function checkEducatorRole(userId) {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    return user.publicMetadata.role === 'educator';
}

export async function POST(request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        // Check educator role
        const isEducator = await checkEducatorRole(userId);
        if (!isEducator) {
            return NextResponse.json({ success: false, message: 'Unauthorized Access' });
        }

        const formData = await request.formData();
        const courseData = formData.get('courseData');
        const imageFile = formData.get('image');

        if (!imageFile) {
            return NextResponse.json({ success: false, message: 'Thumbnail Not Attached' });
        }

        await connectDB();
        connectCloudinary();

        const parsedCourseData = JSON.parse(courseData);
        parsedCourseData.educator = userId;

        const newCourse = await Course.create(parsedCourseData);

        // Convert file to buffer and upload to Cloudinary
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create a temporary file
        const tempFilePath = path.join(process.cwd(), 'temp', `${Date.now()}-${imageFile.name}`);
        await writeFile(tempFilePath, buffer);

        try {
            const imageUpload = await cloudinary.uploader.upload(tempFilePath);
            newCourse.courseThumbnail = imageUpload.secure_url;
            await newCourse.save();

            // Delete temp file
            await unlink(tempFilePath);
        } catch (error) {
            // Delete temp file even if upload fails
            await unlink(tempFilePath).catch(() => {});
            throw error;
        }

        return NextResponse.json({ success: true, message: 'Course Added' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
