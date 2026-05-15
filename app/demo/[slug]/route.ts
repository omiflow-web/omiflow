import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug
  console.log('[demo/slug] Request for slug:', slug)

  const { data, error } = await supabase
    .from('leads')
    .select('demo_html, business_name, campaign, niche')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('[demo/slug] Supabase error:', error.message, '| slug:', slug)
    return new NextResponse(notFoundHtml(slug), {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    })
  }

  if (!data?.demo_html) {
    console.error('[demo/slug] Empty demo_html for slug:', slug)
    return new NextResponse(notFoundHtml(slug), {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    })
  }

  console.log('[demo/slug] Serving demo for:', data.business_name, '| campaign:', data.campaign, '| niche:', data.niche, '| html length:', data.demo_html.length)

  return new NextResponse(data.demo_html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-Demo-Business': data.business_name,
      'X-Demo-Campaign': data.campaign,
    },
  })
}

function notFoundHtml(slug: string): string {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Demo not found</title>
<style>body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f5f5f5}
.box{text-align:center;padding:40px;background:#fff;border-radius:12px;max-width:400px}
h2{color:#333;margin-bottom:8px}p{color:#777;font-size:14px}</style></head>
<body><div class="box"><h2>Demo not found</h2>
<p>The demo for <code>${slug}</code> does not exist or has been removed.</p>
<p style="margin-top:16px">Contact <a href="mailto:hello@omiflow.co.uk">hello@omiflow.co.uk</a></p>
</div></body></html>`
}
