# 🎨 CodeniWork - Job Application Tracker

A beautiful, modern job application tracker built with Next.js 15.5, featuring a colorful Clean My Mac-inspired interface with a comprehensive sidebar navigation system. **Powered by CodeniWork** - your trusted partner in career development.

[![Preview](https://api.microlink.io/?url=https://codeniwork.vercel.app&screenshot=true&meta=false&embed=screenshot.url&delay=3000)](https://codeniwork.vercel.app)

## ✨ Features

### 🎯 **Core Functionality**
- **Job Application Management** - Track applications, companies, and interview progress
- **Beautiful Dashboard** - Colorful statistics cards with real-time data
- **Smart Organization** - Categorize by status, priority, and company
- **Search & Filter** - Find applications quickly with advanced search
- **Notes & Tracking** - Add detailed notes and follow-up reminders

### 🎨 **Design Features**
- **Colorful Background** - Beautiful gradient backgrounds with floating orbs and animated elements
- **Glass Morphism** - Modern translucent cards with backdrop blur effects
- **Responsive Sidebar** - Collapsible navigation with smooth animations
- **Clean My Mac Inspired** - Colorful, playful interface with smooth transitions
- **Dark Mode Ready** - Optimized for both light and dark themes

### 🚀 **Technical Features**
- **Next.js 15.5** - Latest React framework with App Router
- **TypeScript** - Full type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework with custom color palette
- **shadcn/ui** - Beautiful, accessible UI components
- **Drizzle ORM** - Type-safe database operations
- **NextAuth.js** - Secure authentication with OAuth providers
- **NeonDB** - Serverless PostgreSQL database

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.5, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: NeonDB (PostgreSQL) with Drizzle ORM
- **Authentication**: NextAuth.js (Google, GitHub OAuth)
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- NeonDB account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd codeniwork
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your credentials in `.env.local`:
   ```env
   DATABASE_URL=your_neon_db_connection_string
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_random_secret_key
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
   GITHUB_ID=your_github_oauth_app_id
   GITHUB_SECRET=your_github_oauth_app_secret
   ```

4. **Set up the database**
   ```bash
   pnpm db:generate
   pnpm db:push
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Customization

### Colors & Themes
The application uses a custom color palette inspired by Clean My Mac:

```css
/* Custom colors defined in tailwind.config.js */
success: { 50: '#f0fdf4', 500: '#22c55e', 600: '#16a34a' }
warning: { 50: '#fffbeb', 500: '#f59e0b', 600: '#d97706' }
info: { 50: '#eff6ff', 500: '#3b82f6', 600: '#2563eb' }
purple: { 50: '#faf5ff', 500: '#a855f7', 600: '#9333ea' }
orange: { 50: '#fff7ed', 500: '#f97316', 600: '#ea580c' }
teal: { 50: '#f0fdfa', 500: '#14b8a6', 600: '#0d9488' }
```

### Sidebar Navigation
The sidebar includes these navigation items:
- **Dashboard** - Overview and statistics
- **Applications** - Job applications list
- **Companies** - Company management
- **Calendar** - Interview scheduling
- **Analytics** - Progress tracking
- **Documents** - Resume and cover letter storage
- **Contacts** - Network management
- **Quick Actions** - Common tasks

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop** - Full sidebar with expanded navigation
- **Tablet** - Collapsible sidebar with touch-friendly interface
- **Mobile** - Mobile-optimized layout with bottom navigation

## 🔐 Authentication

### OAuth Providers
- **Google** - Sign in with Google account
- **GitHub** - Sign in with GitHub account

### User Management
- Automatic user creation on first sign-in
- Session management with JWT tokens
- Secure password handling

## 🗄️ Database Schema

The application uses a well-structured database schema:

```sql
-- Users table for authentication
users (id, email, name, image, created_at)

-- Companies table for organization tracking
companies (id, name, website, industry, created_at)

-- Job applications with full tracking
job_applications (id, user_id, company_id, position, status, priority, ...)

-- Application events for timeline tracking
application_events (id, application_id, event_type, description, date)
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🧪 Development

### Available Scripts
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm db:generate  # Generate database migrations
pnpm db:push      # Push schema to database
pnpm db:studio    # Open Drizzle Studio
```

### Code Structure
```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── globals.css        # Global styles
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── dashboard/         # Dashboard components
│   └── providers/         # Context providers
├── lib/                   # Utility functions
│   ├── db/                # Database configuration
│   ├── auth.ts            # Authentication config
│   └── utils.ts           # Helper functions
└── hooks/                 # Custom React hooks
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Clean My Mac** - Design inspiration for the colorful interface
- **shadcn/ui** - Beautiful UI component library
- **Next.js Team** - Amazing React framework
- **Drizzle Team** - Type-safe database ORM

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page for existing solutions
2. Create a new issue with detailed information
3. Join our community discussions

---

**Built with ❤️ by [CodeniWork](https://tioye.dev) using Next.js 15.5 and modern web technologies**
