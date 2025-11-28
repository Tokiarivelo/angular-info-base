# Angular Checklist App

A Next.js 15 application implementing an Angular learning checklist with user authentication and checklist management.

## Features

- 🔐 **Authentication**: Secure user registration and login using NextAuth v5 with JWT sessions
- 🌐 **Google OAuth**: Sign in with Google for seamless authentication
- 👤 **Role-based Access**: Admin role for managing users, courses, and viewing all tasks
- ✅ **Checklist Management**: Create, view, update, and delete checklists
- 📝 **Checklist Items**: Add items to checklists with notes, toggle completion status, and track progress
- 📚 **Courses**: Create courses with multiple chapters and learning materials
- 📖 **Chapters**: Each chapter can have live preview URLs and multiple checklists
- 🎯 **Progress Tracking**: Track user progress with repository links, website URLs, and screenshots
- 📸 **Screenshot Storage**: Support for cloud storage (Cloudinary recommended) for progress screenshots
- 🎨 **Modern UI**: Built with Tailwind CSS for a clean, responsive interface
- 🔒 **Authorization**: Each user can only access and modify their own checklists
- 🗄️ **Database**: PostgreSQL via Neon Serverless with Prisma ORM

## Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Database**: PostgreSQL (Neon Serverless)
- **ORM**: Prisma
- **Authentication**: NextAuth v5 (Credentials and Google OAuth providers with Prisma adapter)
- **Styling**: Tailwind CSS
- **Password Hashing**: bcrypt

## Prerequisites

- Node.js 18+ installed
- A Neon PostgreSQL database (credentials provided in `.env`)

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

The `.env.example` file already contains the Neon database credentials. **Important**: In production, change the `NEXTAUTH_SECRET` to a strong random string (at least 32 characters).

```bash
# Generate a secure secret for production
openssl rand -base64 32
```

### 4. Set up Google OAuth (Optional)

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
8. Add them to your `.env` file:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

> **Note**: Google OAuth is optional. The app will still work with email/password authentication if Google credentials are not configured.

### 5. Generate Prisma Client

```bash
npm run prisma:generate
```

### 6. Run database migrations

```bash
npm run prisma:migrate
```

Alternatively, you can use `prisma db push` for development:

```bash
npm run prisma:push
```

### 7. (Optional) Seed the database

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
- A sample course with chapters and checklists
- Sample course enrollment for the test user

### 8. Start the development server

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
│   │   └── signup/          # User registration endpoint
│   ├── checklist/           # Checklist pages
│   │   ├── [id]/           # Individual checklist detail
│   │   └── page.tsx        # Checklists list
│   ├── profile/            # User profile page
│   ├── signin/             # Sign-in page
│   ├── signup/             # Sign-up page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/             # React components
│   ├── ChecklistList.tsx
│   ├── ChecklistItemList.tsx
│   ├── CreateChecklistForm.tsx
│   └── CreateChecklistItemForm.tsx
├── lib/                    # Library code
│   ├── auth.ts            # NextAuth configuration
│   ├── prisma.ts          # Prisma client singleton
│   └── actions.ts         # Server actions
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed script
├── middleware.ts          # Route protection middleware
└── package.json
```

## Database Schema

### User
- `id`: Unique identifier (CUID)
- `email`: User email (unique)
- `name`: User's name (optional)
- `password`: Hashed password
- `role`: User role (`USER` or `ADMIN`) - Admins can manage users, courses, and view all tasks
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
- `livePreviewUrl`: URL for live preview of what user will learn in the chapter
- `order`: Display order (integer)
- `createdAt`: Timestamp of creation
- `updatedAt`: Timestamp of last update

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
- `websiteUrl`: Link to the website created
- `screenshotUrls`: Array of screenshot URLs (stored in cloud storage)
- `completed`: Completion status (boolean)
- `createdAt`: Timestamp of creation
- `updatedAt`: Timestamp of last update

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

## Cloud Storage for Screenshots

For storing user screenshots, we recommend using one of these free cloud storage services:

### Cloudinary (Recommended)
- **Free Tier**: 25 GB storage, 25 GB bandwidth/month
- **Setup**: Create a free account at [cloudinary.com](https://cloudinary.com)
- **Usage**: Upload images via API and store the returned URL in `screenshotUrls`
- **Example URL**: `https://res.cloudinary.com/demo/image/upload/v1234567890/screenshot.png`

### Firebase Storage
- **Free Tier**: 5 GB storage, 1 GB/day download
- **Setup**: Create a Firebase project at [firebase.google.com](https://firebase.google.com)

### AWS S3 (Free Tier)
- **Free Tier**: 5 GB storage, 20,000 GET requests, 2,000 PUT requests/month (12 months)
- **Setup**: Create an AWS account at [aws.amazon.com](https://aws.amazon.com)

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
- `POST /api/signup` - Register a new user
  ```bash
  curl -X POST http://localhost:3000/api/signup \
    -H "Content-Type: application/json" \
    -d '{"email":"user@example.com","password":"password123","name":"John Doe"}'
  ```

- `POST /api/auth/signin` - Sign in (handled by NextAuth)
- `GET /api/auth/signout` - Sign out (handled by NextAuth)

### Server Actions (via forms)
- `createChecklist` - Create a new checklist
- `deleteChecklist` - Delete a checklist
- `createChecklistItem` - Add item to checklist
- `toggleChecklistItem` - Toggle item completion
- `updateChecklistItem` - Update item details
- `deleteChecklistItem` - Delete an item

## Database Configuration

### Neon Serverless PostgreSQL

The application is configured to use Neon's pooled connection by default (`DATABASE_URL`). This is recommended for serverless environments and most use cases.

**Pooled Connection** (Default):
```
DATABASE_URL=postgresql://neondb_owner:npg_j4m3MTOUkPDq@ep-winter-pine-a4uk962n-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Direct Connection** (for tools incompatible with pgBouncer):
```
DATABASE_URL_UNPOOLED=postgresql://neondb_owner:npg_j4m3MTOUkPDq@ep-winter-pine-a4uk962n.us-east-1.aws.neon.tech/neondb?sslmode=require
```

If you need to use the unpooled connection (e.g., for certain Prisma CLI operations), temporarily update `DATABASE_URL` in your `.env` file.

## Deployment

### Deploy to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Import your repository in Vercel

3. Configure environment variables in Vercel:
   - `DATABASE_URL` - Your Neon pooled connection string
   - `NEXTAUTH_URL` - Your production URL (e.g., `https://your-app.vercel.app`)
   - `NEXTAUTH_SECRET` - A strong random secret (generate with `openssl rand -base64 32`)
   - `GOOGLE_CLIENT_ID` - (Optional) Your Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET` - (Optional) Your Google OAuth client secret

4. Deploy!

### Environment Variables for Production

Make sure to set these in your deployment platform:

```env
DATABASE_URL=<your-neon-pooled-connection-string>
NEXTAUTH_URL=<your-production-url>
NEXTAUTH_SECRET=<strong-random-secret-at-least-32-chars>

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
