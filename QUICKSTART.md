# Quick Start Guide

Get started with the Angular Checklist App in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- A terminal/command line
- A Neon PostgreSQL database (credentials provided in `.env.example`)

## 🚀 5-Minute Setup

### Step 1: Clone and Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/Tokiarivelo/angular-info-base.git
cd angular-info-base

# Install dependencies
npm install
```

### Step 2: Configure Environment (1 minute)

```bash
# Copy the example environment file
cp .env.example .env

# The .env file already contains working Neon database credentials
# For production, update NEXTAUTH_SECRET to a secure random value
```

### Step 3: Set Up Database (1 minute)

```bash
# Generate Prisma Client
npm run prisma:generate

# Push the schema to your database
npm run prisma:push

# (Optional) Add sample data
npm run seed
```

### Step 4: Start the App (30 seconds)

```bash
# Start the development server
npm run dev
```

### Step 5: Use the App! (30 seconds)

Open your browser to [http://localhost:3000](http://localhost:3000)

**If you ran the seed script, you can sign in with:**
- Email: `test@example.com`
- Password: `password123`

**Or create your own account:**
1. Click "Sign Up"
2. Enter your email, password, and name
3. You'll be automatically signed in

## 🎯 What You Can Do

### Create Your First Checklist

1. Click "+ New Checklist"
2. Enter a title (e.g., "Angular Fundamentals")
3. Add an optional description
4. Click "Create Checklist"

### Add Items to Your Checklist

1. Click on a checklist to view details
2. Click "+ Add Item"
3. Enter the item title (e.g., "Learn Components")
4. Add optional notes
5. Click "Add Item"

### Track Your Progress

- ✅ Check items off as you complete them
- 📊 See your progress percentage
- ✏️ Edit items to add notes or update titles
- 🗑️ Delete items you no longer need

## 📱 Pages Overview

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Landing page with sign-in/sign-up links |
| Sign Up | `/signup` | Create a new account |
| Sign In | `/signin` | Log in to your account |
| Checklists | `/checklist` | View all your checklists |
| Checklist Detail | `/checklist/[id]` | View and manage a specific checklist |
| Profile | `/profile` | View your profile and sign out |

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:push      # Push schema changes
npm run seed             # Add sample data

# Code Quality
npm run lint             # Check for linting issues
npm run typecheck        # Check TypeScript types
npm run format           # Format code
npm test                 # Run tests
```

## 🆘 Troubleshooting

### "Can't reach database server"

Your database might not be accessible. Check:
1. Is your internet connection working?
2. Is the `DATABASE_URL` in `.env` correct?
3. Is your Neon database active?

**Solution**: Verify your `.env` file has the correct database URL.

### "Module not found" errors

Dependencies might not be installed properly.

**Solution**: 
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 already in use

Another application is using port 3000.

**Solution**: 
```bash
# Use a different port
PORT=3001 npm run dev
```

Or stop the other application using port 3000.

### Authentication not working

**Solution**:
1. Clear your browser cookies
2. Check that `NEXTAUTH_SECRET` is set in `.env`
3. Restart the development server

## 📖 Next Steps

Now that you have the app running:

1. **Read the Documentation**
   - [README.md](README.md) - Full documentation
   - [DEVELOPMENT.md](DEVELOPMENT.md) - Developer guide
   - [DEPLOYMENT.md](DEPLOYMENT.md) - Deploy to Vercel

2. **Customize the App**
   - Modify the UI in `components/`
   - Add new features in `app/`
   - Update the database schema in `prisma/schema.prisma`

3. **Deploy to Production**
   - Follow the [DEPLOYMENT.md](DEPLOYMENT.md) guide
   - Deploy to Vercel in minutes

## 🎓 Learning Resources

- **Next.js**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs
- **NextAuth**: https://next-auth.js.org
- **Tailwind CSS**: https://tailwindcss.com/docs

## 💡 Tips

- Use `npm run dev` to see changes instantly (hot reload)
- Check the browser console for debugging
- Use `npx prisma studio` to view your database
- Create `.env.local` for local overrides (gitignored)

---

**That's it! You're ready to manage your Angular learning journey! 🚀**

Need help? Check the [README.md](README.md) or [DEVELOPMENT.md](DEVELOPMENT.md) for more details.
