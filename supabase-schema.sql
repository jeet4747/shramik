-- ============================================================
-- Shramik — Complete Supabase Database Schema (MVP version)
-- No auth dependency. Uses auto-generated UUIDs.
-- RLS disabled for MVP — will be added when auth is implemented.
-- ============================================================

-- 0. EXTENSIONS
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- 1. USERS TABLE (no FK to auth.users — self-contained)
create table if not exists public.users (
  id            uuid primary key default gen_random_uuid(),
  phone         text unique not null,
  email         text,
  full_name     text not null,
  role          text check (role in ('worker', 'contractor', 'admin')) default 'worker',
  skill         text,
  city          text,
  avatar_url    text,
  available     boolean default true,
  verified      boolean default false,
  rating        numeric(3,2) default 0,
  jobs_completed integer default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- 2. JOBS TABLE
create table if not exists public.jobs (
  id                uuid primary key default gen_random_uuid(),
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

-- 3. JOB APPLICATIONS TABLE
create table if not exists public.job_applications (
  id          uuid primary key default gen_random_uuid(),
  job_id      uuid references public.jobs(id) on delete cascade not null,
  worker_id   uuid references public.users(id) on delete cascade not null,
  status      text default 'applied' check (status in ('applied', 'hired', 'rejected', 'cancelled')),
  created_at  timestamptz default now(),
  unique(job_id, worker_id)
);

-- 4. VERIFICATIONS TABLE
create table if not exists public.verifications (
  id          uuid primary key default gen_random_uuid(),
  worker_id   uuid references public.users(id) on delete cascade not null,
  id_type     text default 'aadhaar',
  id_number   text,
  status      text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references public.users(id) on delete set null,
  notes       text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- 5. EARNINGS / PAYMENTS TABLE
create table if not exists public.earnings (
  id            uuid primary key default gen_random_uuid(),
  worker_id     uuid references public.users(id) on delete cascade not null,
  job_id        uuid references public.jobs(id) on delete set null,
  contractor_id uuid references public.users(id) on delete set null,
  amount        integer not null check (amount > 0),
  status        text default 'pending' check (status in ('pending', 'paid', 'failed')),
  paid_at       timestamptz,
  created_at    timestamptz default now()
);

-- 6. RATINGS TABLE
create table if not exists public.ratings (
  id            uuid primary key default gen_random_uuid(),
  job_id        uuid references public.jobs(id) on delete cascade,
  from_id       uuid references public.users(id) on delete cascade not null,
  to_id         uuid references public.users(id) on delete cascade not null,
  rating        integer not null check (rating >= 1 and rating <= 5),
  review        text,
  created_at    timestamptz default now()
);

-- 7. NOTIFICATIONS TABLE
create table if not exists public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.users(id) on delete cascade not null,
  title       text not null,
  body        text,
  type        text default 'info',
  read        boolean default false,
  data        jsonb,
  created_at  timestamptz default now()
);

-- ============================================================
-- RLS — DISABLED FOR MVP
-- Run this when ready for production:
--   alter table public.users enable row level security;
--   alter table public.jobs enable row level security;
--   ... etc + create policies
-- ============================================================
alter table public.users disable row level security;
alter table public.jobs disable row level security;
alter table public.job_applications disable row level security;
alter table public.verifications disable row level security;
alter table public.earnings disable row level security;
alter table public.ratings disable row level security;
alter table public.notifications disable row level security;

-- ============================================================
-- TRIGGERS
-- ============================================================

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
-- DEMO JOB (run this separately after your first contractor signs up)
-- ============================================================
-- Replace 'REPLACE_WITH_CONTRACTOR_UUID' with an actual contractor user ID:
-- insert into public.jobs (contractor_id, title, trade_needed, location, pay_per_day)
-- values ('REPLACE_WITH_CONTRACTOR_UUID', 'Electrical Wiring — Residential Project', 'Electrician', 'Nashik MIDC', 800);
