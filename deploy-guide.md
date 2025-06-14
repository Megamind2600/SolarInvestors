# Quick Deployment Guide

## Step 1: Prepare for GitHub

1. **Initialize Git repository:**
```bash
git init
git add .
git commit -m "Initial SolarInvestors marketplace"
```

2. **Create GitHub repository:**
   - Go to [github.com](https://github.com/new)
   - Create new repository named `solarinvestors`
   - Don't initialize with README (you already have one)

3. **Push to GitHub:**
```bash
git branch -M main
git remote add origin https://github.com/YOURUSERNAME/solarinvestors.git
git push -u origin main
```

## Step 2: Set Up Database

Choose one database provider:

### Option A: Neon (Recommended)
1. Go to [neon.tech](https://neon.tech)
2. Create free account
3. Create new project
4. Copy connection string

### Option B: Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy connection string

### Option C: Railway
1. Go to [railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL service
4. Copy connection string

## Step 3: Deploy to Vercel

1. **Go to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Sign up with GitHub account

2. **Import Project:**
   - Click "New Project"
   - Import your GitHub repository
   - Framework: "Other"
   - Root Directory: `.` (leave default)

3. **Configure Environment Variables:**
   Add these in Vercel dashboard:

   ```
   DATABASE_URL=your_database_connection_string
   SESSION_SECRET=your_random_secret_key_here
   REPLIT_DOMAINS=your-app-name.vercel.app
   REPL_ID=your_replit_app_id
   STRIPE_SECRET_KEY=sk_test_or_live_key
   VITE_STRIPE_PUBLIC_KEY=pk_test_or_live_key
   NODE_ENV=production
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete

## Step 4: Post-Deployment Setup

1. **Run Database Migrations:**
   - After first deployment, go to Vercel dashboard
   - Functions tab → View function logs
   - Your database tables will be created automatically

2. **Update Authentication:**
   - Update `REPLIT_DOMAINS` with your actual Vercel URL
   - Redeploy if needed

3. **Test Your App:**
   - Visit your Vercel URL
   - Test login functionality
   - Test project creation
   - Test investment flow

## Environment Variables Explained

| Variable | How to Get |
|----------|------------|
| `DATABASE_URL` | From your database provider |
| `SESSION_SECRET` | Generate random string (32+ chars) |
| `REPLIT_DOMAINS` | Your vercel domain (e.g., myapp.vercel.app) |
| `REPL_ID` | From your current Replit project |
| `STRIPE_SECRET_KEY` | From Stripe dashboard |
| `VITE_STRIPE_PUBLIC_KEY` | From Stripe dashboard |

## Troubleshooting

**Build Fails:**
- Check environment variables are set correctly
- Ensure all required variables are present

**Database Connection Error:**
- Verify DATABASE_URL is correct
- Check database provider allows external connections

**Authentication Not Working:**
- Verify REPLIT_DOMAINS matches your Vercel URL exactly
- Check REPL_ID is correct

**Stripe Integration Issues:**
- Verify both public and secret keys are set
- Check keys match (test vs live environment)

## Production Checklist

- [ ] Database is set up and accessible
- [ ] All environment variables configured
- [ ] Authentication working
- [ ] Stripe payment flow tested
- [ ] Mobile responsiveness verified
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Custom domain configured (optional)

## Need Help?

1. Check Vercel function logs for errors
2. Verify all environment variables are set
3. Test database connection
4. Confirm Stripe keys are valid

Your marketplace will be live at: `https://your-app-name.vercel.app`