# Development Guide

This guide provides detailed information for developers working on the Angular Checklist application.

## Project Overview

The Angular Checklist app is a Next.js 15 application that helps users manage learning modules and items for Angular framework mastery. It features user authentication, checklist management, and progress tracking.

## Technology Stack

### Core Technologies
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **React 18**: UI library
- **Tailwind CSS**: Utility-first CSS framework

### Backend & Database
- **Prisma**: Type-safe ORM
- **PostgreSQL**: Database (via Neon Serverless)
- **NextAuth v5**: Authentication library
- **bcrypt**: Password hashing

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Jest**: Testing framework
- **React Testing Library**: Component testing

## Project Structure

```
.
├── app/                        # Next.js App Router
│   ├── api/                   # API Routes
│   │   ├── auth/[...nextauth]/ # NextAuth handler
│   │   └── signup/            # User registration
│   ├── checklist/             # Checklist pages
│   │   ├── [id]/             # Dynamic checklist detail
│   │   └── page.tsx          # Checklist list
│   ├── profile/              # User profile
│   ├── signin/               # Sign-in page
│   ├── signup/               # Sign-up page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   └── globals.css           # Global styles
├── components/                # React components
│   ├── ChecklistList.tsx
│   ├── ChecklistItemList.tsx
│   ├── CreateChecklistForm.tsx
│   └── CreateChecklistItemForm.tsx
├── lib/                       # Shared utilities
│   ├── auth.ts               # NextAuth config
│   ├── prisma.ts             # Prisma client
│   └── actions.ts            # Server actions
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Seed script
├── __tests__/                # Test files
└── middleware.ts             # Route middleware
```

## Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (Neon recommended)

### Initial Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd angular-info-base
   npm install
   ```

2. **Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Database Setup**
   ```bash
   npm run prisma:generate  # Generate Prisma Client
   npm run prisma:push      # Push schema to database
   npm run seed             # (Optional) Seed test data
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Development Workflow

### Running the Application

```bash
npm run dev              # Start dev server (http://localhost:3000)
npm run build            # Build for production
npm start                # Start production server
```

### Code Quality

```bash
npm run lint             # Run ESLint
npm run typecheck        # Run TypeScript checks
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
```

### Database Operations

```bash
npm run prisma:generate  # Regenerate Prisma Client
npm run prisma:push      # Push schema changes
npm run prisma:migrate   # Create and run migrations
npm run seed             # Seed the database
```

### Testing

```bash
npm test                 # Run tests
npm run test:watch       # Run tests in watch mode
```

## Key Concepts

### Authentication Flow

1. **Sign Up** (`/api/signup`):
   - User submits email, password, name
   - Password is hashed with bcrypt
   - User record created in database
   - Auto sign-in after successful registration

2. **Sign In** (NextAuth):
   - Credentials provider validates email/password
   - bcrypt compares hashed passwords
   - JWT session created on success

3. **Protected Routes**:
   - Middleware checks session for `/checklist/*` and `/profile`
   - Server components verify session before rendering
   - Unauthorized users redirected to `/signin`

### Data Model

#### User
- Stores user credentials and profile
- Hashed passwords (bcrypt)
- One-to-many relationship with Checklists

#### Checklist
- Belongs to one User (owner)
- Has many ChecklistItems
- Includes title and optional description

#### ChecklistItem
- Belongs to one Checklist
- Tracks completion status (`done`)
- Supports ordering and notes
- Auto-updates `updatedAt` timestamp

### Server Actions

The app uses Next.js Server Actions for data mutations:

- `createChecklist(formData)` - Create new checklist
- `deleteChecklist(id)` - Delete checklist
- `createChecklistItem(checklistId, formData)` - Add item
- `toggleChecklistItem(id, done)` - Toggle completion
- `updateChecklistItem(id, formData)` - Update item
- `deleteChecklistItem(id)` - Delete item

All actions include authorization checks.

## Adding New Features

### Adding a New Page

1. Create file in `app/your-page/page.tsx`
2. Add authentication if needed
3. Update navigation in layouts

### Adding a New Component

1. Create file in `components/YourComponent.tsx`
2. Use `'use client'` directive if using hooks/state
3. Add tests in `__tests__/components/`

### Adding Database Fields

1. Update `prisma/schema.prisma`
2. Run `npm run prisma:push` (dev) or `npm run prisma:migrate` (prod)
3. Update TypeScript types
4. Update components and actions

### Adding Server Actions

1. Add function in `lib/actions.ts`
2. Mark with `'use server'` directive
3. Add authentication/authorization checks
4. Use `revalidatePath()` to update UI

## Common Tasks

### Reset Database (Development Only)

```bash
npx prisma migrate reset
npm run seed
```

### View Database

```bash
npx prisma studio
```

### Generate New Secret

```bash
openssl rand -base64 32
```

### Debug Issues

1. Check server logs in terminal
2. Use browser DevTools console
3. Check Prisma query logs (enabled in `lib/prisma.ts`)
4. Verify environment variables

## Performance Considerations

### Database Queries
- Use `include` judiciously to avoid over-fetching
- Add indexes for frequently queried fields
- Use Neon pooled connections for serverless

### Next.js Optimization
- Server Components by default (faster initial load)
- Client Components only when needed (interactivity)
- Automatic code splitting per route
- Image optimization with `next/image`

### Caching Strategy
- Server Actions revalidate paths after mutations
- Static pages cached by default
- Dynamic pages render on-demand

## Security Best Practices

1. **Never commit secrets**
   - Use `.env` for local development
   - Use environment variables in production
   - `.env` is gitignored by default

2. **Password Security**
   - Always hash passwords with bcrypt (10 rounds)
   - Never log or expose passwords
   - Use strong password requirements

3. **Authorization**
   - Check user ownership before mutations
   - Verify session in all protected routes
   - Use middleware for route protection

4. **Input Validation**
   - Validate on both client and server
   - Sanitize user input
   - Use TypeScript for type safety

## Troubleshooting

### "Module not found" errors
- Run `npm install`
- Delete `node_modules` and `.next`, then reinstall

### Database connection issues
- Check `DATABASE_URL` in `.env`
- Verify database is accessible
- Check SSL mode is enabled

### Build failures
- Run `npm run typecheck` to find type errors
- Check `npm run lint` for code issues
- Review build logs for specific errors

### NextAuth issues
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your URL
- Clear cookies and try again

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Create a pull request

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

Happy coding! 🚀
