-- ============================================================
-- Shramik — Complete Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 0. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 1. USERS TABLE (extends Supabase auth.users)
create table if not exists public.users (
  id            uuid primary key references auth.users(id) on delete cascade,
  phone         text unique,
  email         text,
  full_name     text,
  role          text check (role in ('worker', 'contractor', 'admin')) default 'worker',
  skill         text,
  city          text,
  avatar_url    text,
  available     boolean default true,
  rating        numeric(3,2) default 0,
  jobs_completed integer default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

alter table public.users enable row level security;

-- 2. JOBS TABLE
create table if not exists public.jobs (
  id                uuid primary key default uuid_generate_v4(),
  contractor_id     uuid references public.users(id) on delete cascade not null,
  title             text not null,
  trade_needed      text not null,
  location          text not null,
  pay_per_day       integer not null check (pay_per_day > 0),
  status            text default 'open' check (status in ('open', 'assigned', 'filled', 'cancelled')),
  assigned_worker_id uuid references public.users(id) on delete set null,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

alter table public.jobs enable row level security;

-- 3. JOB APPLICATIONS TABLE
create table if not exists public.job_applications (
  id          uuid primary key default uuid_generate_v4(),
  job_id      uuid references public.jobs(id) on delete cascade not null,
  worker_id   uuid references public.users(id) on delete cascade not null,
  status      text default 'applied' check (status in ('applied', 'hired', 'rejected', 'cancelled')),
  created_at  timestamptz default now(),
  unique(job_id, worker_id)
);

alter table public.job_applications enable row level security;

-- 4. VERIFICATIONS TABLE
create table if not exists public.verifications (
  id          uuid primary key default uuid_generate_v4(),
  worker_id   uuid references public.users(id) on delete cascade not null,
  id_type     text default 'aadhaar',
  id_number   text,
  status      text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references public.users(id) on delete set null,
  notes       text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table public.verifications enable row level security;

-- 5. EARNINGS / PAYMENTS TABLE
create table if not exists public.earnings (
  id            uuid primary key default uuid_generate_v4(),
  worker_id     uuid references public.users(id) on delete cascade not null,
  job_id        uuid references public.jobs(id) on delete set null,
  contractor_id uuid references public.users(id) on delete set null,
  amount        integer not null check (amount > 0),
  status        text default 'pending' check (status in ('pending', 'paid', 'failed')),
  paid_at       timestamptz,
  created_at    timestamptz default now()
);

alter table public.earnings enable row level security;

-- 6. RATINGS TABLE
create table if not exists public.ratings (
  id            uuid primary key default uuid_generate_v4(),
  job_id        uuid references public.jobs(id) on delete cascade,
  from_id       uuid references public.users(id) on delete cascade not null,
  to_id         uuid references public.users(id) on delete cascade not null,
  rating        integer not null check (rating >= 1 and rating <= 5),
  review        text,
  created_at    timestamptz default now()
);

alter table public.ratings enable row level security;

-- 7. NOTIFICATIONS TABLE
create table if not exists public.notifications (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references public.users(id) on delete cascade not null,
  title       text not null,
  body        text,
  type        text default 'info',
  read        boolean default false,
  data        jsonb,
  created_at  timestamptz default now()
);

alter table public.notifications enable row level security;

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- USERS POLICIES
create policy "users_read_own" on public.users
  for select using (auth.uid() = id);

create policy "users_read_all_workers" on public.users
  for select using (role = 'worker');

create policy "users_insert_own" on public.users
  for insert with check (auth.uid() = id);

create policy "users_update_own" on public.users
  for update using (auth.uid() = id);

-- JOBS POLICIES
create policy "jobs_read_all_open" on public.jobs
  for select using (status = 'open' or contractor_id = auth.uid() or assigned_worker_id = auth.uid());

create policy "jobs_insert_contractor" on public.jobs
  for insert with check (
    auth.uid() = contractor_id 
    and exists (select 1 from public.users where id = auth.uid() and role = 'contractor')
  );

create policy "jobs_update_owner" on public.jobs
  for update using (
    contractor_id = auth.uid() 
    or assigned_worker_id = auth.uid()
  );

-- JOB APPLICATIONS POLICIES
create policy "applications_read_own" on public.job_applications
  for select using (
    worker_id = auth.uid() 
    or job_id in (select id from public.jobs where contractor_id = auth.uid())
  );

create policy "applications_insert_worker" on public.job_applications
  for insert with check (
    auth.uid() = worker_id 
    and exists (select 1 from public.users where id = auth.uid() and role = 'worker')
  );

create policy "applications_update_contractor" on public.job_applications
  for update using (
    job_id in (select id from public.jobs where contractor_id = auth.uid())
  );

-- VERIFICATIONS POLICIES
create policy "verifications_read_admin" on public.verifications
  for select using (
    auth.uid() = worker_id 
    or exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

create policy "verifications_insert_worker" on public.verifications
  for insert with check (auth.uid() = worker_id);

create policy "verifications_update_admin" on public.verifications
  for update using (
    exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- EARNINGS POLICIES
create policy "earnings_read_own" on public.earnings
  for select using (
    worker_id = auth.uid() 
    or contractor_id = auth.uid()
    or exists (select 1 from public.users where id = auth.uid() and role = 'admin')
  );

-- RATINGS POLICIES
create policy "ratings_read_all" on public.ratings
  for select using (true);

create policy "ratings_insert_contractor" on public.ratings
  for insert with check (auth.uid() = from_id);

-- NOTIFICATIONS POLICIES
create policy "notifications_read_own" on public.notifications
  for select using (user_id = auth.uid());

-- ============================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================

-- Auto-create public.users record on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, phone, email, full_name)
  values (
    new.id,
    new.phone,
    new.email,
    new.raw_user_meta_data->>'full_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger users_updated_at before update on public.users
  for each row execute function public.update_updated_at();

create trigger jobs_updated_at before update on public.jobs
  for each row execute function public.update_updated_at();

-- ============================================================
-- STORAGE BUCKET SETUP (run separately in Supabase dashboard)
-- ============================================================
-- 1. Create bucket: 'avatars' (public)
-- 2. Policy: Allow authenticated users to upload to avatars/ folder
-- 3. Policy: Allow public read access to avatars/
