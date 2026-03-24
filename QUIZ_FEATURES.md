# Quiz and Enhanced Video Lecture Features

This document outlines the new quiz and video lecture features added to the LMS platform.

## Overview

The LMS now includes a comprehensive quiz system with the following capabilities:
- Educators can create multiple-choice quizzes with timed assessments
- Students can take quizzes, see immediate results, and review answers
- Quiz progress tracking and attempt history
- Automatic grading system
- Integration with existing course structure

## Database Schema (Supabase)

### Tables Created

1. **quizzes**
   - Stores quiz metadata (title, description, duration, passing score)
   - Links to MongoDB courses via course_id
   - Published/draft status control

2. **quiz_questions**
   - Multiple-choice questions
   - Point values for each question
   - Ordered display

3. **quiz_options**
   - Answer choices for each question
   - Correct answer marking

4. **quiz_attempts**
   - Student quiz submissions
   - Scores, time taken, and detailed answers
   - Historical tracking of all attempts

### Security (RLS Policies)

All tables have Row Level Security enabled with policies ensuring:
- Only authenticated users can access quizzes
- Users can only view their own attempts
- Published quizzes are visible to enrolled students
- Proper access control for educators

## Features Implemented

### For Educators

#### Quiz Management Dashboard (`/educator/manage-quizzes`)

Features:
- Create new quizzes for any course
- Set quiz parameters:
  - Title and description
  - Time duration (minutes)
  - Passing score percentage
- Add multiple-choice questions with:
  - Question text
  - Point values
  - 4 answer options
  - Mark correct answers
- Publish/unpublish quizzes
- Delete quizzes
- View all quizzes per course

Access: Navigate to "Manage Quizzes" in the educator sidebar

### For Students

#### Quiz Taking Interface (`/quiz/[quizId]`)

Features:
- Clean, distraction-free quiz interface
- Real-time countdown timer
- Progress tracking (questions answered)
- Navigation between questions
- Answer selection with visual feedback
- Auto-submit when time expires
- Previous attempts history

#### Quiz Results

Features:
- Immediate score display after submission
- Pass/fail status based on passing score
- Detailed answer review showing:
  - Correct answers highlighted in green
  - Incorrect selections marked in red
  - Points earned per question
- Time taken statistics
- Option to retake quiz

#### Quiz Access

Quizzes are accessible from:
1. Course player page (shows all published quizzes for the course)
2. Direct link to quiz (`/quiz/[quizId]`)

## API Routes

### Quiz Management

- `POST /api/quiz/create` - Create a new quiz with questions
- `GET /api/quiz/[quizId]` - Get quiz details with questions
- `PUT /api/quiz/[quizId]` - Update quiz (publish/unpublish)
- `DELETE /api/quiz/[quizId]` - Delete a quiz
- `GET /api/quiz/course/[courseId]` - Get all quizzes for a course

### Quiz Attempts

- `POST /api/quiz/attempt/submit` - Submit quiz answers and get results
- `GET /api/quiz/attempts/[quizId]` - Get user's previous attempts

## Video Lecture Enhancements

The existing video lecture system has been enhanced with:

1. **YouTube Video Support**
   - Robust YouTube URL parsing (supports youtube.com, youtu.be, embed, shorts)
   - Embedded video player in course content
   - Direct playback from course structure

2. **Progress Tracking**
   - Mark lectures as completed
   - Visual indicators (checkmarks) for completed lectures
   - Progress percentage tracking

3. **Course Navigation**
   - Expandable/collapsible chapters
   - Lecture duration display
   - Click to watch functionality

## Environment Variables Required

Add these to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Usage Instructions

### For Educators

1. **Create a Quiz**
   - Go to Educator Dashboard
   - Click "Manage Quizzes" in sidebar
   - Select a course from dropdown
   - Click "Create New Quiz"
   - Fill in quiz details:
     - Title (e.g., "Chapter 1 Assessment")
     - Description (optional)
     - Duration in minutes
     - Passing score percentage
   - Add questions:
     - Enter question text
     - Set point value
     - Add 4 answer options
     - Check the correct answer(s)
     - Click "Add Question to Quiz"
   - Review all questions
   - Click "Create Quiz"
   - Publish the quiz when ready

2. **Manage Existing Quizzes**
   - View all quizzes in table format
   - Toggle publish/unpublish status
   - Delete quizzes if needed

### For Students

1. **Taking a Quiz**
   - Enroll in a course
   - Go to course player page
   - Scroll to "Course Quizzes" section
   - Click on any available quiz
   - Read quiz information
   - Click "Take Quiz"
   - Answer questions:
     - Select one answer per question
     - Use Next/Previous to navigate
     - Watch the timer
   - Click "Submit Quiz" when finished
   - Review your results

2. **Reviewing Results**
   - View your score and pass/fail status
   - Review all questions with correct answers
   - See which questions you got right/wrong
   - Check time taken
   - Option to retake quiz or go back

## Technical Implementation Details

### Frontend Components

- `ManageQuizzes.jsx` - Educator quiz management interface
- `QuizList.jsx` - Display quizzes on course player
- Quiz page with real-time timer and answer tracking
- Results page with detailed feedback

### Backend API

- RESTful API routes using Next.js App Router
- Clerk authentication integration
- Supabase database operations
- Automatic grading algorithm

### Database

- Supabase PostgreSQL database
- Normalized schema design
- Proper foreign key relationships
- Efficient indexing for performance

### Security

- Row Level Security (RLS) on all tables
- Authentication required for all quiz operations
- Users can only access their own attempts
- Input validation on all API routes

## Future Enhancements

Potential improvements for the quiz system:

1. **Question Types**
   - True/False questions
   - Multiple correct answers
   - Fill in the blank
   - Essay questions with manual grading

2. **Advanced Features**
   - Question banks and random selection
   - Quiz templates
   - Analytics and reporting for educators
   - Export quiz results to CSV
   - Question difficulty levels
   - Adaptive quizzing

3. **Gamification**
   - Badges and achievements
   - Leaderboards
   - Streak tracking
   - Points system

4. **Accessibility**
   - Screen reader support
   - Keyboard navigation
   - High contrast mode
   - Text-to-speech for questions

## Troubleshooting

### Quiz Not Showing

- Ensure quiz is published (educators only can see drafts)
- Check if user is enrolled in the course
- Verify Supabase connection

### Timer Issues

- Check browser console for errors
- Ensure JavaScript is enabled
- Try refreshing the page

### Submission Failures

- Check network connection
- Verify authentication status
- Check API route logs

## File Structure

```
app/
├── api/
│   └── quiz/
│       ├── create/route.js
│       ├── [quizId]/route.js
│       ├── course/[courseId]/route.js
│       ├── attempt/
│       │   └── submit/route.js
│       └── attempts/[quizId]/route.js
├── educator/
│   ├── ManageQuizzes.jsx
│   └── manage-quizzes/page.jsx
├── quiz/
│   └── [quizId]/page.jsx
└── student/
    └── Player.jsx (enhanced)

components/
└── student/
    └── QuizList.jsx

lib/
└── supabase.js
```

## Support

For issues or questions, refer to:
- Supabase documentation: https://supabase.com/docs
- Next.js documentation: https://nextjs.org/docs
- This project's README.md
