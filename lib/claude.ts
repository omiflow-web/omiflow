import Anthropic from '@anthropic-ai/sdk'
import type { CleanedLead, Campaign, GeneratedEmail } from './types'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

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
  try { return JSON.parse(text) } catch (_) {}

  for (const marker of ['"emails":', '"niche":']) {
    const mi = text.indexOf(marker)
    if (mi < 0) continue
    let open = -1
    for (let i = mi; i >= 0; i--) { if (text[i] === '{') { open = i; break } }
    if (open < 0) continue
    let depth = 0, close = -1
    for (let i = open; i < text.length; i++) {
      if (text[i] === '{') depth++
      else if (text[i] === '}' && --depth === 0) { close = i; break }
    }
    if (close > open) {
      try {
        const c = JSON.parse(text.slice(open, close + 1)) as Record<string, unknown>
        if (c.emails && Array.isArray(c.emails) && (c.emails as unknown[]).length >= 4) return c
      } catch (_) {}
    }
  }

  const s = text.indexOf('{'), e = text.lastIndexOf('}')
  if (s >= 0 && e > s) {
    try { return JSON.parse(text.slice(s, e + 1)) } catch (_) {}
  }

  return null
}

function buildWebsitePrompt(lead: CleanedLead): string {
  const hasSite = Boolean(lead.site?.startsWith('http'))
  return `You are writing cold outreach emails from a web designer. You have personally looked at this business's website and noticed something specific.

LEAD:
Business: ${lead.business_name}
Website: ${hasSite ? lead.site : 'none found'}
City: ${lead.city || ''}
Country: ${lead.country || 'UK'}
${lead.description ? 'Type of business: ' + lead.description : ''}

STEP 1 — FIND THE OWNER NAME (mandatory):
${hasSite
    ? `Visit ${lead.site} and search "${lead.business_name} owner" or "${lead.business_name} ${lead.city} founded by".`
    : `Search "${lead.business_name} ${lead.city} owner".`}
You must find a real first name. If genuinely not found after searching, use the business name.

STEP 2 — FIND ONE REAL SPECIFIC PROBLEM (mandatory):
${hasSite
    ? `Visit ${lead.site} on a mobile viewport right now. Look for one specific real problem:
- Is the phone number above the fold on mobile?
- Does the navigation obscure content on scroll?
- How long do images take to load?
- Is there a clear next step (book, call, enquire)?
- Are there real reviews visible on the homepage?
- Is the layout consistent or do fonts and styles clash?
- Is it immediately clear what the business does and where?
Name exactly what you observed. Not "the site could be improved." Something like:
"The contact number is in the footer — not visible until you scroll past three sections on mobile."
"There are four different font weights on the homepage and no single clear CTA."
"The gallery images are full-resolution — they take around 7 seconds to load on mobile data."`
    : `Search "${lead.business_name} ${lead.city}" and identify what their web presence is missing.`}
Also detect the exact niche. Be specific: not "restaurant" but "Caribbean restaurant" or "family-run Jamaican takeaway".

STEP 3 — WRITE 4 EMAILS:

VOICE: You are a sharp, observant web designer. You write like someone who has actually looked at the business, not like a sales tool. Short sentences. Specific. Occasionally a bit dry or understated. You respect the business owner's time.

BANNED PHRASES — never use any of these:
"hope you are well", "wanted to reach out", "I noticed your website", "your online presence",
"improve your digital presence", "modern and clean", "game-changing", "touch base", "feel free",
"worth a look", "just following up", "boost conversions", "user experience", "UI/UX",
"website refresh", "hope this finds you", "going forward", any phrase starting with "As a"

DEMO LINK FORMAT — every email must include the demo as an HTML anchor:
<a href="[DEMO_LINK_PLACEHOLDER]">visible text</a>
The visible text should be a short natural phrase like: "See the rebuilt version", "View the demo", "Built a version here"
Never paste a raw URL. Never use [DEMO_LINK_PLACEHOLDER] as visible text.

EMAIL FORMAT — all 4 must follow this structure exactly:
Hi [first name],

[1-2 short sentences: the specific problem you found + the exact moment it costs them a customer]

[1 sentence with the demo anchor: natural lead-in phrase + HTML link]

[1 short closing line — honest, no pressure, not a question]

Naomi | Omiflow | omiflow.co.uk

EMAIL 1 — 70 to 90 words total (count everything including signature):
The problem you found. What it means for a real customer trying to contact them. The rebuilt demo as an anchor. One honest closing line.

EMAIL 2 — 60 to 75 words:
One specific named social proof result matched to their niche. For trades: "EON Drylining picked up four new jobs in the first week." For services: "White House Birmingham filled August in nine days." Lead into the demo anchor naturally.

EMAIL 3 — 60 to 75 words:
Weekly enquiries they are likely losing because of the problem. Give a specific number. Make it feel grounded. Lead into demo anchor.

EMAIL 4 — 50 to 65 words:
Final. Warm. No pressure. Acknowledge they have probably seen the others. Leave the door open. Demo anchor with text like "Still live if useful".

Count every word including the signature. Rewrite any email that falls outside its range.

OUTPUT: Raw JSON only. No explanation. No text before or after.

{"niche":"specific niche e.g. independent kitchen fitter","website_found":"url or empty","template":1,"emails":[{"day":1,"subject":"6 words max, specific to their situation","body":"full email with HTML anchor"},{"day":4,"subject":"","body":""},{"day":10,"subject":"","body":""},{"day":21,"subject":"","body":""}]}
template: 1=dental/physio/salon/estate agent, 2=trades/kitchen/builder, 3=photographer/tattoo/videographer, 4=solicitor/financial/mortgage, 5=medspa/aesthetics`
}

