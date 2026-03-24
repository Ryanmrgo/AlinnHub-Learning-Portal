# Supabase Setup Guide

This guide will help you set up Supabase for the quiz features in your LMS.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - **Name**: Choose a name (e.g., "LMS Quiz System")
   - **Database Password**: Create a strong password
   - **Region**: Choose the closest region to your users
5. Click "Create new project" and wait for provisioning

## Step 2: Get Your API Credentials

1. In your Supabase project dashboard, go to **Settings** (gear icon in sidebar)
2. Click on **API** in the left menu
3. Copy the following values:
   - **Project URL** (under "Project API")
   - **anon public** key (under "Project API keys")

## Step 3: Add Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace `your-project-url-here` and `your-anon-key-here` with the values you copied.

## Step 4: Database Schema

The database schema has already been created through migrations when you first run the application. The following tables will be automatically created:

- `quizzes` - Quiz metadata and settings
- `quiz_questions` - Quiz questions
- `quiz_options` - Answer options for questions
- `quiz_attempts` - Student quiz submissions and scores

### Verify Tables

To verify the tables were created:

1. In Supabase dashboard, click **Table Editor** in sidebar
2. You should see all four tables listed

## Step 5: Row Level Security (RLS)

RLS is automatically enabled on all tables with the following policies:

### Quizzes Table
- Authenticated users can view published quizzes
- Educators can create and manage quizzes

### Questions & Options Tables
- Authenticated users can view questions for published quizzes
- Educators can create, update, and delete questions

### Quiz Attempts Table
- Users can only view their own attempts
- Users can create and update their own attempts

## Step 6: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Log in as an educator
3. Go to "Manage Quizzes" in the sidebar
4. Try creating a test quiz
5. If successful, your Supabase integration is working

## Troubleshooting

### Connection Issues

If you see connection errors:

1. Verify your environment variables are correct
2. Check that `.env.local` is in the root directory
3. Restart your development server
4. Check Supabase project status in dashboard

### RLS Policy Errors

If you get permission errors:

1. Go to **Authentication** in Supabase dashboard
2. Ensure you're logged in through Clerk
3. Check that the `user_id` matches your Clerk user ID

### Table Not Found

If tables are missing:

1. The migration should run automatically
2. If not, check the migration files in your codebase
3. You can manually run SQL in Supabase SQL Editor

## Database Maintenance

### Viewing Data

1. Go to **Table Editor** in Supabase
2. Click on any table to view data
3. You can manually edit, add, or delete rows

### Backing Up Data

Supabase automatically backs up your data, but you can also:

1. Go to **Database** → **Backups**
2. Create manual backups as needed
3. Download backups for local storage

### Monitoring

1. Go to **Database** → **Logs**
2. Monitor queries and errors
3. Check **Reports** for usage statistics

## Security Best Practices

1. **Never commit** `.env.local` to version control
2. **Use different projects** for development and production
3. **Rotate keys** periodically in Supabase settings
4. **Monitor usage** to detect unusual activity
5. **Keep RLS enabled** on all tables

## Production Deployment

When deploying to production:

1. Create a new Supabase project for production
2. Add production environment variables to your hosting platform
3. Test all quiz functionality thoroughly
4. Monitor performance and errors

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

## Support

If you encounter issues:

1. Check Supabase status page
2. Review error logs in browser console
3. Check Supabase logs in dashboard
4. Refer to this project's QUIZ_FEATURES.md
