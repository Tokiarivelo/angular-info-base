# Deployment Guide

## Deploy to Vercel

This guide explains how to deploy the Angular Checklist app to Vercel.

### Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Your Neon PostgreSQL database credentials
3. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

### Step-by-Step Deployment

#### 1. Import Your Repository

1. Log in to Vercel
2. Click "Add New Project"
3. Import your Git repository
4. Vercel will automatically detect it's a Next.js project

#### 2. Configure Environment Variables

Before deploying, add these environment variables in Vercel:

```
DATABASE_URL=postgresql://neondb_owner:npg_j4m3MTOUkPDq@ep-winter-pine-a4uk962n-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-generated-secret-here
```

**Important Steps:**

1. In your Vercel project settings, go to "Environment Variables"
2. Add `DATABASE_URL` with your Neon pooled connection string
3. Add `NEXTAUTH_URL` - this will be your Vercel deployment URL (e.g., `https://angular-checklist.vercel.app`)
4. Add `NEXTAUTH_SECRET` - generate a strong random secret:
   ```bash
   openssl rand -base64 32
   ```

#### 3. Configure Build Settings

Vercel should automatically detect these settings, but verify:

- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

#### 4. Deploy

1. Click "Deploy"
2. Vercel will build and deploy your application
3. Once complete, you'll get a deployment URL

#### 5. Post-Deployment

After your first deployment:

1. Update `NEXTAUTH_URL` to match your actual Vercel URL if needed
2. Run database migrations:
   - You can run `npm run prisma:push` locally to push the schema to Neon
   - Or add a build step in Vercel (not recommended for production)

#### 6. Set Up Your Database

Before using the app, ensure your Neon database has the correct schema:

```bash
# Locally, with your Neon connection string
npm run prisma:push

# Or run migrations
npm run prisma:migrate
```

### Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Neon PostgreSQL connection string (pooled) | `postgresql://...` |
| `NEXTAUTH_URL` | Your production URL | `https://your-app.vercel.app` |
| `NEXTAUTH_SECRET` | Secret for JWT encryption (min 32 chars) | Generated with `openssl rand -base64 32` |

### Vercel-Specific Considerations

1. **Edge Runtime**: The app uses Node.js runtime (not Edge) due to bcrypt
2. **Serverless Functions**: All API routes and pages are serverless by default
3. **Database Connection**: Using Neon's pooled connection is recommended for Vercel
4. **Environment Variables**: Set separately for Production, Preview, and Development

### Testing Your Deployment

1. Visit your Vercel URL
2. Sign up for a new account
3. Create a checklist
4. Add items and test functionality

### Troubleshooting

#### Build Fails

- Check that all environment variables are set
- Verify your `DATABASE_URL` is correct
- Check build logs for specific errors

#### Can't Connect to Database

- Ensure `DATABASE_URL` uses the pooled connection (with `-pooler` in the hostname)
- Verify SSL mode is enabled (`sslmode=require`)
- Check that your Neon database is active

#### Authentication Issues

- Verify `NEXTAUTH_SECRET` is set and at least 32 characters
- Check that `NEXTAUTH_URL` matches your deployment URL
- Clear cookies and try again

### Custom Domain (Optional)

To use a custom domain:

1. Go to your Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update `NEXTAUTH_URL` to match your custom domain

### Continuous Deployment

Vercel automatically:
- Deploys on every push to your main branch
- Creates preview deployments for pull requests
- Provides deployment logs and analytics

### Security Checklist

Before going to production:

- [ ] Change `NEXTAUTH_SECRET` to a strong random value
- [ ] Use environment variables (never commit secrets)
- [ ] Enable HTTPS (automatic with Vercel)
- [ ] Review database access rules
- [ ] Test authentication flow
- [ ] Verify user authorization works correctly

---

© 2024 - Angular Checklist App
