import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isConfigured = Boolean(supabaseUrl && supabaseKey)

if (!isConfigured) {
  console.error(
    'Missing Supabase environment variables. ' +
    'Create a .env file in the project root with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  )
}

const dummyClient = {
  from: () => ({
    select: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
    insert: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
    update: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
    delete: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
    eq: () => ({ select: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }),
    single: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
    order: () => ({ select: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }),
    not: () => ({ select: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }),
    in: () => ({ select: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }),
    is: () => ({ select: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }),
    limit: () => ({ select: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }),
    gte: () => ({ select: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }) }),
  }),
  auth: {
    signUp: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
    signInWithOtp: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
    verifyOtp: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => { const unsubscribe = () => {}; return { data: { subscription: { unsubscribe } } } },
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
  },
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    }),
  },
  rpc: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
}

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
    })
  : dummyClient

export const isSupabaseReady = isConfigured
export const USE_DUMMY_OTP = import.meta.env.DEV || !isConfigured

export function formatPhone(phone) {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) return `+91${digits}`
  if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`
  if (digits.startsWith('0')) return `+91${digits.slice(1)}`
  return phone
}
