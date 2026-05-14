'use client'

import { useState } from 'react'
import type { GeneratedLead } from '@/lib/types'

interface Props {
  generated: GeneratedLead[]
  onBack: () => void
  onUpdate: (updated: GeneratedLead[]) => void
  onContinue: () => void
}

function EmailBody({ body }: { body: string }) {
  // Render anchor tags as styled clickable links for the review panel
  const rendered = body
    .replace(
      /<a\s+href="([^"]*)"[^>]*>(.*?)<\/a>/gi,
      (_m, href, text) => {
        const isLive = href && !href.startsWith('#')
        const style = isLive
          ? 'color:#7c5cfc;text-decoration:underline;font-weight:500'
          : 'color:#fc5c7c;text-decoration:line-through'
        const suffix = isLive ? ' ↗' : ' [broken]'
        return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="${style}">${text}${suffix}</a>`
      }
    )
    .replace(/\n/g, '<br/>')

  return (
    <div
      className="px-4 py-3 text-sm leading-7"
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  )
}

export function ReviewStep({ generated, onBack, onUpdate, onContinue }: Props) {
  const [selIdx, setSelIdx] = useState(0)
  const [showDemo, setShowDemo] = useState(false)

  const selected = generated[selIdx]
  const approved = generated.filter(g => g.reviewStatus === 'approved').length

  function setStatus(idx: number, status: GeneratedLead['reviewStatus']) {
    onUpdate(generated.map((g, i) => i === idx ? { ...g, reviewStatus: status } : g))
  }

  if (!selected) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold mb-1">Review Leads</h2>
          <p className="text-mut text-sm">{approved} of {generated.length} approved</p>
        </div>
        <button
          onClick={() => onUpdate(generated.map(g => ({ ...g, reviewStatus: 'approved' as const })))}
          className="px-4 py-2 text-sm border border-grn/40 text-grn rounded-lg hover:bg-grn/10 transition-colors"
        >
          Approve All
        </button>
      </div>

      <div className="grid grid-cols-[280px_1fr] gap-4">
        {/* Sidebar */}
        <div className="bg-sur border border-bor rounded-xl overflow-hidden sticky top-20 max-h-[75vh]">
          <div className="px-3 py-2 border-b border-bor text-xs font-semibold text-mut uppercase tracking-wider">Leads</div>
          <div className="overflow-y-auto max-h-[calc(75vh-36px)]">
            {generated.map((g, i) => (
              <div
                key={g.lead._id}
                onClick={() => { setSelIdx(i); setShowDemo(false) }}
                className={`px-3 py-2.5 cursor-pointer border-b border-bor/50 last:border-0 hover:bg-sur2 transition-colors ${i === selIdx ? 'bg-acc/10 border-l-2 border-l-acc' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    g.reviewStatus === 'approved' ? 'bg-grn' :
                    g.reviewStatus === 'rejected' ? 'bg-red' : 'bg-bor'
                  }`} />
                  <span className="font-medium text-sm truncate">{g.lead.business_name}</span>
                </div>
                <div className="text-mut text-[11px] ml-4 truncate">{g.niche}</div>
                <div className="ml-4 mt-0.5">
                  {g.demoUrl
                    ? <span className="text-[10px] text-grn">● Demo verified live</span>
                    : <span className="text-[10px] text-red">● No verified demo</span>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail */}
        <div className="space-y-3">
          {/* Header bar */}
          <div className="bg-sur border border-bor rounded-xl p-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{selected.lead.business_name}</h3>
              <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                <span className="text-xs bg-acc/15 text-acc px-2 py-0.5 rounded-full">{selected.niche}</span>
                {selected.demoUrl && (
                  <a href={selected.demoUrl} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-grn hover:underline">Open live demo ↗</a>
                )}
                {!selected.demoUrl && (
                  <span className="text-xs text-red">Demo failed — regenerate this lead</span>
                )}
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => setStatus(selIdx, 'approved')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selected.reviewStatus === 'approved' ? 'bg-grn text-black' : 'border border-grn/40 text-grn hover:bg-grn/10'
                }`}
              >
                {selected.reviewStatus === 'approved' ? '✓ Approved' : 'Approve'}
              </button>
              <button
                onClick={() => setStatus(selIdx, 'rejected')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selected.reviewStatus === 'rejected' ? 'bg-red/20 text-red border border-red/30' : 'border border-bor text-mut hover:border-red/40 hover:text-red'
                }`}
              >
                Reject
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-sur border border-bor rounded-lg p-1">
            <button onClick={() => setShowDemo(false)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded transition-colors ${!showDemo ? 'bg-acc text-white' : 'text-mut hover:text-txt'}`}>
              4 Emails
            </button>
            <button onClick={() => setShowDemo(true)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded transition-colors ${showDemo ? 'bg-acc text-white' : 'text-mut hover:text-txt'}`}>
              Demo Preview
            </button>
          </div>

          {!showDemo ? (
            <div className="space-y-3">
              {selected.emails.map((email, ei) => {
                const stripped = email.body.replace(/<[^>]+>/g, ' ')
                const words = stripped.trim().split(/\s+/).filter(Boolean).length
                const limits = [90, 75, 75, 65]
                const over = words > limits[ei]
                return (
                  <div key={ei} className="bg-sur border border-bor rounded-xl overflow-hidden">
                    <div className="px-4 py-2.5 bg-sur2 border-b border-bor flex items-center justify-between">
                      <h4 className="font-semibold text-sm">Email {ei + 1} — Day {email.day}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${over ? 'bg-red/15 text-red' : 'bg-bor text-mut'}`}>
                        {words}w
                      </span>
                    </div>
                    <div className="px-4 py-2 bg-bg border-b border-bor text-[11px] font-mono text-mut">
                      Subject: {email.subject}
                    </div>
                    <EmailBody body={email.body} />
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-sur border border-bor rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 bg-sur2 border-b border-bor flex items-center justify-between">
                <h4 className="font-semibold text-sm">Demo Preview</h4>
                {selected.demoUrl && (
                  <a href={selected.demoUrl} target="_blank" rel="noopener noreferrer"
                    className="text-grn text-xs border border-grn/30 px-3 py-1 rounded-lg hover:bg-grn/10 transition-colors">
                    Open live ↗
                  </a>
                )}
              </div>
              {selected.demoUrl && (
                <div className="px-4 py-2 bg-bg border-b border-bor text-[11px] font-mono text-grn truncate">
                  {selected.demoUrl}
                </div>
              )}
              {!selected.demoUrl && (
                <div className="px-4 py-4 text-sm text-red bg-red/5">
                  Demo deploy failed for this lead. It was not generated to avoid sending a broken link.
                  Go back to Generate and regenerate this lead individually.
                </div>
              )}
              {selected.demoHtml && (
                <iframe
                  srcDoc={selected.demoHtml}
                  className="w-full h-[500px] border-0 bg-white"
                  sandbox="allow-scripts allow-same-origin"
                  title={`${selected.lead.business_name} demo`}
                />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack}
          className="px-4 py-2 rounded-lg border border-bor text-sm hover:border-acc/50 transition-colors">
          ← Back
        </button>
        <button onClick={onContinue} disabled={approved === 0}
          className="px-5 py-2 rounded-lg bg-acc text-white text-sm font-semibold hover:bg-acc/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          Export {approved} Approved →
        </button>
      </div>
    </div>
  )
}
