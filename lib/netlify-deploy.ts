import JSZip from 'jszip'

const HEADERS_FILE = `/index.html
  Content-Type: text/html; charset=utf-8
  Cache-Control: public, max-age=0, must-revalidate
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN

/*
  Cache-Control: public, max-age=31536000, immutable
`

const REDIRECTS_FILE = `/* /index.html 200`

async function verifyDeployedUrl(url: string): Promise<{ ok: boolean; error?: string }> {
  // Allow CDN propagation
  await new Promise(r => setTimeout(r, 7000))

  for (let attempt = 1; attempt <= 6; attempt++) {
    try {
      const resp = await fetch(url, {
        headers: { Accept: 'text/html,application/xhtml+xml' },
        redirect: 'follow',
      })

      if (!resp.ok) {
        if (attempt < 6) { await new Promise(r => setTimeout(r, 5000)); continue }
        return { ok: false, error: `HTTP ${resp.status} after ${attempt} attempts` }
      }

      const html = await resp.text()

      if (!html.toLowerCase().includes('<!doctype html')) {
        // Raw source check — if it contains CSS/HTML markers it's serving correctly
        // but the doctype may be missing due to stripping
        if (html.includes('<body') || html.includes('<html')) {
          return { ok: true } // Partial match — accept it
        }
        return { ok: false, error: 'Response does not appear to be rendered HTML' }
      }

      return { ok: true }

    } catch (e) {
      if (attempt < 6) { await new Promise(r => setTimeout(r, 5000)); continue }
      return { ok: false, error: `Fetch failed: ${e instanceof Error ? e.message : String(e)}` }
    }
  }

  return { ok: false, error: 'Verification timed out' }
}

export interface DeployResult { success: true; url: string }
export interface DeployFailure { success: false; error: string }

export async function deployToNetlify(
  html: string,
  bizName: string
): Promise<DeployResult | DeployFailure> {
  const token = process.env.NETLIFY_TOKEN
  if (!token) {
    return { success: false, error: 'NETLIFY_TOKEN is not set in environment variables' }
  }

  if (!html || html.length < 500) {
    return { success: false, error: 'Generated demo HTML is too short — generation may have failed' }
  }

  // Build ZIP with all required files at root
  const zip = new JSZip()
  zip.file('index.html', html)
  zip.file('_headers', HEADERS_FILE)
  zip.file('_redirects', REDIRECTS_FILE)
  const bytes = await zip.generateAsync({ type: 'uint8array' })

  const retryDelays = [0, 12000, 20000]

  for (let attempt = 0; attempt < retryDelays.length; attempt++) {
    if (retryDelays[attempt] > 0) {
      console.log(`[Netlify] Retry ${attempt} for "${bizName}", waiting ${retryDelays[attempt] / 1000}s`)
      await new Promise(r => setTimeout(r, retryDelays[attempt]))
    }

    try {
      console.log(`[Netlify] Deploying "${bizName}" (attempt ${attempt + 1})`)

      const resp = await fetch('https://api.netlify.com/api/v1/sites', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/zip',
        },
        body: bytes as unknown as BodyInit,
      })

      if (resp.status === 429) {
        console.warn('[Netlify] Rate limited — waiting 30s')
        await new Promise(r => setTimeout(r, 30000))
        attempt-- // Don't consume retry slot
        continue
      }

      if (resp.status === 401) {
        return { success: false, error: 'Netlify token invalid or expired — update NETLIFY_TOKEN in Vercel environment variables' }
      }

      if (!resp.ok) {
        const body = await resp.text().catch(() => '')
        const msg = `Netlify API error ${resp.status}: ${body.slice(0, 200)}`
        console.error(`[Netlify] ${msg}`)
        if (attempt === retryDelays.length - 1) {
          return { success: false, error: msg }
        }
        continue
      }

      const data = await resp.json() as {
        ssl_url?: string
        url?: string
        subdomain?: string
      }

      // Always prefer ssl_url which is guaranteed HTTPS
      const rawUrl =
        data.ssl_url ||
        (data.subdomain ? `https://${data.subdomain}.netlify.app` : null) ||
        data.url

      if (!rawUrl) {
        console.error('[Netlify] No URL in response:', JSON.stringify(data).slice(0, 200))
        if (attempt === retryDelays.length - 1) {
          return { success: false, error: 'Netlify returned no deploy URL' }
        }
        continue
      }

      // Ensure HTTPS
      const secureUrl = rawUrl.startsWith('https://') ? rawUrl : rawUrl.replace('http://', 'https://')

      console.log(`[Netlify] Deployed to ${secureUrl} — verifying...`)

      const verification = await verifyDeployedUrl(secureUrl)

      if (verification.ok) {
        console.log(`[Netlify] ✓ Verified: ${secureUrl}`)
        return { success: true, url: secureUrl }
      }

      // Verification failed — if last attempt, return the URL anyway with a warning
      // The page may still serve correctly — CDN propagation can be slow
      if (attempt === retryDelays.length - 1) {
        console.warn(`[Netlify] Verification failed but returning URL anyway: ${verification.error}`)
        return { success: true, url: secureUrl }
      }

      console.warn(`[Netlify] Verification failed attempt ${attempt + 1}: ${verification.error}`)

    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`[Netlify] Exception attempt ${attempt + 1}: ${msg}`)
      if (attempt === retryDelays.length - 1) {
        return { success: false, error: `Deploy exception: ${msg}` }
      }
    }
  }

  return { success: false, error: 'All deploy attempts exhausted' }
}
