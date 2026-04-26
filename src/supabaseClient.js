import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tfwlgnoouyegfonznjar.supabase.co'
const supabaseKey = 'sb_publishable_ZUhEof_UqsebnVIvXtoaZg_WOj9BU-q' // apni full key yahan

export const supabase = createClient(supabaseUrl, supabaseKey)