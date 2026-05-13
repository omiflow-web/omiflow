import { NextRequest, NextResponse } from 'next/server'
import { generateWithClaude } from '@/lib/claude'
import { deployToNetlify } from '@/lib/netlify-deploy'
import { buildWebsiteDemo } from '@/lib/demo-builders/website'
import { buildVoicemailDemo } from '@/lib/demo-builders/voicemail'
import type { GenerateLeadRequest, GenerateLeadResponse, GeneratedLead } from '@/lib/types'

// Allow up to 5 minutes for a single lead (web search + emails + deploy)
export const maxDuration = 300

export async function POST(req: NextRequest): Promise<NextResponse<GenerateLeadResponse>> {
  try {
    const body = await req.json() as GenerateLeadRequest
    const { lead, campaign, vapiPublicKey, vapiAssistantId } = body

    if (!lead?.email) {
      return NextResponse.json({ success: false, error: 'Missing lead data' }, { status: 400 })
    }

    // 1. Generate emails via Claude (server-side, no CORS)
    const generated = await generateWithClaude(lead, campaign, vapiPublicKey, vapiAssistantId)

    // 2. Build demo HTML
    const demoHtml = campaign === 'vm'
      ? buildVoicemailDemo(lead, vapiPublicKey || '', vapiAssistantId || '')
      : buildWebsiteDemo(lead, generated.niche, generated.template)

    // 3. Deploy demo to Netlify (server-side, no CORS)
    const demoUrl = await deployToNetlify(demoHtml, lead.business_name)

    // 4. Inject real URL into all email bodies
    const emails = generated.emails.map(e => ({
      ...e,
      body: demoUrl
        ? e.body.replace(/\[DEMO_LINK_PLACEHOLDER\]/g, demoUrl)
        : e.body,
    }))

    if (!demoUrl) {
      console.warn(`[Generate] No demo URL for ${lead.business_name} — placeholder kept`)
    }

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
    console.error('[Generate] Error:', message)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
