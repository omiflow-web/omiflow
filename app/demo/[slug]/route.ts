import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug
  console.log('[demo] Request for slug:', slug)

  // Check env vars explicitly — do not let module-level throws crash silently
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('[demo] Missing env vars — SUPABASE_URL:', !!supabaseUrl, 'SUPABASE_SERVICE_ROLE_KEY:', !!supabaseKey)
    return new NextResponse(errorHtml('Configuration error', 'Supabase environment variables are not set on Vercel. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Project Settings → Environment Variables.'), {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    })
  }

  try {
    // Import dynamically to avoid module-level throw crashing the route
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })

    console.log('[demo] Querying Supabase for slug:', slug)

    const { data, error } = await supabase
      .from('leads')
      .select('demo_html, business_name, campaign, niche')
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('[demo] Supabase error:', error.message, '| code:', error.code, '| slug:', slug)
      return new NextResponse(errorHtml('Demo not found', `Could not find a demo for "${slug}". It may not have been generated yet, or there was a database error: ${error.message}`), {
        status: 404,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      })
    }

    if (!data?.demo_html) {
      console.error('[demo] No demo_html in row for slug:', slug)
      return new NextResponse(errorHtml('Demo empty', 'This demo exists in the database but has no HTML content.'), {
        status: 404,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      })
    }

    console.log('[demo] Serving demo for:', data.business_name, '| campaign:', data.campaign, '| html length:', data.demo_html.length)

    return new NextResponse(data.demo_html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    })

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[demo] Unhandled exception:', msg)
    return new NextResponse(errorHtml('Server error', msg), {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    })
  }
}

function errorHtml(title: string, detail: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${title}</title>
<style>body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f5f5f5}
.box{text-align:center;padding:40px;background:#fff;border-radius:12px;max-width:500px;box-shadow:0 2px 16px rgba(0,0,0,.08)}
h2{color:#333;margin-bottom:12px}p{color:#666;font-size:14px;line-height:1.6}</style></head>
<body><div class="box"><h2>${title}</h2><p>${detail}</p>
<p style="margin-top:20px;font-size:12px;color:#999">Contact <a href="mailto:hello@omiflow.co.uk">hello@omiflow.co.uk</a></p>
</div></body></html>`
}
