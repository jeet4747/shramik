-- ============================================================
-- Shramik — KYC Migration (run AFTER supabase-auth-migration.sql)
-- Adds Aadhaar + PAN columns collected at registration
-- Safe to run multiple times.
-- ============================================================

alter table public.users add column if not exists aadhaar_number text;
alter table public.users add column if not exists pan_number text;

-- Re-create the signup trigger so new registrations persist KYC fields
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta jsonb := new.raw_user_meta_data;
  user_phone text := coalesce(new.phone, new.raw_user_meta_data ->> 'phone');
begin
  insert into public.users (id, phone, full_name, role, skill, city, chowk, is_verified, aadhaar_number, pan_number)
  values (
    new.id,
    user_phone,
    coalesce(meta ->> 'full_name', 'User'),
    coalesce(meta ->> 'role', 'worker'),
    meta ->> 'skill',
    meta ->> 'city',
    meta ->> 'chowk',
    false,
    nullif(trim(meta ->> 'aadhaar_number'), ''),
    nullif(trim(meta ->> 'pan_number'), '')
  )
  on conflict (id) do update set
    phone = excluded.phone,
    full_name = excluded.full_name,
    role = excluded.role,
    skill = excluded.skill,
    city = excluded.city,
    chowk = excluded.chowk;
  return new;
end;
$$;

-- Seed Pune WhatsApp group (launch city)
insert into public.whatsapp_groups (city, group_name, invite_link, is_active)
values ('Pune', 'Shramik Pune Jobs', 'https://chat.whatsapp.com/join-pune', true)
on conflict do nothing;
