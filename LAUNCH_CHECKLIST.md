# Shramik — Launch Execution Checklist

Follow these steps IN ORDER. Total time: ~60-90 minutes.
After Step 6 your app is LIVE and you can start onboarding workers in Pune.

---

## STEP 1: Create Supabase Project (10 min)

1. Go to https://supabase.com → Sign up / Log in
2. Click **New Project**
   - Name: `shramik-prod`
   - Database Password: set something strong (SAVE IT)
   - Region: `Mumbai (ap-south-1)` ← closest to Pune users
3. Wait ~2 min for provisioning

---

## STEP 2: Run SQL Migrations (10 min)

In Supabase Dashboard → **SQL Editor** → New query.
Copy-paste each file's FULL contents and click **Run**, one at a time, in this exact order:

| Order | File | What it does |
|-------|------|--------------|
| 1 | `supabase-schema.sql` | Creates tables (users, jobs, applications...) |
| 2 | `supabase-migration.sql` | Adds verification docs, team invites, WhatsApp groups tables |
| 3 | `supabase-auth-migration.sql` | Connects Auth → users table, sets strict RLS, admin RPC |
| 4 | `supabase-kyc-migration.sql` | Adds Aadhaar/PAN columns, seeds Pune WhatsApp group |

✅ Verify: Table Editor should show 9 tables with no errors.

---

## STEP 3: Create Storage Buckets (5 min)

Supabase Dashboard → **Storage** → New bucket. Create THREE public buckets:

- `avatars`
- `verifications`
- `proofs`

For each bucket: toggle **Public bucket** ON.

---

## STEP 4: Set Admin Code (2 min)

SQL Editor → Run:

```sql
SELECT set_config('app.settings.admin_code', 'YOUR-SECRET-CODE-HERE', false);
```

⚠️ Replace `YOUR-SECRET-CODE-HERE` with a code only you know. You will type
this inside the app to unlock the Admin dashboard. SAVE IT.

Note: this resets if the Supabase service restarts. To make it permanent,
Dashboard → Project Settings → API → (or ask assistant for the config approach).

---

## STEP 5: Configure Vercel Env Vars (5 min)

Vercel Dashboard → your `shramik` project → Settings → Environment Variables.
Add ALL of these:

| Name | Value | Notes |
|------|-------|-------|
| `VITE_SUPABASE_URL` | `https://xxxx.supabase.co` | From Supabase → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGci...` (long key) | Same page, `anon public` key |
| `VITE_USE_DUMMY_OTP` | `true` | Keeps launch free — OTP is always `123456` |

Then: Deployments tab → latest deployment → ⋯ menu → **Redeploy**.

⚠️ Keep `VITE_USE_DUMMY_OTP=true` until Twilio is upgraded to a paid account.
This matches your assisted-onboarding model: workers come to YOU, you open their
account on your phone using OTP `123456`. Zero SMS cost.

---

## STEP 6: Verify Production (10 min)

Open your Vercel URL (e.g. `https://shramik-xxx.vercel.app`) on your phone:

- [ ] Landing page loads, no red banner, dark/light toggle works
- [ ] मराठी toggle shows everything in Marathi
- [ ] Register: fill name + phone + Aadhaar (12 digits) + PAN (ABCDE1234F) + city Pune + chowk + skill
- [ ] OTP screen: enter `123456` → lands on dashboard
- [ ] Worker dashboard: jobs visible, availability toggle works
- [ ] Register again as Thekedar → team screen loads
- [ ] Login flow: same phone + `123456` → back in
- [ ] If anything fails: check browser console + Vercel function logs

---

## STEP 7: Start the Business — Week 1 Plan (Pune)

### Your daily routine (this week):

**Morning 7–10 AM — Worker acquisition:**
- Go where construction workers gather: Hadapsar, Kharadi, Wagholi, Chakan MIDC gate areas
- Show the app on YOUR phone → register them on the spot (Aadhaar+PAN in hand, OTP 123456)
- Target: 15 registrations/day
- Say: *"मोफत रजिस्टर. Job alert सगळ्यात आधी तुमच्या फोनवर."*

**Afternoon 12–5 PM — Contractor/thekedar acquisition:**
- Visit 2 small builders/thekedars daily (Hadapsar–Kharadi belt has hundreds of sites)
- Pitch: *"Sir, ek click mein pure team ko job notification. Free hai."*
- Help them post their FIRST job on your phone before leaving
- Ask them to forward the app link to their worker WhatsApp groups

**Evening — Post 3-5 demo jobs yourself** so the app never looks empty:
- Admin login → Platform Stats → seed demo job (or Post Job as contractor)

### Week 1 targets:
| Metric | Target |
|--------|--------|
| Workers registered | 50 |
| Contractors/thekedars registered | 5 |
| Live jobs | 8+ |
| Applications submitted | 10+ |

---

## STEP 8: When Ready for Real SMS (later, optional)

1. Upgrade Twilio account (paid) OR use MSG91 (~₹0.15/SMS, cheaper for India)
2. Supabase Dashboard → Authentication → Providers → Phone → update credentials
3. Remove `VITE_USE_DUMMY_OTP` from Vercel → Redeploy
4. Now workers self-register from anywhere via real OTP

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Red banner still showing | Env var typo in Vercel — names must match EXACTLY, then Redeploy |
| "Invalid OTP" | Dummy OTP is exactly `123456` |
| Registration stuck after OTP | Check Supabase → Authentication → Users; check trigger ran (SQL Editor: `SELECT * FROM public.users;`) |
| Jobs list empty | Post demo jobs from Admin panel |
| Admin code rejected | Re-run the `set_config` command from Step 4 |
