import { NextRequest, NextResponse } from 'next/server'
import { parseXlsxBuffer, parseCsvString } from '@/lib/parse-leads'
import type { RawLead, CleanResult, CleanedLead, RemovedLead } from '@/lib/types'
import { randomUUID } from 'crypto'

export const maxDuration = 30

const PERSONAL_DOMAINS = new Set([
  'gmail.com','googlemail.com','yahoo.com','yahoo.co.uk','yahoo.fr',
  'hotmail.com','hotmail.co.uk','outlook.com','outlook.co.uk',
  'live.com','icloud.com','me.com','mac.com','aol.com','protonmail.com','proton.me',
])

function isValidEmail(e: string): boolean {
  return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(e.trim())
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const name = file.name.toLowerCase()

    let raw: RawLead[] = []
    if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
      raw = parseXlsxBuffer(buffer)
    } else if (name.endsWith('.csv')) {
      raw = parseCsvString(buffer.toString('utf-8'))
    } else {
      return NextResponse.json({ error: 'Unsupported file type. Use CSV or XLSX.' }, { status: 400 })
    }

    // Clean leads
    const clean: CleanedLead[] = []
    const removed: RemovedLead[] = []
    const seen = new Set<string>()
    const stats = { total: raw.length, kept: 0, noEmail: 0, duplicates: 0 }

    for (const lead of raw) {
      const email = lead.email?.trim().toLowerCase() || ''

      if (!email || !isValidEmail(email)) {
        stats.noEmail++
        removed.push({ ...lead, _reason: email ? `Invalid email: ${email}` : 'No email found' })
        continue
      }

      if (seen.has(email)) {
        stats.duplicates++
        removed.push({ ...lead, _reason: `Duplicate: ${email}` })
        continue
      }

      seen.add(email)
      clean.push({ ...lead, email, _id: randomUUID() })
    }

    stats.kept = clean.length

    const result: CleanResult = { clean, removed, stats }
    return NextResponse.json(result)

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
