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
  // Strategy 1: full text is JSON
  try { return JSON.parse(text) } catch (_) {}

  // Strategy 2: brace-match around known keys
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

  // Strategy 3: first { to last }
  const s = text.indexOf('{'), e = text.lastIndexOf('}')
  if (s >= 0 && e > s) {
    try { return JSON.parse(text.slice(s, e + 1)) } catch (_) {}
  }

  return null
}

// ─────────────────────────────────────────────
// WEBSITE DESIGN PROMPT
// ─────────────────────────────────────────────
function buildWebsitePrompt(lead: CleanedLead): string {
  const hasSite = Boolean(lead.site?.startsWith('http'))
  return `You are writing 4 cold outreach emails from a web designer who has personally looked at this business.

LEAD:
Business: ${lead.business_name}
Website: ${hasSite ? lead.site : 'none found'}
City: ${lead.city || ''}
Country: ${lead.country || 'UK'}
${lead.description ? 'Business description: ' + lead.description : ''}

STEP 1 — FIND OWNER NAME:
${hasSite
    ? `Visit ${lead.site} and search "${lead.business_name} ${lead.city} owner". Check the About or Contact page.`
    : `Search "${lead.business_name} ${lead.city} owner" to find a name.`}
Use the real first name. If not found after genuinely searching, use the business name.

STEP 2 — OBSERVE THE WEBSITE:
${hasSite
    ? `Visit ${lead.site} now. Load it as if you are a customer on a phone.
Look for one specific, real observation — something a customer would actually notice:
- Is the phone number visible without scrolling on mobile?
- Does the navigation feel cluttered or unclear?
- Is there a clear next action (book, call, enquire)?
- Do the images load quickly or slowly?
- Is the layout clean or does it feel busy?
- Are there genuine reviews on the page?
Be specific. Not "site could be better." Something like: "The booking button is below the fold on mobile so the first thing you see is a large decorative image with no obvious next step."
If the site is genuinely good, note what is missing: no reviews shown, no local area mentioned, no pricing indication.`
    : `Search "${lead.business_name} ${lead.city}" to understand their web presence and identify what is missing.`}
Detect the exact niche. Be precise: not "restaurant" but "Caribbean restaurant" or "family pizza takeaway".

STEP 3 — WRITE 4 EMAILS:

VOICE: Sharp, observant web designer. You write like someone who looked at the site for a few minutes and noticed something real. Short sentences. No corporate tone. No buzzwords. No exaggerated claims. Slightly casual but professional.

STRICT RULES:
- Never fabricate actions you did not take. Do not say "I tried calling" or "I tried to book" unless you can verify you actually did from the website.
- Observations must be things visible from a website visit only
- Zero em dashes or en dashes
- No filler: "hope you are well", "wanted to reach out", "improve your online presence", "modernise", "game-changing", "user experience", "UI/UX", "digital footprint"
- No generic opener like "I noticed your website could be improved"
- No exclamation marks

EMAIL FORMAT — all 4 must follow this exactly:
Hi [first name],

[1-2 short sentences: the specific observation + the real consequence for a customer]

[1 natural sentence leading into the demo: e.g. "Built a quick version to show what it could look like:" then the HTML link]
<a href="[DEMO_LINK_PLACEHOLDER]">View the demo</a>

[1 short honest closing line. Not a question. No pressure.]

Naomi | Omiflow | omiflow.co.uk

EMAIL 1 — 70 to 90 words total (count everything including signature):
Your specific observation. The customer consequence. Then one sentence explaining what the demo link is — e.g. "I rebuilt their site to show what a cleaner version could look like — takes about 20 seconds to scroll through." Then the link. One honest close.
<a href="[DEMO_LINK_PLACEHOLDER]">View the demo</a>

EMAIL 2 — 60 to 75 words:
One real named social proof result matched to their niche.
Trades: "EON Drylining picked up four new jobs in the first week."
Services: "White House Birmingham filled August in nine days."
Brief reference to the demo as a rebuilt version of their type of site.
<a href="[DEMO_LINK_PLACEHOLDER]">Same approach here</a>

EMAIL 3 — 60 to 75 words:
How many enquiries per week they are likely losing. Give a specific number. Brief mention that the demo shows what a better version could look like.
<a href="[DEMO_LINK_PLACEHOLDER]">Demo still here</a>

EMAIL 4 — 50 to 65 words:
Warm final. No pressure. One honest sentence. Brief note that the demo is still live.
<a href="[DEMO_LINK_PLACEHOLDER]">Still live if useful</a>

Count every word including signature. Rewrite any that fall outside the range.

OUTPUT: Raw JSON only. Nothing before or after.

{"niche":"precise niche e.g. independent Caribbean restaurant","website_found":"url or empty","template":1,"emails":[{"day":1,"subject":"6 words max, specific to their situation","body":"full email with HTML anchor"},{"day":4,"subject":"","body":""},{"day":10,"subject":"","body":""},{"day":21,"subject":"","body":""}]}
template: 1=dental/physio/salon/estate agent, 2=trades/kitchen/builder/roofer, 3=photographer/tattoo/videographer, 4=solicitor/financial/mortgage, 5=medspa/aesthetics`
}

