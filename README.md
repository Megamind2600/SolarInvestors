# SolarInvestors Marketplace

A comprehensive two-sided marketplace connecting solar project site owners with investors through SIP-based funding.

## Features

- **Role-based Access**: Site owners, investors, and admin dashboards
- **Project Management**: Submit, track, and manage solar projects
- **Investment System**: SIP-based investments with 20-year tracking
- **Payment Integration**: Secure payments via Stripe
- **Authentication**: Secure login with Replit Auth
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Wouter
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Payments**: Stripe
- **Auth**: Replit OpenID Connect
- **Deployment**: Vercel

## Local Development

1. Clone the repository:
```bash
git clone <your-repo-url>
cd solarinvestors
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy environment variables from your Replit project
# Required variables:
# - DATABASE_URL
# - SESSION_SECRET
# - REPLIT_DOMAINS
# - REPL_ID
# - STRIPE_SECRET_KEY
# - VITE_STRIPE_PUBLIC_KEY
```

4. Push database schema:
```bash
npm run db:push
```

5. Start development server:
```bash
npm run dev
```

## Deployment to Vercel

### 1. GitHub Setup

1. Create a new repository on GitHub
2. Push your code:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/solarinvestors.git
git push -u origin main
```

### 2. Database Setup

1. Create a PostgreSQL database on Neon, Supabase, or Railway
2. Get your database connection URL

### 3. Vercel Deployment

1. Visit [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables in Vercel dashboard:

**Required Environment Variables:**
```
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_session_secret_key
REPLIT_DOMAINS=your-app.vercel.app
REPL_ID=your_repl_id
STRIPE_SECRET_KEY=sk_live_or_test_key
VITE_STRIPE_PUBLIC_KEY=pk_live_or_test_key
NODE_ENV=production
```

5. Deploy the project

### 4. Post-Deployment Setup

1. Run database migrations:
```bash
# In Vercel dashboard, go to Functions tab and run:
npx drizzle-kit push
```

2. Update REPLIT_DOMAINS with your Vercel URL
3. Configure Stripe webhook endpoints if needed

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `SESSION_SECRET` | Secret for session encryption | ✅ |
| `REPLIT_DOMAINS` | Allowed domains for auth | ✅ |
| `REPL_ID` | Replit application ID | ✅ |
| `STRIPE_SECRET_KEY` | Stripe secret key | ✅ |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe publishable key | ✅ |

## Project Structure

```
├── client/src/           # React frontend
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Utilities and configurations
├── server/              # Express backend
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API routes
│   ├── db.ts           # Database connection
│   ├── storage.ts      # Data access layer
│   └── replitAuth.ts   # Authentication setup
├── shared/              # Shared types and schemas
│   └── schema.ts        # Database schema
└── vercel.json         # Vercel configuration
```

## API Endpoints

- `GET /api/auth/user` - Get current user
- `GET/POST /api/projects` - Projects CRUD
- `GET/POST /api/investments` - Investments CRUD
- `POST /api/create-payment-intent` - Stripe payments
- `GET /api/login` - Login redirect
- `GET /api/logout` - Logout

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License