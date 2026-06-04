-- Run this entire file in Supabase SQL Editor
-- Columns already added: chowk ✅, thekedar_id ✅

-- Add missing columns for production readiness
alter table public.users
  add column if not exists available boolean default true,
  add column if not exists rating numeric(2,1) default 0;

-- Ensure all new users get is_verified = false by default
alter table public.users
  alter column is_verified set default false;

-- Update role check to include all roles
alter table public.users
  drop constraint if exists users_role_check;

alter table public.users
  add constraint users_role_check
  check (role in ('worker', 'contractor', 'thekedar', 'admin'));
