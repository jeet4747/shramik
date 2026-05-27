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
  }),
  storage: {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    }),
  },
}

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : dummyClient

export const isSupabaseReady = isConfigured
