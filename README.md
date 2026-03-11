# LMS Full Stack - Next.js

A comprehensive Learning Management System built with Next.js, MongoDB, and Clerk authentication.

## Tech Stack

- **Frontend & Backend**: Next.js 14 (App Router)
- **Database**: MongoDB with Mongoose
- **Authentication**: Clerk
- **Payment**: Stripe
- **File Upload**: Cloudinary
- **Styling**: Tailwind CSS

## Project Structure

```
lms-full-stack/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (backend)
│   │   ├── course/       # Course endpoints
│   │   ├── user/         # User endpoints
│   │   ├── educator/     # Educator endpoints
│   │   └── webhooks/     # Webhook handlers
│   ├── context/          # React Context
│   ├── student/          # Student page components
│   ├── educator/         # Educator page components
│   ├── layout.jsx        # Root layout
│   └── page.jsx          # Home page
├── components/            # Reusable components
│   ├── student/          # Student-facing components
│   └── educator/         # Educator-facing components
├── lib/                  # Utilities and configurations
│   ├── models/           # Mongoose models
│   ├── mongodb.js        # Database connection
│   ├── cloudinary.js     # Cloudinary config
│   └── assets.js         # Static assets
├── public/               # Static files
├── middleware.js         # Clerk middleware
└── .env.local           # Environment variables
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Make sure your `.env.local` file contains:

```env
MONGODB_URI="your-mongodb-uri"
CURRENCY="USD"
NEXT_PUBLIC_CURRENCY="$"

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
CLERK_SECRET_KEY="your-clerk-secret-key"
CLERK_WEBHOOK_SECRET="your-clerk-webhook-secret"

# Cloudinary
CLOUDINARY_NAME="your-cloudinary-name"
CLOUDINARY_API_KEY="your-cloudinary-api-key"
CLOUDINARY_SECRET_KEY="your-cloudinary-secret-key"

# Stripe
STRIPE_SECRET_KEY="your-stripe-secret-key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
STRIPE_WEBHOOK_SECRET="your-stripe-webhook-secret"
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## Features

### For Students
- Browse and search courses
- Enroll in courses
- Track learning progress
- Rate courses
- Watch video lectures

### For Educators
- Create and publish courses
- Upload course materials
- Track student enrollments
- View earnings dashboard
- Manage course content

## API Routes

All API routes are located in the `app/api` directory:

- `/api/course/*` - Course-related endpoints
- `/api/user/*` - User-related endpoints
- `/api/educator/*` - Educator-related endpoints
- `/api/webhooks/*` - Webhook handlers (Clerk, Stripe)

## Migration from MERN Stack

This project was migrated from a traditional MERN stack (Express + Vite) to Next.js:

- Express API routes → Next.js API routes
- React Router → Next.js App Router
- Vite → Next.js built-in bundler
- Server/Client separation → Unified Next.js app

## Notes

- The `client` and `server` folders are legacy and can be removed
- All API calls are now relative (no need for `BACKEND_URL`)
- File uploads use a temporary directory before Cloudinary upload
- Authentication is handled by Clerk middleware

## Deployment

This app can be deployed to Vercel:

1. Push your code to GitHub
2. Import the project to Vercel
3. Add environment variables
4. Deploy

Make sure to:
- Set up webhook URLs for Clerk and Stripe
- Configure Cloudinary for production
- Update MongoDB connection string for production

## License

ISC
