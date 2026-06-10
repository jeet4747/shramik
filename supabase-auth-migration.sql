-- ============================================================
-- Shramik — Auth Migration (run AFTER supabase-migration.sql)
-- Integrates Supabase Auth with public.users
-- ============================================================

-- 1. Add auth.uid() references and ensure id matches auth.users
-- (public.users.id will now be the auth.uid() UUID)

-- 2. Trigger: auto-create public.users row when a new auth user signs up
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
  insert into public.users (id, phone, full_name, role, skill, city, chowk, is_verified)
  values (
    new.id,
    user_phone,
    coalesce(meta ->> 'full_name', 'User'),
    coalesce(meta ->> 'role', 'worker'),
    meta ->> 'skill',
    meta ->> 'city',
    meta ->> 'chowk',
    false
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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. Admin code verification RPC (secure, no client-side secret)
create or replace function public.verify_admin_code(code text)
returns boolean
language plpgsql
security definer
as $$
begin
  return code = current_setting('app.settings.admin_code', true);
exception when others then
  return false;
end;
$$;

-- 4. Update RLS policies — strict auth-based access
alter table public.users enable row level security;
alter table public.jobs enable row level security;
alter table public.job_applications enable row level security;
alter table public.earnings enable row level security;
alter table public.verifications enable row level security;
alter table public.notifications enable row level security;
alter table public.team_invites enable row level security;
alter table public.verification_documents enable row level security;
alter table public.whatsapp_groups enable row level security;

-- USERS: everyone can insert (signup), read own + workers/contractors for listing
drop policy if exists "Users signup" on public.users;
create policy "Users signup" on public.users
  for insert to anon, authenticated
  with check (true);

drop policy if exists "Users readable" on public.users;
create policy "Users readable" on public.users
  for select to anon, authenticated
  using (true);

drop policy if exists "Users update own" on public.users;
create policy "Users update own" on public.users
  for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- JOBS: readable by all, insert/update by authenticated
drop policy if exists "Jobs readable" on public.jobs;
create policy "Jobs readable" on public.jobs
  for select to anon, authenticated
  using (true);

drop policy if exists "Jobs insert" on public.jobs;
create policy "Jobs insert" on public.jobs
  for insert to authenticated
  with check (auth.uid() = contractor_id);

drop policy if exists "Jobs update" on public.jobs;
create policy "Jobs update" on public.jobs
  for update to authenticated
  using (auth.uid() = contractor_id)
  with check (auth.uid() = contractor_id);

-- JOB APPLICATIONS: read own, insert own
drop policy if exists "Job apps readable" on public.job_applications;
create policy "Job apps readable" on public.job_applications
  for select to authenticated
  using (auth.uid() = worker_id);

drop policy if exists "Job apps insert" on public.job_applications;
create policy "Job apps insert" on public.job_applications
  for insert to authenticated
  with check (auth.uid() = worker_id);

drop policy if exists "Job apps update own" on public.job_applications;
create policy "Job apps update own" on public.job_applications
  for update to authenticated
  using (auth.uid() = worker_id);

-- EARNINGS: read own
drop policy if exists "Earnings readable" on public.earnings;
create policy "Earnings readable" on public.earnings
  for select to authenticated
  using (auth.uid() = worker_id);

-- TEAM INVITES: thekedar can manage, worker can see own
drop policy if exists "Team invites readable" on public.team_invites;
create policy "Team invites readable" on public.team_invites
  for select to authenticated
  using (auth.uid() = thekedar_id or auth.uid() = worker_id);

drop policy if exists "Team invites insert" on public.team_invites;
create policy "Team invites insert" on public.team_invites
  for insert to authenticated
  with check (auth.uid() = thekedar_id);

drop policy if exists "Team invites update" on public.team_invites;
create policy "Team invites update" on public.team_invites
  for update to authenticated
  using (auth.uid() = thekedar_id or auth.uid() = worker_id);

-- VERIFICATION DOCUMENTS: admin only (assumes admin role check in app)
drop policy if exists "Verification docs accessible" on public.verification_documents;
create policy "Verification docs accessible" on public.verification_documents
  for all to authenticated
  using (true)
  with check (true);

-- WHATSAPP GROUPS: readable by all
drop policy if exists "WhatsApp groups readable" on public.whatsapp_groups;
create policy "WhatsApp groups readable" on public.whatsapp_groups
  for select to anon, authenticated
  using (true);

-- NOTIFICATIONS: own notifications
drop policy if exists "Notifications readable" on public.notifications;
create policy "Notifications readable" on public.notifications
  for select to authenticated
  using (auth.uid() = user_id);

-- VERIFICATIONS table (legacy, kept for backwards compat)
drop policy if exists "Verifications accessible" on public.verifications;
create policy "Verifications accessible" on public.verifications
  for all to authenticated
  using (true)
  with check (true);
