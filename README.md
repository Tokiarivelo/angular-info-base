# Formation Platform (Angular Learning System)

A comprehensive Next.js 15 learning platform with course management, progress tracking, quizzes, and admin features.

## Features

### For Students

- 🔐 **Authentication**: Secure user registration and login using NextAuth v5 with JWT sessions
- 🌐 **Google OAuth**: Sign in with Google for seamless authentication
- 📚 **Course Enrollment**: Browse and enroll in courses
- 📖 **Chapter Learning**: Access structured course chapters with rich content
- 🎯 **Progress Tracking**: Track progress with repository links, website URLs, and screenshots
- 📸 **Screenshot Storage**: Upload screenshots of your work (stored in Cloudinary)
- 🧪 **Interactive Quizzes**: End-of-chapter quizzes with instant feedback
- ✅ **Chapter Completion**: Mark chapters as completed
- 🔄 **Chapter Navigation**: Easy navigation between previous and next chapters
- ✅ **Checklist Management**: Create, view, update, and delete personal checklists
- 📝 **Checklist Items**: Add items to checklists with notes, toggle completion status

### For Administrators

- 👤 **Admin Dashboard**: Comprehensive admin panel for managing the platform
- 📚 **Course Management**: Create, edit, and delete courses
- 📖 **Chapter Management**: Add chapters to courses with descriptions and live preview URLs
- 🧪 **Quiz Creation**: Create quizzes with multiple-choice questions and explanations
- 📊 **Analytics**: View enrollment and progress statistics
- 🔒 **Role-based Access**: Separate admin and user interfaces

## Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Database**: PostgreSQL (Neon Serverless)
- **ORM**: Prisma
- **Authentication**: NextAuth v5 (Credentials and Google OAuth providers with Prisma adapter)
- **Image Storage**: Cloudinary
- **Styling**: Tailwind CSS
- **Password Hashing**: bcrypt

## Prerequisites

- Node.js 18+ installed
- A Neon PostgreSQL database
- A Cloudinary account (free tier available)
- (Optional) Google OAuth credentials

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd angular-info-base
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Update the `.env` file with your credentials:

```env
# Database (from Neon)
DATABASE_URL=<your-neon-pooled-connection-string>

# NextAuth (IMPORTANT: Change in production!)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=change_me_replace_with_secure_random_secret_at_least_32_chars

# Cloudinary (from cloudinary.com)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google OAuth (Optional - from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

**Important**:

- Generate a secure NEXTAUTH_SECRET for production: `openssl rand -base64 32`
- Set up a free Cloudinary account at [cloudinary.com](https://cloudinary.com) for screenshot storage

### 4. Set up Cloudinary (Required for Screenshot Uploads)

1. Go to [cloudinary.com](https://cloudinary.com) and sign up for a free account
2. From your Cloudinary Dashboard, copy:
   - Cloud Name
   - API Key
   - API Secret
3. Add these to your `.env` file as shown above

### 5. Set up Google OAuth (Optional)

To enable "Sign in with Google":

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Select **Web application** as the application type
6. Add the following authorized redirect URIs:
   - For development: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://your-domain.com/api/auth/callback/google`
7. Copy the **Client ID** and **Client Secret**
8. Add them to your `.env` file

> **Note**: Google OAuth is optional. The app will still work with email/password authentication if Google credentials are not configured.

### 6. Generate Prisma Client

```bash
npm run prisma:generate
```

### 7. Run database migrations

Push the schema to your database:

```bash
npm run prisma:push
```

> **⚠️ Upgrading from an earlier version?** If you're upgrading and have existing OAuth accounts, see [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for important schema changes to the Account model (NextAuth v5 compatibility).

### 8. (Optional) Seed the database

```bash
npm run seed
```

This will create:

- A test user:
  - Email: `test@example.com`
  - Password: `password123`
  - Role: `USER`
- An admin user:
  - Email: `admin@example.com`
  - Password: `password123`
  - Role: `ADMIN`
- A sample course with chapters, checklists, and quizzes
- Sample course enrollment for the test user

