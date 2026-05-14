import { NextRequest, NextResponse } from 'next/server'
import type { RawLead, CleanResult, CleanedLead, RemovedLead } from '@/lib/types'
import { randomUUID } from 'crypto'

export const maxDuration = 30

// Patterns for scanning cell values
const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/
const PHONE_RE = /^[+\d][\d\s\-().]{6,19}$/

// URLs to skip — social profiles, maps, review sites, booking platforms
const SKIP_URL = /google\.|googleusercontent|\/maps\/|facebook\.|instagram\.|twitter\.|tiktok\.|yelp\.|tripadvisor\.|linkedin\.|resy\.|opentable\.|lh[0-9]\.|goog/i

function looksLikeEmail(v: string): boolean {
  return EMAIL_RE.test(v.trim()) && v.length < 120
}

function looksLikeWebsite(v: string): boolean {
  if (!v.startsWith('http')) return false
  if (SKIP_URL.test(v)) return false
  if (v.length > 200) return false
  try {
    const u = new URL(v)
    return u.hostname.includes('.') && !SKIP_URL.test(u.hostname)
  } catch {
    return false
  }
}

function looksLikePhone(v: string): boolean {
  return PHONE_RE.test(v.trim()) && v.length <= 20
}

function parseOutscraperXlsx(buffer: Buffer): RawLead[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const XLSX = require('xlsx') as typeof import('xlsx')

  const wb = XLSX.read(buffer, { type: 'buffer' })
  const ws = wb.Sheets[wb.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json(ws, {
    header: 1,
    defval: '',
    raw: false,
  }) as string[][]

  if (rows.length < 2) return []

  // Due to Outscraper's merged-cell formatting, column indices are shifted.
  // The business name consistently appears at index 25 in Outscraper AI Voicemail exports.
  // All other data is extracted by scanning cell values for matching patterns.
  const NAME_COL = 25

  const leads: RawLead[] = []

  for (let rowIdx = 1; rowIdx < rows.length; rowIdx++) {
    const row = rows[rowIdx]
    if (!row || row.every(v => !String(v).trim())) continue

    // Business name — col 25 in Outscraper format
    let name = String(row[NAME_COL] || '').trim()

    // Scan all cells for email, website, phone
    const emails: string[] = []
    const sites: string[] = []
    const phones: string[] = []

    row.forEach(val => {
      const v = String(val || '').trim()
      if (!v || v.length > 300) return
      if (looksLikeEmail(v)) { emails.push(v.toLowerCase()); return }
      if (looksLikeWebsite(v)) { sites.push(v); return }
      if (looksLikePhone(v) && !emails.length) { phones.push(v); return }
    })

    // Fallback: derive name from email domain if name col empty
    if (!name && emails[0]) {
      name = emails[0].split('@')[1]?.split('.')[0]?.replace(/[-_]/g, ' ') || ''
    }

    if (!name || !emails[0]) continue

    leads.push({
      business_name: name,
      name_for_emails: name,
      site: sites[0] || '',
      email: emails[0],
      phone: phones[0] || '',
      city: '',
      country: 'US',
      rating: '',
      reviews: '',
      description: '',
      business_status: 'OPERATIONAL',
      full_address: '',
    })
  }

  return leads
}

function parseCsv(buffer: Buffer): RawLead[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Papa = require('papaparse') as typeof import('papaparse')
  const result = Papa.parse(buffer.toString('utf-8'), {
    header: true,
    skipEmptyLines: true,
  })
  const rows = result.data as Record<string, string>[]

  return rows.map(row => {
    const vals = Object.values(row).map(v => String(v || '').trim())
    const email = vals.find(v => looksLikeEmail(v))?.toLowerCase() || ''
    const site = vals.find(v => looksLikeWebsite(v)) || ''
    const name = String(
      row.name || row.business_name || row['Business Name'] ||
      row.title || row.category || row.owner_title || ''
    ).trim()

    return {
      business_name: name,
      name_for_emails: name,
      site, email,
      phone: String(row.phone || row.Phone || ''),
      city: String(row.city || row.City || ''),
      country: String(row.country || row.Country || 'US'),
      rating: String(row.rating || ''),
      reviews: String(row.reviews || ''),
      description: String(row.description || ''),
      business_status: String(row.business_status || ''),
      full_address: String(row.full_address || ''),
    }
  }).filter(r => r.business_name && r.email)
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const fileName = file.name.toLowerCase()

    let raw: RawLead[] = []

    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      raw = parseOutscraperXlsx(buffer)
    } else if (fileName.endsWith('.csv')) {
      raw = parseCsv(buffer)
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload CSV or XLSX.' },
        { status: 400 }
      )
    }

    if (raw.length === 0) {
      return NextResponse.json(
        { error: 'No leads found in file. Check the file has business name and email columns.' },
        { status: 400 }
      )
    }

    // Clean: remove missing/invalid emails and duplicates
    const clean: CleanedLead[] = []
    const removed: RemovedLead[] = []
    const seen = new Set<string>()
    const stats = { total: raw.length, kept: 0, noEmail: 0, duplicates: 0 }

    for (const lead of raw) {
      const email = lead.email?.trim().toLowerCase() || ''

      if (!email || !looksLikeEmail(email)) {
        stats.noEmail++
        removed.push({ ...lead, _reason: email ? `Invalid email: ${email}` : 'No email' })
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
    console.error('[ParseLeads] Error:', message)
    return NextResponse.json({ error: `Parse failed: ${message}` }, { status: 500 })
  }
}
