-- ============================================================
-- FIX: Database cleanup + missing columns
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Add missing KYC columns (if not exists)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS aadhaar_number text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS pan_number text;

-- 2. Enable RLS on ratings table
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- 3. Clean DUPLICATE policies (old ones conflicting with new auth-based ones)

-- Users: drop old open-access policies, keep auth-based ones
DROP POLICY IF EXISTS "Anyone can read users" ON public.users;
DROP POLICY IF EXISTS "Users are readable" ON public.users;
DROP POLICY IF EXISTS "Users can insert themselves" ON public.users;
DROP POLICY IF EXISTS "Users can update their own record" ON public.users;

-- Jobs: drop old open-access policies
DROP POLICY IF EXISTS "Anyone can read jobs" ON public.jobs;
DROP POLICY IF EXISTS "Jobs are readable" ON public.jobs;
DROP POLICY IF EXISTS "Jobs can be created" ON public.jobs;
DROP POLICY IF EXISTS "Jobs can be updated by contractor" ON public.jobs;

-- Job applications: drop old open-access policies
DROP POLICY IF EXISTS "Job applications are readable" ON public.job_applications;
DROP POLICY IF EXISTS "Job applications can be created" ON public.job_applications;
DROP POLICY IF EXISTS "Job applications can be updated" ON public.job_applications;
DROP POLICY IF EXISTS "Workers can insert applications" ON public.job_applications;
DROP POLICY IF EXISTS "Workers can read applications" ON public.job_applications;

-- Earnings: drop old open-access policy
DROP POLICY IF EXISTS "Earnings accessible" ON public.earnings;

-- Notifications: drop old open-access policy
DROP POLICY IF EXISTS "Notifications accessible" ON public.notifications;

-- Team invites: drop old open-access policy
DROP POLICY IF EXISTS "Team invites accessible" ON public.team_invites;

-- Verification documents: drop old open-access policies
DROP POLICY IF EXISTS "Verification docs accessible" ON public.verification_documents;
DROP POLICY IF EXISTS "Verification documents accessible" ON public.verification_documents;

-- Verifications: drop old open-access policy
DROP POLICY IF EXISTS "Verifications accessible" ON public.verifications;

-- 4. Add proper ratings policy
CREATE POLICY "Ratings accessible" ON public.ratings
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);