### 9. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
.
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── auth/            # NextAuth handlers
│   │   ├── signup/          # User registration endpoint
│   │   └── upload/          # Cloudinary image upload
│   ├── admin/               # Admin panel
│   │   ├── courses/        # Course management
│   │   ├── layout.tsx      # Admin layout
│   │   └── page.tsx        # Admin dashboard
│   ├── checklist/          # Checklist pages
│   │   ├── [id]/          # Individual checklist detail
│   │   └── page.tsx       # Checklists list
│   ├── courses/            # Course pages
│   │   ├── chapter/[id]/  # Chapter detail page
│   │   └── page.tsx       # Courses list
│   ├── profile/           # User profile page
│   ├── signin/            # Sign-in page
│   ├── signup/            # Sign-up page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   │   ├── ChaptersList.tsx
│   │   └── CourseEditForm.tsx
│   ├── ChecklistList.tsx
│   ├── ChecklistItemList.tsx
│   ├── ChapterProgressForm.tsx
│   ├── EnrollButton.tsx
│   ├── QuizTaker.tsx
│   └── ...
├── lib/                   # Library code
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client singleton
│   └── actions.ts        # Server actions
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed script
├── middleware.ts         # Route protection middleware
└── package.json
```

## Database Schema

### User

- `id`: Unique identifier (CUID)
- `email`: User email (unique)
- `name`: User's name (optional)
- `password`: Hashed password
- `role`: User role (`USER` or `ADMIN`) - Admins can access admin panel
- `createdAt`: Timestamp of user creation

### Course

- `id`: Unique identifier (CUID)
- `title`: Course title
- `description`: Optional description
- `createdAt`: Timestamp of creation
- `updatedAt`: Timestamp of last update

### Chapter

- `id`: Unique identifier (CUID)
- `courseId`: Reference to Course
- `title`: Chapter title
- `description`: Optional description
- `content`: Rich text content for the chapter
- `livePreviewUrl`: URL for live preview of what user will learn
- `order`: Display order (integer)
- `createdAt`: Timestamp of creation
- `updatedAt`: Timestamp of last update

### Quiz

- `id`: Unique identifier (CUID)
- `chapterId`: Reference to Chapter
- `title`: Quiz title
- `description`: Optional description
- `passingScore`: Percentage required to pass (default: 70)
- `createdAt`: Timestamp of creation
- `updatedAt`: Timestamp of last update

### QuizQuestion

- `id`: Unique identifier (CUID)
- `quizId`: Reference to Quiz
- `question`: Question text
- `options`: Array of answer options
- `correctAnswer`: Index of the correct answer (0-based)
- `explanation`: Optional explanation shown after answering
- `order`: Display order (integer)

### QuizSubmission

- `id`: Unique identifier (CUID)
- `userId`: Reference to User
- `quizId`: Reference to Quiz
- `answers`: Array of selected answer indices
- `score`: Percentage score (0-100)
- `passed`: Whether the user passed
- `createdAt`: Timestamp of submission

### CourseEnrollment

- `id`: Unique identifier (CUID)
- `userId`: Reference to User
- `courseId`: Reference to Course
- `createdAt`: Timestamp of enrollment

### UserChapterProgress

- `id`: Unique identifier (CUID)
- `userId`: Reference to User
- `chapterId`: Reference to Chapter
- `repositoryUrl`: Link to the repository for the chapter
- `websiteUrl`: Link to the deployed website
- `completed`: Completion status (boolean)
- `createdAt`: Timestamp of creation
- `updatedAt`: Timestamp of last update

### Screenshot

- `id`: Unique identifier (CUID)
- `url`: Cloudinary URL
- `publicId`: Cloudinary public ID (for deletion)
- `userId`: Reference to User
- `progressId`: Reference to UserChapterProgress (optional)
- `caption`: Optional caption
- `createdAt`: Timestamp of upload

### Checklist

- `id`: Unique identifier (CUID)
- `title`: Checklist title
- `description`: Optional description
- `ownerId`: Reference to User
- `chapterId`: Optional reference to Chapter (checklists can belong to chapters)
- `createdAt`: Timestamp of creation

### ChecklistItem

- `id`: Unique identifier (CUID)
- `checklistId`: Reference to Checklist
- `title`: Item title
- `done`: Completion status (boolean)
- `order`: Display order (integer)
- `notes`: Optional notes
- `updatedAt`: Timestamp of last update

## Cloudinary Setup (Image Storage)

This application uses Cloudinary for storing user-uploaded screenshots.

### Cloudinary (Recommended & Implemented)

- **Free Tier**: 25 GB storage, 25 GB bandwidth/month
- **Features**: Automatic image optimization, transformations, CDN delivery
- **Setup Steps**:
  1. Create a free account at [cloudinary.com](https://cloudinary.com)
  2. From your Dashboard, copy your Cloud Name, API Key, and API Secret
  3. Add these credentials to your `.env` file (see Environment Variables section)
  4. Images are automatically optimized and delivered via CDN

### Alternative Options

- **Firebase Storage**: 5 GB storage, 1 GB/day download (free tier)
- **AWS S3**: 5 GB storage, 20,000 GET requests/month (12-month free tier)

> **Note**: The application is already configured for Cloudinary. To use an alternative, you'll need to modify `/app/api/upload/route.ts`.

## Internationalization (i18n)

The application supports multiple languages (currently English and French).

- **Framework**: `next-intl`
- **Language Switching**: Toggle between English and French via the global language selector in the header.
- **Content Generation**: The AI Chapter Generator can create content in your selected language (English or French).

## AI Chapter Generator

Admins can use the AI assistant to generate comprehensive chapter content.

- **Features**:
  - Automatically generates chapter **Title** and **Description**
  - Creates structured content with **Rich Text**, **Code Blocks**, and **Pro Tips**
  - Generates prompts for **Cover Images**
  - Supports **Multi-language Generation** (English/French)
  - **One-click Apply**: Apply all generated metadata and content at once

### Block-Level AI Actions

Each content block in the rich content editor has AI-powered actions:

- **🔄 AI Regenerate Block**: Click the sparkle icon on any block to regenerate its content
  - Quick actions: "More concise", "More detailed", "Add example"
  - Custom instructions for specific improvements
  - Preserves block type while improving content

- **✨ AI Improve Selection**: Select text in the rich text editor to reveal the "AI Improve" button
  - Quick actions: "Fix grammar", "More professional", "Simplify", "Expand"
  - Custom instructions for targeted improvements
  - Preview changes before applying

### AI Image Generation

Generate chapter cover images automatically using AI:

- **🖼️ Generate with AI**: Click the button in the Chapter Image section
  - Uses **Google Imagen 3** for high-quality image generation
  - Generates images based on chapter title, description, and content
  - Automatically uploads to Cloudinary
  - Supports **regeneration** to try different variations

### Environment Variables

```env
# Gemini AI (Required for AI features)
GEMINI_API_KEY=your_gemini_api_key

