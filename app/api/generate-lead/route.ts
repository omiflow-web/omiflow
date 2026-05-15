import { NextRequest, NextResponse } from 'next/server'
import { generateWithClaude } from '@/lib/claude'
import { buildWebsiteDemo } from '@/lib/demo-builders/website'
import { buildVoicemailDemo } from '@/lib/demo-builders/voicemail'
import { supabase } from '@/lib/supabase'
import type { GenerateLeadRequest, GenerateLeadResponse, GeneratedLead } from '@/lib/types'

export const maxDuration = 300

function makeSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) + '-' + Math.random().toString(36).slice(2, 6)
}

export async function POST(req: NextRequest): Promise<NextResponse<GenerateLeadResponse>> {
  try {
    const body = await req.json() as GenerateLeadRequest
    const { lead, campaign } = body

    if (!lead?.email) {
      return NextResponse.json({ success: false, error: 'Missing lead data' }, { status: 400 })
    }

    console.log('[generate-lead] Starting for:', lead.business_name, '| campaign:', campaign)

    // Step 1: Claude generates emails
    const generated = await generateWithClaude(lead, campaign)
    console.log('[generate-lead] Claude done | niche:', generated.niche, '| template:', generated.template)

    // Step 2: Build slug and demo URL — served from Vercel, not Netlify
    const slug = makeSlug(lead.business_name)
    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://omiflow-qsyr.vercel.app').replace(/\/$/, '')
    const demoUrl = `${baseUrl}/demo/${slug}`
    console.log('[generate-lead] Demo URL:', demoUrl)

    // Step 3: Inject demo URL into email bodies
    const emails = generated.emails.map(e => ({
      ...e,
      body: e.body.replace(/\[DEMO_LINK_PLACEHOLDER\]/g, demoUrl),
    }))

    // Step 4: Build demo HTML — Vapi keys from server env only (not passed from frontend)
    const vapiPublicKey = process.env.VAPI_PUBLIC_KEY || ''
    const vapiAssistantId = process.env.VAPI_ASSISTANT_ID || ''

    console.log('[generate-lead] VAPI_PUBLIC_KEY present:', vapiPublicKey.length > 0)
    console.log('[generate-lead] VAPI_ASSISTANT_ID present:', vapiAssistantId.length > 0)

    const demoHtml = campaign === 'vm'
      ? buildVoicemailDemo(lead, vapiPublicKey, vapiAssistantId)
      : buildWebsiteDemo(lead, generated.niche, generated.template)

    console.log('[generate-lead] Demo HTML length:', demoHtml.length)

    // Step 5: Save to Supabase
    const { error: dbError } = await supabase.from('leads').insert({
      slug,
      business_name: lead.business_name,
      email: lead.email,
      campaign,
      niche: generated.niche,
      demo_html: demoHtml,
      emails,
    })

    if (dbError) {
      console.error('[generate-lead] Supabase insert error:', dbError.message)
      return NextResponse.json(
        { success: false, error: `Database error: ${dbError.message}` },
        { status: 500 }
      )
    }

    console.log('[generate-lead] Saved to Supabase. Slug:', slug)

    const result: GeneratedLead = {
      lead,
      niche: generated.niche,
      template: generated.template,
      emails,
      demoHtml,
      demoUrl,
      reviewStatus: 'pending',
    }

    return NextResponse.json({ success: true, result })

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[generate-lead] Unhandled error:', message)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
