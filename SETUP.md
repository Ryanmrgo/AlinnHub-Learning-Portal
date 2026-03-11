# Installation and Setup Guide

## Quick Start

Run this command to install dependencies:

```bash
npm install
```

Then start the development server:

```bash
npm run dev
```

## What Changed from MERN to Next.js

### Old Structure (MERN)
- **Client**: React + Vite (port 5173)
- **Server**: Express (port 5000)
- Separate frontend and backend
- React Router for navigation
- Axios calls to backend URL

### New Structure (Next.js)
- **Unified**: Next.js handles both frontend and backend (port 3000)
- API routes in `app/api/`
- Next.js App Router for navigation
- Relative API calls (no backend URL needed)

## Key Changes

1. **No Vite**: Next.js has its own bundler
2. **No Express**: Next.js API routes replace Express
3. **No React Router**: Next.js App Router handles routing
4. **Integrated Auth**: Clerk middleware in `middleware.js`

## Project Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Environment Setup

Copy the `.env.local` file and update with your credentials:
- MongoDB URI
- Clerk keys
- Cloudinary credentials

## Directory Overview

```
app/
  ├── api/           # Backend API routes (replaces Express)
  ├── context/       # React Context providers
  ├── course/        # Course pages
  ├── educator/      # Educator dashboard
  └── page.jsx       # Home page

components/          # Reusable UI components
lib/                 # Utilities, models, configs
public/              # Static assets
middleware.js        # Clerk authentication
```

## Migration Notes

The `client` and `server` folders are legacy code from the MERN stack.
You can safely delete them as all functionality has been migrated to Next.js.

To remove old folders:
```bash
Remove-Item -Path client -Recurse -Force
Remove-Item -Path server -Recurse -Force
```

## Troubleshooting

**Port already in use:**
```bash
# Kill process on port 3000 (Windows)
npx kill-port 3000
```

**Module not found:**
```bash
# Clear Next.js cache
Remove-Item -Path .next -Recurse -Force
npm install
npm run dev
```

**Image imports not working:**
- Make sure images are in `public/assets/`
- Reference them as `/assets/image.svg` not relative paths

## Webhooks Setup

For Clerk webhooks:
1. Go to Clerk Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/clerk`
3. Subscribe to: `user.created`, `user.updated`, `user.deleted`

////create .env.localfile in root of this file and copy paste the following code

MONGODB_URI="mongodb+srv://pyaesone:pyaesone123@cluster0.2psuhui.mongodb.net/?appName=Cluster0"
CURRENCY="USD"
NEXT_PUBLIC_CURRENCY="$"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_ZmxleGlibGUtaGF3ay01NS5jbGVyay5hY2NvdW50cy5kZXYk"
CLERK_SECRET_KEY="sk_test_5s81LYlX7Hmd53bkUx4CQ4zWGOtTs2TI2Nyu6Ieuib"

CLOUDINARY_NAME="dy11dffoc"
CLOUDINARY_API_KEY="938698419742869"
CLOUDINARY_SECRET_KEY="ILlwLflKN5-SWLTnwf8qENRuoG8"

CLERK_WEBHOOK_SECRET="whsec_cENzxr/yDgMZdEkafDfj0TTvUVsICMWx"