// ─────────────────────────────────────────────
// AI VOICEMAIL PROMPT
// ─────────────────────────────────────────────
function buildVoicemailPrompt(lead: CleanedLead): string {
  const hasSite = Boolean(lead.site?.startsWith('http'))
  return `You are writing 4 cold outreach emails for a service that handles missed calls for businesses.

THE SERVICE:
When a client calls and no one picks up, the system answers on ring three of that same call. Not a separate voicemail box — the third ring of the actual incoming call. It speaks naturally, takes the caller's name, reason for calling, and best callback time, then sends the business owner a text summary before the caller hangs up.

LEAD:
Business: ${lead.business_name}
Website: ${hasSite ? lead.site : 'none'}
City: ${lead.city || ''}
Phone listed: ${lead.phone || 'unknown'}

STEP 1 — FIND OWNER NAME:
${hasSite
    ? `Visit ${lead.site} and search "${lead.business_name} owner" to find the owner or manager's first name.`
    : `Search "${lead.business_name} ${lead.city} owner".`}
Use the real first name. If not found, use the business name.

STEP 2 — UNDERSTAND THEIR CALL SITUATION:
Based on their business type, think carefully about:
- When are they likely to be unavailable to answer calls? (in a treatment, on the floor, driving, with a client)
- What does a missed call mean for this type of business specifically?
- What is a typical customer worth to this business?
Think operationally. You are not a tech company selling AI. You are someone who understands small business operations.

STEP 3 — WRITE 4 EMAILS:

VOICE: Operational and grounded. You sound like someone who has run or worked closely with a small business and understands what missed calls actually cost. No startup language. No AI buzzwords. No fabricated actions.

CRITICAL RULES:
- Never say "I tried calling" or any variation of pretending to contact them
- Observations about their call handling must be inferred from the business type, not fake actions
- Never use the word "AI" or "artificial intelligence" or "bot" or "chatbot"
- Zero em dashes or en dashes
- No filler phrases
- No corporate tone

Good example observations (based on business type, not fake actions):
"When you are with a client, any call that comes in just rings out."
"Out-of-hours enquiries are almost certainly disappearing right now with no way to capture them."
"Most people who hit voicemail do not leave a message. They call the next result."
"If someone calls during your busiest hour, there is currently no safety net between them and a dead end."

EMAIL FORMAT — all 4 must follow this exactly:
Hi [first name],

[1-2 short sentences: the specific operational moment where a call goes unanswered for this business type]

[1 natural sentence leading into the demo: e.g. "Built a quick demo to show how it sounds:" then the HTML link]
<a href="[DEMO_LINK_PLACEHOLDER]">Hear how it works</a>

[1 short warm closing line. Not a question. No pressure.]

Naomi | Omiflow | omiflow.co.uk

EMAIL 1 — 65 to 80 words total (count everything including signature):
The specific moment a caller is lost — vivid, tied to this business type. Then one sentence explaining what the demo is and what it does — e.g. "I put together a live AI voicemail demo built specifically for [business name] — it shows how missed calls could be answered and handled automatically." Then the link. One warm close.
<a href="[DEMO_LINK_PLACEHOLDER]">Hear how it works</a>

EMAIL 2 — 55 to 70 words:
One specific operational result from a similar business type. Include a real number. Then: "Demo is still live if you want to hear it:" then the link.
<a href="[DEMO_LINK_PLACEHOLDER]">Hear a live example</a>

EMAIL 3 — 55 to 70 words:
The cost per missed call for this business type. Give a number. Then briefly reference the demo as a way to see it in action.
<a href="[DEMO_LINK_PLACEHOLDER]">Demo still here</a>

EMAIL 4 — 45 to 60 words:
Warm, no pressure, genuine final. One honest sentence. Then: "The demo is still live — worth 30 seconds."
<a href="[DEMO_LINK_PLACEHOLDER]">Demo is still live</a>

Count every word including signature. Rewrite any outside range.

OUTPUT: Raw JSON only. Nothing before or after.

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
        lastError = new Error('JSON not found in Claude response — will retry')
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
          throw new Error(`Claude API 5-hour limit reached. Resets at ${resetTime}. Stop and resume then.`)
        }
      } catch (parseErr) {
        if (parseErr instanceof Error && parseErr.message.includes('Resets at')) throw parseErr
      }
    }
  }

  throw lastError || new Error('Generation failed after 2 attempts')
}
