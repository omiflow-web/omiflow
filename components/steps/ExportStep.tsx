'use client'

import type { GeneratedLead, ExportRow } from '@/lib/types'

interface Props {
  approved: GeneratedLead[]
  onBack: () => void
}

interface ValidationResult {
  lead: GeneratedLead
  passed: boolean
  issues: string[]
}

const BANNED = ['i hope this finds you','i wanted to reach out','game-changing','touch base','feel free','happy to help']

function validateLead(g: GeneratedLead): ValidationResult {
  const issues: string[] = []

  g.emails.forEach((e, i) => {
    if (!e.subject || e.subject.length < 2) issues.push(`Email ${i + 1}: missing subject`)
    if ((e.body || '').includes('[DEMO_LINK_PLACEHOLDER]')) issues.push(`Email ${i + 1}: demo link not replaced`)
    if (/[—–]/.test(e.body || '') || /[—–]/.test(e.subject || '')) issues.push(`Email ${i + 1}: contains em/en dash`)
    const words = (e.body || '').trim().split(/\s+/).filter(Boolean).length
    if (words < 20) issues.push(`Email ${i + 1}: too short (${words} words)`)
    BANNED.forEach(phrase => {
      if ((e.body || '').toLowerCase().includes(phrase)) {
        issues.push(`Email ${i + 1}: contains banned phrase "${phrase}"`)
      }
    })
  })

  if (!g.demoUrl) issues.push('No live demo URL — Netlify deploy failed')
  if (!g.lead.email) issues.push('Missing email address')

  return { lead: g, passed: issues.length === 0, issues }
}

export function ExportStep({ approved, onBack }: Props) {
  const validations = approved.map(validateLead)
  const passing = validations.filter(v => v.passed)
  const failing = validations.filter(v => !v.passed)

  function downloadCSV() {
    const rows: ExportRow[] = passing.map(({ lead: g }) => ({
      'Business Name': g.lead.business_name,
      Email: g.lead.email,
      Website: g.lead.site || '',
      City: g.lead.city || '',
      Niche: g.niche,
      'Demo URL': g.demoUrl || '',
      'Subject 1': g.emails[0]?.subject || '',
      'Body 1': g.emails[0]?.body || '',
      'Subject 2': g.emails[1]?.subject || '',
      'Body 2': g.emails[1]?.body || '',
      'Subject 3': g.emails[2]?.subject || '',
      'Body 3': g.emails[2]?.body || '',
      'Subject 4': g.emails[3]?.subject || '',
      'Body 4': g.emails[3]?.body || '',
    }))

    const headers = Object.keys(rows[0]) as (keyof ExportRow)[]
    const csvContent = [
      headers.join(','),
      ...rows.map(row =>
        headers.map(h => {
          const val = String(row[h] || '').replace(/"/g, '""')
          return `"${val}"`
        }).join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `omiflow-export-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold mb-1">Export for Instantly</h2>
        <p className="text-mut text-sm">
          Quality check runs automatically. Only leads that pass all checks are included in the CSV.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-sur border border-grn/30 rounded-xl p-5 text-center">
          <div className="text-4xl font-bold text-grn font-mono mb-1">{passing.length}</div>
          <div className="text-mut text-sm">Passing quality check</div>
        </div>
        <div className="bg-sur border border-bor rounded-xl p-5 text-center">
          <div className={`text-4xl font-bold font-mono mb-1 ${failing.length > 0 ? 'text-red' : 'text-mut'}`}>
            {failing.length}
          </div>
          <div className="text-mut text-sm">Need attention</div>
        </div>
      </div>

      {/* Failing leads */}
      {failing.length > 0 && (
        <div className="bg-sur border border-red/20 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-red/20 bg-red/5">
            <h3 className="font-semibold text-sm text-red">Issues found — these leads will not be exported</h3>
          </div>
          <div className="divide-y divide-bor/50">
            {failing.map(({ lead, issues }) => (
              <div key={lead.lead._id} className="px-4 py-3">
                <div className="font-medium text-sm mb-1">{lead.lead.business_name}</div>
                {issues.map((issue, i) => (
                  <div key={i} className="text-red text-xs">• {issue}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Passing leads table */}
      {passing.length > 0 && (
        <div className="bg-sur border border-bor rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-bor flex items-center justify-between">
            <h3 className="font-semibold text-sm">Ready to export</h3>
            <span className="text-xs bg-grn/15 text-grn px-2 py-0.5 rounded-full font-semibold">{passing.length}</span>
          </div>
          <div className="overflow-auto max-h-64">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-sur2">
                  <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-mut">#</th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-mut">Business</th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-mut">Email</th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-mut">Demo URL</th>
                </tr>
              </thead>
              <tbody>
                {passing.map(({ lead: g }, i) => (
                  <tr key={g.lead._id} className="border-t border-bor hover:bg-sur2/50">
                    <td className="px-3 py-2 text-mut font-mono text-[11px]">{i + 1}</td>
                    <td className="px-3 py-2 font-medium max-w-[180px] truncate">{g.lead.business_name}</td>
                    <td className="px-3 py-2 text-mut text-xs max-w-[180px] truncate">{g.lead.email}</td>
                    <td className="px-3 py-2">
                      {g.demoUrl ? (
                        <a href={g.demoUrl} target="_blank" rel="noopener noreferrer"
                          className="text-grn text-xs hover:underline">Live ↗</a>
                      ) : (
                        <span className="text-red text-xs">None</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Instantly instructions */}
      <div className="bg-sur2 rounded-xl p-4 text-sm space-y-2">
        <p className="font-semibold">How to upload to Instantly</p>
        <ol className="text-mut text-sm space-y-1 list-decimal list-inside">
          <li>Instantly → Campaign → Leads → Import CSV</li>
          <li>Map: Email, Business Name (Company), Demo URL (custom variable)</li>
          <li>Map Subject 1 + Body 1 through Subject 4 + Body 4 to your 4 email sequence steps</li>
          <li>Demo links are already embedded in email bodies as real URLs — no variable needed</li>
          <li>Campaign stays paused until you start it manually</li>
        </ol>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack}
          className="px-4 py-2 rounded-lg border border-bor text-sm hover:border-acc/50 transition-colors">
          ← Back
        </button>
        <button
          onClick={downloadCSV}
          disabled={passing.length === 0}
          className="px-5 py-2 rounded-lg bg-acc text-white text-sm font-semibold hover:bg-acc/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Download CSV for Instantly ({passing.length} leads)
        </button>
      </div>
    </div>
  )
}
