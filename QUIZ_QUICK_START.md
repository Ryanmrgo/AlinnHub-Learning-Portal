# Quiz Features - Quick Start Guide

Get your quiz system up and running in 5 minutes.

## Prerequisites

- Node.js 16+ installed
- Supabase account (free)
- Current LMS project running

## Step 1: Get Supabase Credentials (2 min)

1. Go to https://supabase.com and sign in
2. Create a new project or use existing one
3. Go to Settings → API
4. Copy these two values:
   - `Project URL` → Copy it
   - `anon public` key → Copy it

## Step 2: Update Environment Variables (1 min)

Open `.env.local` and add:

```env
NEXT_PUBLIC_SUPABASE_URL=paste-your-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste-your-key-here
```

Save the file.

## Step 3: Install & Run (2 min)

```bash
npm install
npm run dev
```

## Step 4: Test It Works (2 min)

1. Open http://localhost:3000
2. Log in as an educator
3. Click "Manage Quizzes" in sidebar
4. Click "Create New Quiz"
5. If the form appears, you're all set!

## Creating Your First Quiz

### As Educator:

1. **Go to Manage Quizzes** (sidebar → "Manage Quizzes")
2. **Select a course** from dropdown
3. **Click "Create New Quiz"**
4. **Fill quiz details:**
   - Title: "Chapter 1 Test"
   - Description: "Test your knowledge"
   - Duration: 30 minutes
   - Passing Score: 70%
5. **Add questions:**
   - Type question
   - Set points (e.g., 1)
   - Add 4 answer options
   - Check correct answer
   - Click "Add Question to Quiz"
6. **Review questions** (added to list below)
7. **Click "Create Quiz"**
8. **Click "Publish"** to make visible

### As Student:

1. **Enroll in course** (if not already)
2. **Go to course player**
3. **Scroll to "Course Quizzes"**
4. **Click quiz to take**
5. **Answer all questions**
6. **Click "Submit Quiz"**
7. **View results instantly**

## Useful Links

- **Supabase Dashboard**: https://app.supabase.com
- **Quiz Features Guide**: See QUIZ_FEATURES.md
- **Setup Instructions**: See SUPABASE_SETUP.md
- **Full Summary**: See IMPLEMENTATION_SUMMARY.md

## Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Environment Variables Needed

| Variable | Example | Required |
|----------|---------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJxx...` | Yes |
| `MONGODB_URI` | (existing) | Already set |
| Others | (existing) | Already set |

## Features Available

✓ Create unlimited quizzes
✓ Multiple choice questions
✓ Point-based scoring
✓ Real-time countdown timer
✓ Instant automatic grading
✓ Answer review with feedback
✓ Attempt history
✓ Retake unlimited times
✓ Pass/fail status
✓ Mobile responsive

## What Gets Created

When you set up Supabase, these tables are created automatically:

- `quizzes` - Quiz info
- `quiz_questions` - Questions
- `quiz_options` - Answer choices
- `quiz_attempts` - Student submissions

## File Locations

- **Quiz Management**: `/educator/manage-quizzes`
- **Take Quiz**: `/quiz/[quizId]`
- **API Routes**: `/api/quiz/*`
- **Component**: `/components/student/QuizList.jsx`

## Troubleshooting

### "Module not found: @supabase/supabase-js"
```bash
npm install @supabase/supabase-js
```

### "Cannot read properties of undefined (reading 'NEXT_PUBLIC_SUPABASE_URL')"
Check `.env.local` has the variables and restart dev server.

### Quiz doesn't show for students
Ensure quiz is "Published" (click Publish in Manage Quizzes).

### API connection error
Check Supabase project is active and API keys are correct.

## Next: Production Deployment

When ready for production:

1. Create new Supabase project for production
2. Get new API credentials
3. Update `.env.local` (or deployment platform env vars)
4. Run `npm run build` to verify
5. Deploy to hosting platform

## Support

- **Detailed Docs**: QUIZ_FEATURES.md
- **Setup Help**: SUPABASE_SETUP.md
- **Implementation Details**: IMPLEMENTATION_SUMMARY.md
- **Project README**: README.md

---

**That's it!** You now have a fully functional quiz system.

Next: Create your first quiz and test with students!
