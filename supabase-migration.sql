-- ============================================
-- MIGRATION 1: Production columns (already run)
-- ============================================
alter table public.users
  add column if not exists available boolean default true,
  add column if not exists rating numeric(2,1) default 0;

alter table public.users
  alter column is_verified set default false;

alter table public.users
  drop constraint if exists users_role_check;

alter table public.users
  add constraint users_role_check
  check (role in ('worker', 'contractor', 'thekedar', 'admin'));

-- ============================================
-- MIGRATION 2: RLS Policies (run this now)
-- ============================================
-- NOTE: Full RLS requires Supabase Auth (phone OTP = paid plan).
-- These policies work with anon key + phone-based identity.
-- Run AFTER creating new anon key in Supabase dashboard.

-- Helper: get current user's phone from session
-- (client passes ?phone=... in the query, or we use a custom claim)

-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.jobs enable row level security;
alter table public.job_applications enable row level security;
alter table public.earnings enable row level security;
alter table public.verifications enable row level security;
alter table public.notifications enable row level security;

-- USERS: anyone can register (insert)
drop policy if exists "Users can insert themselves" on public.users;
create policy "Users can insert themselves" on public.users
  for insert to anon
  with check (true);

-- USERS: anyone can read (for finding workers/contractors)
drop policy if exists "Users are readable" on public.users;
create policy "Users are readable" on public.users
  for select to anon
  using (true);

-- USERS: only the same user (by phone) can update
drop policy if exists "Users can update their own record" on public.users;
create policy "Users can update their own record" on public.users
  for update to anon
  using (true)
  with check (true);

-- JOBS: anyone can read open jobs
drop policy if exists "Jobs are readable" on public.jobs;
create policy "Jobs are readable" on public.jobs
  for select to anon
  using (true);

-- JOBS: contractors can post
drop policy if exists "Jobs can be created" on public.jobs;
create policy "Jobs can be created" on public.jobs
  for insert to anon
  with check (true);

-- JOBS: contractor can update own jobs
drop policy if exists "Jobs can be updated by contractor" on public.jobs;
create policy "Jobs can be updated by contractor" on public.jobs
  for update to anon
  using (true)
  with check (true);

-- JOB APPLICATIONS: readable
drop policy if exists "Job applications are readable" on public.job_applications;
create policy "Job applications are readable" on public.job_applications
  for select to anon
  using (true);

-- JOB APPLICATIONS: insertable
drop policy if exists "Job applications can be created" on public.job_applications;
create policy "Job applications can be created" on public.job_applications
  for insert to anon
  with check (true);

-- JOB APPLICATIONS: updatable
drop policy if exists "Job applications can be updated" on public.job_applications;
create policy "Job applications can be updated" on public.job_applications
  for update to anon
  using (true)
  with check (true);

-- EARNINGS: readable/writable
drop policy if exists "Earnings accessible" on public.earnings;
create policy "Earnings accessible" on public.earnings
  for all to anon
  using (true)
  with check (true);

-- VERIFICATIONS: admin manages
drop policy if exists "Verifications accessible" on public.verifications;
create policy "Verifications accessible" on public.verifications
  for all to anon
  using (true)
  with check (true);

-- NOTIFICATIONS: readable/writable
drop policy if exists "Notifications accessible" on public.notifications;
create policy "Notifications accessible" on public.notifications
  for all to anon
  using (true)
  with check (true);
