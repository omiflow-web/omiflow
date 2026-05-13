import Anthropic from '@anthropic-ai/sdk'
import type { CleanedLead, Campaign, GeneratedEmail } from './types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

function cleanDashes(text: string): string {
  return text
    .replace(/ [—–] /g, ', ')
    .replace(/[—–]/g, '')
    .replace(/ -- /g, ', ')
    .replace(/--/g, '')
    .replace(/,\s*,/g, ',')
    .replace(/  +/g, ' ')
    .trim()
}

function extractJson(text: string): Record<string, unknown> | null {
  // Strategy 1: entire text is JSON
  try { return JSON.parse(text) } catch (_) {}

  // Strategy 2: find by "niche": or "emails": marker with brace matching
  for (const marker of ['"niche":', '"emails":']) {
    const mi = text.indexOf(marker)
    if (mi < 0) continue
    let open = -1
    for (let i = mi; i >= 0; i--) {
      if (text[i] === '{') { open = i; break }
    }
    if (open < 0) continue
    let depth = 0, close = -1
    for (let i = open; i < text.length; i++) {
      if (text[i] === '{') depth++
      else if (text[i] === '}' && --depth === 0) { close = i; break }
    }
    if (close > open) {
      try {
        const candidate = JSON.parse(text.slice(open, close + 1)) as Record<string, unknown>
        if (candidate.emails && Array.isArray(candidate.emails) && (candidate.emails as unknown[]).length >= 4) {
          return candidate
        }
      } catch (_) {}
    }
  }

  // Strategy 3: first { to last }
  const s = text.indexOf('{')
  const e = text.lastIndexOf('}')
  if (s >= 0 && e > s) {
    try { return JSON.parse(text.slice(s, e + 1)) } catch (_) {}
  }

  return null
}

function buildPrompt(lead: CleanedLead, campaign: Campaign, vapiPublicKey?: string, vapiAssistantId?: string): string {
  const hasSite = lead.site?.startsWith('http')

  if (campaign === 'vm') {
    return `You are writing 4 cold outreach emails for a business selling AI voicemail services.

LEAD:
Business: ${lead.business_name}
Website: ${hasSite ? lead.site : 'none'}
City: ${lead.city || ''}

STEP 1 — FIND OWNER NAME FIRST (mandatory):
Use web_search to find the owner or manager's first name. Search: "${lead.business_name} owner" and "${lead.business_name} ${lead.city}". Check About/Contact/Team pages. Use the real first name. If after searching you truly find no individual name, open with: ${JSON.stringify(lead.business_name)}, — never "Hi there".

STEP 2 — WRITE 4 EMAILS:

PRODUCT: When a client calls and nobody picks up, the AI answers on ring three of that same call — not a separate call — has a real conversation, collects their details and best callback time, and texts the business a summary before the caller hangs up.

RULES:
- Zero em dashes (—) or en dashes (–) ever
- No filler phrases
- Line 1: always write "Hi [first name]," or "Hi [business name]," — always include the word Hi and a comma after the name
- Never name Omiflow
- End every email with: Naomi | Omiflow | omiflow.co.uk
- Demo link in FIRST HALF — write a natural label sentence then the link on the same line, e.g. "I put together a quick demo for you: [DEMO_LINK_PLACEHOLDER]"
- Sound like a real person who actually looked at their business. Be specific, warm, direct. Not salesy.

EMAIL 1 — 70-90 words total including signature:
Open with the specific moment they lost a lead — a potential client called while they were busy, hit voicemail, and called the next business in under a minute. Make it vivid and real. Then a natural label sentence + demo link. One warm closing line. Signature.

EMAIL 2 — 65-80 words: One specific social proof result from a similar business. Natural label + demo. One warm line. Signature.
EMAIL 3 — 65-80 words: What each missed call costs them in real money — give a specific number. Natural label + demo. One line. Signature.
EMAIL 4 — 55-65 words: Warm genuine final, no pressure whatsoever. Natural label + demo. Signature.

Count words. Rewrite any outside range.

IMPORTANT: End your response with the JSON and nothing after it.

{"niche":"detected niche","website_found":"url or empty","emails":[{"day":1,"subject":"max 7 words","body":"full email text"},{"day":4,"subject":"","body":""},{"day":10,"subject":"","body":""},{"day":21,"subject":"","body":""}]}`
  } else {
    return `You are writing 4 cold outreach emails for a web design agency.

LEAD:
Business: ${lead.business_name}
Website: ${hasSite ? lead.site : 'none'}
City: ${lead.city || ''}
Country: ${lead.country || 'UK'}
${lead.description ? 'Description: ' + lead.description : ''}

STEP 1 — RESEARCH (mandatory):
A: Find owner/manager first name — search "${lead.business_name} owner" and check About/Contact page. Use real name. If truly not found, open with: ${JSON.stringify(lead.business_name)}, — never "Hi there".
B: ${hasSite ? `Visit ${lead.site}. Find ONE specific real problem: slow load, buried phone number, no reviews, blurry images, no clear CTA, outdated design. Name exactly what you saw.` : `Search "${lead.business_name} ${lead.city}" and understand their web presence.`}
C: Detect exact niche (e.g. "private dental practice", "kitchen fitter", "wedding photographer").

STEP 2 — WRITE 4 EMAILS:

RULES:
- Zero em dashes (—) or en dashes (–) ever
- No filler phrases
- Line 1: always write "Hi [first name]," or "Hi [business name]," — always include the word Hi and a comma after the name
- Never name Omiflow or any agency
- End every email with: Naomi | Omiflow | omiflow.co.uk
- Demo link in FIRST HALF — write a natural label sentence then the link, e.g. "I rebuilt it to show what it could look like: [DEMO_LINK_PLACEHOLDER]"
- Sound like a real person who visited their site and genuinely noticed something. Specific, warm, human. Not a template.

EMAIL 1 — 80-100 words total including signature:
Name the specific real problem you found on their site. Describe the exact moment a real customer gives up because of it. Natural label sentence + demo link. One honest warm closing line. Signature.

EMAIL 2 — 70-85 words: One named social proof result matched to their niche. Natural label + demo. One warm line. Signature.
EMAIL 3 — 70-85 words: How many enquiries per week they are likely losing — give a specific number. Natural label + demo. One line. Signature.
EMAIL 4 — 55-70 words: Warm genuine final, no pressure. Natural label + demo. Signature.

Count words. Rewrite any outside range.

IMPORTANT: End your response with the JSON and nothing after it.

{"niche":"exact niche","website_found":"url or empty","template":1,"emails":[{"day":1,"subject":"max 7 words specific curious","body":"full email text"},{"day":4,"subject":"","body":""},{"day":10,"subject":"","body":""},{"day":21,"subject":"","body":""}]}
template: 1=dental/physio/salon/estate agent, 2=trades/kitchen/builder, 3=photographer/tattoo/videographer, 4=solicitor/financial/mortgage, 5=medspa/aesthetics`
  }
}

