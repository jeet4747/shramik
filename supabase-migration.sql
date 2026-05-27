-- Add chowk and thekedar_id columns to users table
-- Run this in Supabase SQL Editor

alter table public.users
  add column if not exists chowk text,
  add column if not exists thekedar_id uuid references public.users(id) on delete set null;

-- Update role check constraint to include 'thekedar'
alter table public.users
  drop constraint if exists users_role_check;

alter table public.users
  add constraint users_role_check
  check (role in ('worker', 'contractor', 'thekedar', 'admin'));
