import JSZip from 'jszip'

export async function deployToNetlify(html: string, _bizName: string): Promise<string | null> {
  const token = process.env.NETLIFY_TOKEN
  if (!token) {
    console.warn('[Netlify] No NETLIFY_TOKEN env var set')
    return null
  }

  // Build zip
  const zip = new JSZip()
  zip.file('index.html', html)
  const bytes = await zip.generateAsync({ type: 'nodebuffer' })

  const delays = [0, 8000, 16000]

  for (let attempt = 0; attempt < 3; attempt++) {
    if (delays[attempt] > 0) {
      await new Promise(r => setTimeout(r, delays[attempt]))
    }

    try {
      const resp = await fetch('https://api.netlify.com/api/v1/sites', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/zip',
        },
        body: bytes,
      })

      if (resp.status === 429) {
        console.warn(`[Netlify] Rate limited on attempt ${attempt + 1}, waiting 20s`)
        await new Promise(r => setTimeout(r, 20000))
        continue
      }

      if (resp.status === 401) {
        console.error('[Netlify] Invalid token — check NETLIFY_TOKEN environment variable')
        return null
      }

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({})) as { message?: string }
        console.error(`[Netlify] Error ${resp.status}:`, err.message || JSON.stringify(err))
        continue
      }

      const data = await resp.json() as {
        ssl_url?: string
        url?: string
        subdomain?: string
        id?: string
      }

      // Wait for CDN propagation
      await new Promise(r => setTimeout(r, 3000))

      const url = data.ssl_url || data.url || (data.subdomain ? `https://${data.subdomain}.netlify.app` : null)

      if (url) {
        console.log(`[Netlify] Deployed: ${url}`)
        return url
      }

      console.warn('[Netlify] No URL in response:', JSON.stringify(data).slice(0, 200))

    } catch (err) {
      console.warn(`[Netlify] Attempt ${attempt + 1} failed:`, err instanceof Error ? err.message : String(err))
    }
  }

  console.error('[Netlify] All 3 deploy attempts failed')
  return null
}
