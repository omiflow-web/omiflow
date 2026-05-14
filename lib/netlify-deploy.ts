import JSZip from 'jszip'

const HEADERS_FILE = `/index.html
  Content-Type: text/html; charset=utf-8
  Cache-Control: public, max-age=0, must-revalidate
  X-Content-Type-Options: nosniff

/*
  Cache-Control: public, max-age=31536000, immutable
`

const REDIRECTS_FILE = `/* /index.html 200`

async function verifyDeployedUrl(url: string): Promise<{ ok: boolean; error?: string }> {
  // Wait for CDN propagation first
  await new Promise(r => setTimeout(r, 6000))

  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const resp = await fetch(url, {
        headers: { Accept: 'text/html,application/xhtml+xml' },
        redirect: 'follow',
      })

      if (!resp.ok) {
        if (attempt < 5) {
          await new Promise(r => setTimeout(r, 4000))
          continue
        }
        return { ok: false, error: `Netlify returned HTTP ${resp.status} after ${attempt} attempts` }
      }

      const html = await resp.text()

      if (!html.toLowerCase().includes('<!doctype html')) {
        return { ok: false, error: 'Response does not contain <!DOCTYPE html> — raw source may be serving' }
      }
      if (!html.includes('<title>')) {
        return { ok: false, error: 'Response missing <title> tag — page may not have rendered correctly' }
      }
      if (!html.includes('</html>')) {
        return { ok: false, error: 'Response HTML appears truncated — missing </html>' }
      }

      return { ok: true }

    } catch (e) {
      if (attempt < 5) {
        await new Promise(r => setTimeout(r, 4000))
        continue
      }
      return { ok: false, error: `Fetch failed: ${e instanceof Error ? e.message : String(e)}` }
    }
  }

  return { ok: false, error: 'Verification timed out after 5 attempts' }
}

function toSecureUrl(raw: string): string {
  // Always return https://xxxxx.netlify.app — strip deploy hash prefix if present
  let url = raw.startsWith('http://') ? raw.replace('http://', 'https://') : raw

  // Some deploys return https://HASH--sitename.netlify.app
  // Prefer the clean https://sitename.netlify.app form via ssl_url
  return url
}

export interface DeployResult {
  success: true
  url: string
}

export interface DeployFailure {
  success: false
  error: string
}

export async function deployToNetlify(
  html: string,
  bizName: string
): Promise<DeployResult | DeployFailure> {
  const token = process.env.NETLIFY_TOKEN
  if (!token) {
    return { success: false, error: 'NETLIFY_TOKEN environment variable is not set' }
  }

  if (!html || !html.toLowerCase().includes('<!doctype html')) {
    return { success: false, error: 'Generated demo HTML is invalid — missing DOCTYPE' }
  }

  // Build ZIP with required files at root
  const zip = new JSZip()
  zip.file('index.html', html)
  zip.file('_headers', HEADERS_FILE)
  zip.file('_redirects', REDIRECTS_FILE)
  const bytes = await zip.generateAsync({ type: 'uint8array' })

  const delays = [0, 12000, 20000]

  for (let attempt = 0; attempt < delays.length; attempt++) {
    if (delays[attempt] > 0) {
      console.log(`[Netlify] Attempt ${attempt + 1} for "${bizName}", waiting ${delays[attempt] / 1000}s`)
      await new Promise(r => setTimeout(r, delays[attempt]))
    }

    try {
      const resp = await fetch('https://api.netlify.com/api/v1/sites', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/zip',
        },
        body: bytes as unknown as BodyInit,
      })

      if (resp.status === 429) {
        console.warn('[Netlify] Rate limited — waiting 30s before retry')
        await new Promise(r => setTimeout(r, 30000))
        attempt-- // don't consume a retry slot
        continue
      }

      if (resp.status === 401) {
        return { success: false, error: 'Netlify token invalid or expired — update NETLIFY_TOKEN in Vercel environment variables' }
      }

      if (!resp.ok) {
        const body = await resp.text().catch(() => '')
        const msg = `Netlify deploy HTTP ${resp.status}: ${body.slice(0, 200)}`
        console.error(`[Netlify] ${msg}`)
        if (attempt === delays.length - 1) {
          return { success: false, error: msg }
        }
        continue
      }

      const data = await resp.json() as {
        ssl_url?: string
        url?: string
        subdomain?: string
      }

      // Prefer ssl_url — it is always the canonical HTTPS URL
      const rawUrl =
        data.ssl_url ||
        (data.subdomain ? `https://${data.subdomain}.netlify.app` : null) ||
        data.url

      if (!rawUrl) {
        const msg = 'Netlify response contained no URL'
        console.error('[Netlify]', msg, JSON.stringify(data).slice(0, 200))
        if (attempt === delays.length - 1) {
          return { success: false, error: msg }
        }
        continue
      }

      const secureUrl = toSecureUrl(rawUrl)
      console.log(`[Netlify] Deployed to ${secureUrl} — verifying...`)

      const verification = await verifyDeployedUrl(secureUrl)

      if (verification.ok) {
        console.log(`[Netlify] ✓ Verified: ${secureUrl}`)
        return { success: true, url: secureUrl }
      }

      // Verification failed — if this is the last attempt, return failure
      if (attempt === delays.length - 1) {
        return {
          success: false,
          error: `Demo deployed to ${secureUrl} but verification failed: ${verification.error}`,
        }
      }

      console.warn(`[Netlify] Verification failed on attempt ${attempt + 1}: ${verification.error} — retrying deploy`)

    } catch (err) {
      const msg = `Exception on attempt ${attempt + 1}: ${err instanceof Error ? err.message : String(err)}`
      console.error('[Netlify]', msg)
      if (attempt === delays.length - 1) {
        return { success: false, error: msg }
      }
    }
  }

  return { success: false, error: 'All deploy attempts exhausted' }
}