# Pollinations.ai (Optional - fallback for image generation)
POLLINATIONS_API_KEY=your_pollinations_api_key
```

- **GEMINI_API_KEY**: Get your API key from [Google AI Studio](https://aistudio.google.com/apikey)
- **POLLINATIONS_API_KEY**: Optional, used as fallback if Gemini image generation fails

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run format` - Format code with Prettier
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:push` - Push schema to database without migrations
- `npm run seed` - Seed the database with sample data
- `npm test` - Run tests

## API Endpoints

### Authentication

### API Routes

- `POST /api/signup` - Register a new user
  ```bash
  curl -X POST http://localhost:3000/api/signup \
    -H "Content-Type: application/json" \
    -d '{"email":"user@example.com","password":"password123","name":"John Doe"}'
  ```
- `POST /api/auth/signin` - Sign in (handled by NextAuth)
- `GET /api/auth/signout` - Sign out (handled by NextAuth)
- `POST /api/upload` - Upload image to Cloudinary (authenticated)
- `DELETE /api/upload?publicId=xxx` - Delete image from Cloudinary (authenticated)

### Server Actions

**Checklist Actions**

- `createChecklist(formData)` - Create a new checklist
- `deleteChecklist(checklistId)` - Delete a checklist
- `createChecklistItem(checklistId, formData)` - Add item to checklist
- `toggleChecklistItem(itemId, done)` - Toggle item completion
- `updateChecklistItem(itemId, formData)` - Update item details
- `deleteChecklistItem(itemId)` - Delete an item

**Course & Progress Actions**

- `enrollInCourse(courseId)` - Enroll in a course
- `updateChapterProgress(chapterId, formData)` - Update chapter progress (repo/site URLs)
- `addScreenshotToProgress(chapterId, url, publicId)` - Add screenshot to progress
- `removeScreenshotFromProgress(screenshotId, chapterId)` - Remove screenshot
- `toggleChapterCompletion(chapterId, completed)` - Mark chapter as complete/incomplete

**Quiz Actions**

- `submitQuiz(quizId, answers)` - Submit quiz answers and get results

**Admin Actions** (Admin role required)

- `createCourse(formData)` - Create a new course
- `updateCourse(courseId, formData)` - Update course details
- `deleteCourse(courseId)` - Delete a course
- `createChapter(courseId, formData)` - Add chapter to course
- `updateChapter(chapterId, formData)` - Update chapter details
- `deleteChapter(chapterId)` - Delete a chapter
- `createQuiz(chapterId, formData)` - Create a quiz for a chapter
- `updateQuiz(quizId, formData)` - Update quiz details
- `deleteQuiz(quizId)` - Delete a quiz
- `createQuizQuestion(quizId, formData)` - Add question to quiz
- `deleteQuizQuestion(questionId)` - Delete a quiz question

## Admin Panel

Access the admin panel at `/admin` (requires ADMIN role).

### Admin Features

- **Dashboard**: View platform statistics (courses, chapters, users, enrollments)
- **Course Management**: Create, edit, and delete courses
- **Chapter Management**: Add chapters to courses with descriptions and live preview URLs
- **Quiz Management**: Create quizzes with multiple-choice questions
- **Real-time Updates**: All changes are immediately reflected in the user interface

### Creating Your First Course (Admin)

1. Sign in with admin credentials (email: `admin@example.com`, password: `password123` if using seed data)
2. Navigate to `/admin/courses`
3. Click "Create Course"
4. Fill in course details and save
5. Add chapters to the course
6. Optionally add quizzes to chapters

## Database Configuration

### Neon Serverless PostgreSQL

The application is configured to use Neon's pooled connection by default (`DATABASE_URL`). This is recommended for serverless environments and most use cases.

**Note**: Use your own Neon database credentials (available from your Neon dashboard or repository settings).

```env
DATABASE_URL=postgresql://username:password@host-pooler.region.aws.neon.tech/dbname?sslmode=require
```

If you need to use the unpooled connection (e.g., for certain Prisma CLI operations), you can use the `DATABASE_URL_UNPOOLED` variable.

## Deployment

### Deploy to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Import your repository in Vercel

3. Configure environment variables in Vercel:
   - `DATABASE_URL` - Your Neon pooled connection string
   - `NEXTAUTH_URL` - Your production URL (e.g., `https://your-app.vercel.app`)
   - `NEXTAUTH_SECRET` - A strong random secret (generate with `openssl rand -base64 32`)
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY` - Your Cloudinary API key
   - `CLOUDINARY_API_SECRET` - Your Cloudinary API secret
   - `GOOGLE_CLIENT_ID` - (Optional) Your Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET` - (Optional) Your Google OAuth client secret

