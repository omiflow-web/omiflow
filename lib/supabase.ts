import { createClient } from '@supabase/supabase-js'

// Lazy client — does not throw at module load time
// Routes check env vars themselves and give readable errors
function getClient() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error(`Supabase env vars missing — SUPABASE_URL: ${!!url}, SUPABASE_SERVICE_ROLE_KEY: ${!!key}`)
  }
  return createClient(url, key, { auth: { persistSession: false } })
}

export const supabase = {
  from: (table: string) => getClient().from(table)
}

export interface LeadRow {
  id: string
  slug: string
  business_name: string
  email: string
  campaign: string
  niche: string
  demo_html: string
  emails: Array<{ day: number; subject: string; body: string }>
  created_at: string
}
