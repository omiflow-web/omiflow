import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL) throw new Error('SUPABASE_URL is not set')
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
)

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
