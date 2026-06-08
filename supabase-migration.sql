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
-- MIGRATION 2: New tables for features
-- ============================================

-- Job completion proofs
alter table public.jobs add column if not exists completed_at timestamptz;
alter table public.jobs add column if not exists completion_notes text;
alter table public.jobs add column if not exists completion_photo_url text;

-- Team invites (thekedar → worker confirmation)
create table if not exists public.team_invites (
  id uuid default gen_random_uuid() primary key,
  thekedar_id uuid references public.users(id) on delete cascade,
  worker_id uuid references public.users(id) on delete cascade,
  status text default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(worker_id, thekedar_id)
);

-- Verification documents (admin upload)
create table if not exists public.verification_documents (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade unique,
  aadhaar_url text,
  pan_url text,
  selfie_url text,
  chowk_photo_url text,
  status text default 'pending' check (status in ('pending', 'submitted', 'approved', 'rejected')),
  submitted_at timestamptz,
  updated_at timestamptz default now()
);

-- WhatsApp group links per city
create table if not exists public.whatsapp_groups (
  id uuid default gen_random_uuid() primary key,
  city text not null,
  group_name text,
  invite_link text not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ============================================
-- MIGRATION 3: Storage buckets
-- ============================================
-- Run in Supabase SQL Editor:
-- CREATE POLICY "Public access" ON storage.objects FOR ALL TO anon USING (true) WITH CHECK (true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('verifications', 'verifications', true) ON CONFLICT DO NOTHING;
-- INSERT INTO storage.buckets (id, name, public) VALUES ('proofs', 'proofs', true) ON CONFLICT DO NOTHING;

-- ============================================
-- MIGRATION 4: Seed WhatsApp groups
-- ============================================
INSERT INTO public.whatsapp_groups (city, group_name, invite_link) VALUES
  ('Nashik', 'Shramik Nashik Jobs', 'https://chat.whatsapp.com/join-nashik'),
  ('Pune', 'Shramik Pune Jobs', 'https://chat.whatsapp.com/join-pune')
ON CONFLICT DO NOTHING;

-- ============================================
-- MIGRATION 5: RLS Policies (run this now)
-- ============================================
alter table public.users enable row level security;
alter table public.jobs enable row level security;
alter table public.job_applications enable row level security;
alter table public.earnings enable row level security;
alter table public.verifications enable row level security;
alter table public.notifications enable row level security;
alter table public.team_invites enable row level security;
alter table public.verification_documents enable row level security;
alter table public.whatsapp_groups enable row level security;

-- USERS
drop policy if exists "Users can insert themselves" on public.users;
create policy "Users can insert themselves" on public.users
  for insert to anon with check (true);

drop policy if exists "Users are readable" on public.users;
create policy "Users are readable" on public.users
  for select to anon using (true);

drop policy if exists "Users can update their own record" on public.users;
create policy "Users can update their own record" on public.users
  for update to anon using (true) with check (true);

-- JOBS
drop policy if exists "Jobs are readable" on public.jobs;
create policy "Jobs are readable" on public.jobs
  for select to anon using (true);

drop policy if exists "Jobs can be created" on public.jobs;
create policy "Jobs can be created" on public.jobs
  for insert to anon with check (true);

drop policy if exists "Jobs can be updated by contractor" on public.jobs;
create policy "Jobs can be updated by contractor" on public.jobs
  for update to anon using (true) with check (true);

-- JOB APPLICATIONS
drop policy if exists "Job applications are readable" on public.job_applications;
create policy "Job applications are readable" on public.job_applications
  for select to anon using (true);

drop policy if exists "Job applications can be created" on public.job_applications;
create policy "Job applications can be created" on public.job_applications
  for insert to anon with check (true);

drop policy if exists "Job applications can be updated" on public.job_applications;
create policy "Job applications can be updated" on public.job_applications
  for update to anon using (true) with check (true);

-- EARNINGS
drop policy if exists "Earnings accessible" on public.earnings;
create policy "Earnings accessible" on public.earnings
  for all to anon using (true) with check (true);

-- VERIFICATIONS
drop policy if exists "Verifications accessible" on public.verifications;
create policy "Verifications accessible" on public.verifications
  for all to anon using (true) with check (true);

-- NOTIFICATIONS
drop policy if exists "Notifications accessible" on public.notifications;
create policy "Notifications accessible" on public.notifications
  for all to anon using (true) with check (true);

-- TEAM INVITES
drop policy if exists "Team invites accessible" on public.team_invites;
create policy "Team invites accessible" on public.team_invites
  for all to anon using (true) with check (true);

-- VERIFICATION DOCUMENTS
drop policy if exists "Verification documents accessible" on public.verification_documents;
create policy "Verification documents accessible" on public.verification_documents
  for all to anon using (true) with check (true);

-- WHATSAPP GROUPS
drop policy if exists "WhatsApp groups readable" on public.whatsapp_groups;
create policy "WhatsApp groups readable" on public.whatsapp_groups
  for select to anon using (true);