4. Deploy!

### Environment Variables for Production

Make sure to set these in your deployment platform:

```env
DATABASE_URL=<your-neon-pooled-connection-string>
NEXTAUTH_URL=<your-production-url>
NEXTAUTH_SECRET=<strong-random-secret-at-least-32-chars>

# Cloudinary (Required)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>

# Optional: For Google OAuth
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

## Security Notes

- ✅ Passwords are hashed with bcrypt before storage
- ✅ JWT sessions with secure secrets
- ✅ Server-side authorization checks on all protected routes
- ✅ CSRF protection via NextAuth
- ⚠️ **Important**: Change `NEXTAUTH_SECRET` to a strong random value in production
- ⚠️ Never commit `.env` files to version control

## Testing

The project includes Jest and React Testing Library for testing. Add your tests in `__tests__` directories or `.test.ts/tsx` files.

```bash
npm test
```

## Troubleshooting

### Database connection issues

- Verify your `DATABASE_URL` in `.env` is correct
- Check that your Neon database is active
- Ensure SSL mode is enabled (`sslmode=require`)

### Migration errors

- Use `npm run prisma:push` for quick schema updates during development
- Use `npm run prisma:migrate` for production-ready migrations
- If migrations are out of sync, you may need to reset the database (development only):
  ```bash
  npx prisma migrate reset
  ```

### NextAuth errors

- Ensure `NEXTAUTH_URL` matches your application URL
- Verify `NEXTAUTH_SECRET` is set and is at least 32 characters
- Check that the Prisma adapter models are correctly migrated

## License

MIT

---

© Angular Checklist App — Built with Next.js 15
