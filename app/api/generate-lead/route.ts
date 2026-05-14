import { NextRequest, NextResponse } from 'next/server'
import { generateWithClaude } from '@/lib/claude'
import { deployToNetlify } from '@/lib/netlify-deploy'
import { buildWebsiteDemo } from '@/lib/demo-builders/website'
import { buildVoicemailDemo } from '@/lib/demo-builders/voicemail'
import type { GenerateLeadRequest, GenerateLeadResponse, GeneratedLead } from '@/lib/types'

export const maxDuration = 300

export async function POST(req: NextRequest): Promise<NextResponse<GenerateLeadResponse>> {
  try {
    const body = await req.json() as GenerateLeadRequest
    const { lead, campaign, vapiPublicKey, vapiAssistantId } = body

    if (!lead?.email) {
      return NextResponse.json({ success: false, error: 'Missing lead data' }, { status: 400 })
    }

    // Step 1 — Claude researches + writes 4 emails (2 args only)
    const generated = await generateWithClaude(lead, campaign)

    // Step 2 — Build demo HTML server-side
    const demoHtml = campaign === 'vm'
      ? buildVoicemailDemo(lead, vapiPublicKey || '', vapiAssistantId || '')
      : buildWebsiteDemo(lead, generated.niche, generated.template)

    // Step 3 — Deploy demo. Hard fail if deployment cannot be verified.
    const deploy = await deployToNetlify(demoHtml, lead.business_name)

    if (!deploy.success) {
      return NextResponse.json({
        success: false,
        error: `Demo deploy failed: ${deploy.error}`,
      }, { status: 422 })
    }

    // Step 4 — Inject verified HTTPS URL into anchor hrefs only
    const demoUrl = deploy.url
    const emails = generated.emails.map(e => ({
      ...e,
      body: e.body.replace(/\[DEMO_LINK_PLACEHOLDER\]/g, demoUrl),
    }))

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
