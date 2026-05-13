import type { RawLead } from './types'

const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/
const SKIP_URL = /google\.|googleusercontent|\/maps\/|facebook\.com\/\d|instagram\.com|twitter\.com|lh[0-9]\./i

function looksLikeEmail(v: string): boolean {
  return EMAIL_RE.test(v.trim()) && v.length < 100
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

function findNameCol(rows: unknown[][], headers: string[]): number {
  const nameIdxs = headers.reduce<number[]>((acc, h, i) => {
    if (/\bname\b|category|\btitle\b|business/.test(h.toLowerCase())) acc.push(i)
    return acc
  }, [])

  for (const idx of nameIdxs) {
    let hits = 0
    for (let r = 1; r <= Math.min(5, rows.length - 1); r++) {
      const v = String(rows[r][idx] || '').trim()
      if (v && v.length > 1 && v.length < 200 && !v.startsWith('http') && !EMAIL_RE.test(v) && !/^[\d.,]+$/.test(v)) {
        hits++
      }
    }
    if (hits >= 2) return idx
  }
  return -1
}

function findCol(headers: string[], terms: string[], rows: unknown[][]): number {
  for (const term of terms) {
    const idx = headers.findIndex(h => h.toLowerCase() === term)
    if (idx < 0) continue
    let hits = 0
    for (let r = 1; r <= Math.min(5, rows.length - 1); r++) {
      const v = String(rows[r][idx] || '').trim()
      if (v && v.length < 80 && !v.startsWith('http')) hits++
    }
    if (hits >= 2) return idx
  }
  return -1
}

export function parseXlsxBuffer(buffer: Buffer): RawLead[] {
  // Dynamic import to avoid SSR issues
  const XLSX = require('xlsx') as typeof import('xlsx')
  const wb = XLSX.read(buffer, { type: 'buffer' })
  const ws = wb.Sheets[wb.SheetNames[0]]
  const raw = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '', raw: false }) as unknown[][]

  if (raw.length < 2) return []

  const headers = (raw[0] as unknown[]).map(h => String(h || '').toLowerCase().trim())
  const nameCol = findNameCol(raw, headers)
  const cityCol = findCol(headers, ['city', 'town'], raw)
  const countryCol = findCol(headers, ['country'], raw)
  const phoneCol = findCol(headers, ['phone', 'phone_1', 'telephone'], raw)
  const ratingCol = findCol(headers, ['rating', 'stars'], raw)
  const reviewsCol = findCol(headers, ['reviews', 'reviews_count', 'review_count'], raw)

  const leads: RawLead[] = []

  for (let rowIdx = 1; rowIdx < raw.length; rowIdx++) {
    const row = raw[rowIdx] as unknown[]
    const emails: string[] = []
    const sites: string[] = []
    let name = '', city = '', country = 'UK', phone = '', rating = '', reviews = ''

    row.forEach((val, i) => {
      const v = String(val || '').trim()
      if (!v || v.length > 400) return

      if (looksLikeEmail(v)) { emails.push(v.toLowerCase()); return }
      if (looksLikeWebsite(v)) { sites.push(v); return }

      if (i === nameCol && !name) { name = v; return }
      if (i === cityCol && !city && v.length < 80) { city = v; return }
      if (i === countryCol && !country && v.length < 80) { country = v; return }
      if (i === phoneCol && !phone && /^[\d\s+\-.()\[\]]{7,20}$/.test(v)) { phone = v; return }
      if (i === ratingCol && !rating && !isNaN(parseFloat(v))) { rating = v; return }
      if (i === reviewsCol && !reviews && !isNaN(parseInt(v))) { reviews = v; return }
    })

    if (!name && emails[0]) {
      name = emails[0].split('@')[1]?.split('.')[0]?.replace(/[-_]/g, ' ') || ''
    }

    if (!name && !emails[0]) continue

    leads.push({
      business_name: name.trim(),
      name_for_emails: name.trim(),
      site: sites[0] || '',
      email: emails[0] || '',
      phone, city, country: country || 'UK',
      rating, reviews, description: '', business_status: '', full_address: '',
    })
  }

  return leads
}

export function parseCsvString(csv: string): RawLead[] {
  const Papa = require('papaparse') as typeof import('papaparse')
  const result = Papa.parse(csv, { header: true, skipEmptyLines: true })
  const rows = result.data as Record<string, string>[]

  return rows.map(row => {
    const allVals = Object.values(row).map(v => String(v || '').trim().toLowerCase())
    const email = allVals.find(v => looksLikeEmail(v)) || ''
    const site = Object.values(row).map(v => String(v || '').trim()).find(v => looksLikeWebsite(v)) || ''
    const name = String(row.name || row.business_name || row['Business Name'] || row.title || row.category || '')

    return {
      business_name: name,
      name_for_emails: String(row.name_for_emails || name),
      site, email, phone: String(row.phone || row.Phone || ''),
      rating: String(row.rating || ''), reviews: String(row.reviews || ''),
      city: String(row.city || row.City || ''), country: String(row.country || row.Country || 'UK'),
      description: String(row.description || ''), business_status: String(row.business_status || ''),
      full_address: String(row.full_address || ''),
    }
  }).filter(r => r.business_name || r.email)
}