function buildVoicemailPrompt(lead: CleanedLead): string {
  const hasSite = Boolean(lead.site?.startsWith('http'))
  return `You are writing cold outreach emails from someone who has observed how this business handles incoming calls and enquiries. You are selling a service that answers missed calls automatically — not a chatbot, not a voicemail box. When a client calls and nobody picks up, the system answers on ring three of that same call, has a real conversation, and texts the business a summary before the caller hangs up.

LEAD:
Business: ${lead.business_name}
Website: ${hasSite ? lead.site : 'none'}
City: ${lead.city || ''}
Phone listed: ${lead.phone || 'unknown'}

STEP 1 — FIND THE OWNER NAME (mandatory):
${hasSite
    ? `Search "${lead.business_name} owner" and visit ${lead.site} About or Contact page.`
    : `Search "${lead.business_name} ${lead.city} owner".`}
You must find a real first name. If not found after genuinely searching, use the business name.

STEP 2 — UNDERSTAND THEIR CALL SITUATION:
${hasSite
    ? `Visit ${lead.site}. Look at how they expect people to contact them. Is it phone-first? Is there a booking form? Online chat? Based on the business type and what you can see, think about:
- When are they likely to be unavailable to answer calls? (in appointments, doing the work, driving, etc.)
- What does a missed call mean for this type of business specifically?
- Is there any call handling infrastructure visible, or is it just a phone number?`
    : `Search "${lead.business_name} ${lead.city}". Think about when this type of business is most likely to miss calls and what the cost is.`}
Think operationally, not technically. The critique should feel like an observation from someone who tried calling, not a tech pitch.

STEP 3 — WRITE 4 EMAILS:

VOICE: Operational. Grounded. Slightly commercial. You sound like someone who has run a small business and knows what missed calls actually cost. You are not selling "AI." You are pointing out a real operational gap. You have noticed something specific about when this business is likely unavailable.

TONE EXAMPLES — good:
"Tried calling around lunch and it rang out. Anyone doing that during a busy spell is probably not calling back."
"Most businesses in your situation have no safety net between a missed ring and a lost booking."
"Out-of-hours enquiries are most likely disappearing completely right now."
"If someone calls while you are with a client, there is currently nothing between them and a voicemail they will not leave."

BANNED PHRASES — never use any of these:
"AI-powered", "AI solution", "modernise", "streamline", "cutting-edge", "innovative",
"hope you are well", "wanted to reach out", "game-changing", "touch base", "feel free",
"customer interactions", "improve communication", "digital transformation",
"hope this finds you", "worth a look", "just following up", any mention of "AI" at all

DEMO LINK FORMAT — every email must include the demo as an HTML anchor:
<a href="[DEMO_LINK_PLACEHOLDER]">visible text</a>
Visible text should be natural: "Hear what callers hear", "Listen to a sample call", "Hear a live example"
Never paste a raw URL. Never use [DEMO_LINK_PLACEHOLDER] as visible text.

EMAIL FORMAT — all 4 must follow this exactly:
Hi [first name],

[1-2 short sentences: the specific operational moment where a call goes unanswered for this business]

[1 sentence with demo anchor — natural lead-in + HTML link]

[1 short warm closing line — not a question, no pressure]

Naomi | Omiflow | omiflow.co.uk

EMAIL 1 — 65 to 80 words total (count everything including signature):
The specific moment they miss a call — tied to their actual business type (in a treatment, on site, driving, with a client). The caller rings out, does not leave a voicemail, and calls the next result. Make it vivid and real. Demo anchor with text "Hear what callers hear".

EMAIL 2 — 55 to 70 words:
One specific operational social proof result from a similar business type. Include a number that feels real ("recovered 11 enquiries in the first month", "three bookings came in overnight in the first week"). Demo anchor with text "Hear a live example".

EMAIL 3 — 55 to 70 words:
The cost of missed calls in this specific niche. Give a number. What does one lost booking or client typically represent for this type of business? Make it feel grounded, not hypothetical. Demo anchor.

EMAIL 4 — 45 to 60 words:
Warm, no pressure, final. Acknowledge they have probably seen the others. One honest sentence. Demo anchor with text "Demo is still live".

Count every word including signature. Rewrite any email outside its range.

OUTPUT: Raw JSON only. No explanation. No text before or after.

{"niche":"exact niche","website_found":"url or empty","emails":[{"day":1,"subject":"6 words max, operational and specific","body":"full email with HTML anchor"},{"day":4,"subject":"","body":""},{"day":10,"subject":"","body":""},{"day":21,"subject":"","body":""}]}`
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
): Promise<ClaudeGenerateResult> {
  const prompt = campaign === 'vm'
    ? buildVoicemailPrompt(lead)
    : buildWebsitePrompt(lead)

  let lastError: Error | null = null

  for (let attempt = 0; attempt < 2; attempt++) {
    if (attempt > 0) await new Promise(r => setTimeout(r, 8000))

    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 4000,
        tools: [{ type: 'web_search_20250305' as const, name: 'web_search' }] as any,
        messages: [{ role: 'user', content: prompt }],
      })

      const textBlocks = response.content.filter(b => b.type === 'text')
      if (!textBlocks.length) {
        lastError = new Error(`No text in response. stop_reason: ${response.stop_reason}`)
        continue
      }

      const allText = textBlocks.map(b => (b as { text: string }).text).join('\n')
      const parsed = extractJson(allText)

      if (!parsed || !Array.isArray(parsed.emails) || (parsed.emails as unknown[]).length < 4) {
        lastError = new Error('JSON not found in response — will retry')
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

      // Surface 5-hour rate limit clearly
      try {
        const ej = JSON.parse(lastError.message)
        if (ej.type === 'exceeded_limit' && ej.windows?.['5h']) {
          const resetTs = ej.windows['5h'].resets_at
          const resetTime = new Date(resetTs * 1000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
          throw new Error(`Claude API 5-hour limit reached. Resets at ${resetTime}. Stop generation and resume then.`)
        }
      } catch (parseErr) {
        if (parseErr instanceof Error && parseErr.message.includes('Resets at')) throw parseErr
      }
    }
  }

  throw lastError || new Error('Generation failed after 2 attempts')
}
