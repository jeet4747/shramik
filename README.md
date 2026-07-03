# Shramik — PWA for Blue-Collar Workers & Contractors

Connects workers (electricians, plumbers, masons, etc.) with contractors in Nashik, Maharashtra. Built with React + Vite + Supabase + Tailwind v4.

## Tech Stack

- **Frontend**: React 19, Vite 6, Tailwind CSS v4, Lucide icons
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **PWA**: vite-plugin-pwa with service worker for offline asset caching
- **i18n**: Custom context-based EN/MR (English + Marathi) translation
- **Deploy**: Vercel SPA with rewrites

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project (free tier works)

### Setup

```bash
git clone <repo>
cd shramik
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local`:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Database Setup

**Migration order (run in this exact sequence in Supabase SQL editor):**

1. **`supabase-schema.sql`** — Creates base tables (users, jobs, job_applications, earnings, verifications, notifications, ratings).

2. **`supabase-migration.sql`** — Adds columns (`is_verified`, `thekedar`, team support), creates `team_invites`, `verification_documents`, `whatsapp_groups` tables, seeds initial WhatsApp groups, creates RLS policies for MVP.

3. **`supabase-auth-migration.sql`** — Enables phone auth integration:
   - Creates `handle_new_user()` trigger (auto-creates `public.users` row when auth user signs up)
   - Creates `verify_admin_code()` RPC (server-side admin code check)
   - Replaces MVP RLS with strict `auth.uid()`-based policies

**After migration, set the admin code:**

```sql
SELECT set_config('app.settings.admin_code', 'your-secure-code', false);
```

**Enable Phone Auth** in Supabase dashboard: Authentication → Settings → Phone Auth → Enable. Disable email confirmations. Keep SMS provider on (Twilio or default).

**Note:** Column `verified` in base schema was renamed to `is_verified` in migration. The code uses `is_verified` everywhere.

### Run Locally

```bash
npm run dev
```

### Build

```bash
npm run build
npm run preview
```

### Lint

```bash
npm run lint
```

## Architecture

### Auth Flow

1. User enters phone → `supabase.auth.signUp()` sends OTP via SMS
2. User enters OTP → `supabase.auth.verifyOtp()` creates/restores session
3. Auth trigger `handle_new_user()` inserts user profile into `public.users`
4. On login, `signInWithOtp({ shouldCreateUser: false })` sends OTP for existing users only
5. Session persisted via `supabase.auth.onAuthStateChange()` + localStorage fallback

### Admin Access

Admin code is stored in Supabase database config (`app.settings.admin_code`), verified server-side via the SECURITY DEFINER RPC `verify_admin_code(input_code TEXT)`. The admin code is never exposed to the client bundle.

### RLS

Row-Level Security restricts all tables to `auth.uid()`:
- Users: read own row, insert during signup, update own row
- Jobs: read all, insert/update/delete by contractor owner
- Job applications: read own, insert by worker, update by contractor

### Roles

| Role | Description |
|------|-------------|
| Worker | Browses jobs, applies, tracks earnings |
| Contractor | Posts jobs, hires workers, manages listings |
| Thekedar | Manages a team of workers |
| Admin | Platform oversight, user verification |

## Deployment

Deploy to Vercel:

```bash
npm run build
vercel --prod
```

Set the two environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in Vercel dashboard.

The app uses client-side routing with SPA rewrites configured in `vercel.json`.

## Skills Available

Electrician, Plumber, Carpenter, Painter, Mason, Welder, Driver, Helper, Other

## License

MSME Registered — Nashik, Maharashtra