export interface ClaudeGenerateResult {
  niche: string
  template: number
  websiteFound: string
  emails: GeneratedEmail[]
}

export async function generateWithClaude(
  lead: CleanedLead,
  campaign: Campaign,
  vapiPublicKey?: string,
  vapiAssistantId?: string
): Promise<ClaudeGenerateResult> {
  const prompt = buildPrompt(lead, campaign, vapiPublicKey, vapiAssistantId)

  let lastError: Error | null = null

  // Two attempts
  for (let attempt = 0; attempt < 2; attempt++) {
    if (attempt > 0) await new Promise(r => setTimeout(r, 6000))

    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 4000,
        tools: [{ type: 'web_search_20250305' as const, name: 'web_search' }],
        messages: [{ role: 'user', content: prompt }],
      })

      // Collect all text blocks
      const textBlocks = response.content.filter(b => b.type === 'text')
      if (!textBlocks.length) {
        lastError = new Error(`No text in response. stop_reason: ${response.stop_reason}`)
        continue
      }

      const allText = textBlocks.map(b => (b as { text: string }).text).join('\n')
      const parsed = extractJson(allText)

      if (!parsed || !Array.isArray(parsed.emails) || (parsed.emails as unknown[]).length < 4) {
        lastError = new Error('JSON not found in response — Claude returned text only')
        continue
      }

      const emails = (parsed.emails as Array<{ day: number; subject: string; body: string }>).map(e => ({
        day: e.day,
        subject: cleanDashes(e.subject || ''),
        body: cleanDashes(e.body || ''),
      }))

      return {
        niche: String(parsed.niche || 'business'),
        template: Number(parsed.template) || 1,
        websiteFound: String(parsed.website_found || ''),
        emails,
      }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))

      // Handle rate limit
      if (lastError.message.includes('exceeded_limit') || lastError.message.includes('rate_limit')) {
        try {
          const ej = JSON.parse(lastError.message)
          if (ej.windows?.['5h']) {
            const resetTs = ej.windows['5h'].resets_at
            const resetTime = new Date(resetTs * 1000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
            throw new Error(`Claude API 5-hour limit reached. Resets at ${resetTime}.`)
          }
        } catch (parseErr) {
          if (parseErr instanceof Error && parseErr.message.includes('Resets at')) throw parseErr
        }
        throw lastError
      }
    }
  }

  throw lastError || new Error('Generation failed after 2 attempts')
}
