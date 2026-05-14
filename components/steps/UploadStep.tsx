'use client'

import { useState, useRef } from 'react'
import type { Campaign, CleanResult } from '@/lib/types'

interface Props {
  campaign: Campaign
  onCampaignChange: (c: Campaign) => void
  onLeadsParsed: (result: CleanResult) => void
}

export function UploadStep({ campaign, onCampaignChange, onLeadsParsed }: Props) {
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    const name = file.name.toLowerCase()
    if (!name.endsWith('.csv') && !name.endsWith('.xlsx') && !name.endsWith('.xls')) {
      setError('Please upload a CSV or XLSX file')
      return
    }

    setLoading(true)
    setError('')

    try {
      const fd = new FormData()
      fd.append('file', file)

      const resp = await fetch('/api/parse-leads', { method: 'POST', body: fd })

      // Always read as text first — avoid crashing on non-JSON server errors
      const text = await resp.text()
      let data: Record<string, unknown>

      try {
        data = JSON.parse(text)
      } catch (_) {
        throw new Error(
          resp.ok
            ? 'Unexpected server response — please try again'
            : `Server error ${resp.status}: ${text.slice(0, 200)}`
        )
      }

      if (!resp.ok) {
        throw new Error(String(data.error) || `Server error ${resp.status}`)
      }

      onLeadsParsed(data as unknown as CleanResult)

    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold mb-1">Campaign Setup</h2>
        <p className="text-mut text-sm">Choose your campaign type, then upload your Outscraper lead list.</p>
      </div>

      {/* Campaign selector */}
      <div className="grid grid-cols-2 gap-3">
        {([
          { id: 'web' as const, icon: '🌐', title: 'Website Design', sub: 'UK niches — deploys a website demo per lead' },
          { id: 'vm' as const, icon: '📞', title: 'AI Voicemail', sub: 'US businesses — deploys a Vapi demo per lead' },
        ]).map(({ id, icon, title, sub }) => (
          <button
            key={id}
            onClick={() => onCampaignChange(id)}
            className={`p-4 rounded-xl border text-left transition-all ${
              campaign === id ? 'border-acc bg-acc/10' : 'border-bor bg-sur hover:border-acc/50'
            }`}
          >
            <div className="text-2xl mb-2">{icon}</div>
            <div className="font-semibold text-sm">{title}</div>
            <div className="text-mut text-xs mt-1">{sub}</div>
          </button>
        ))}
      </div>

      {/* Upload zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => {
          e.preventDefault()
          setDragging(false)
          const f = e.dataTransfer.files[0]
          if (f) handleFile(f)
        }}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
          dragging ? 'border-acc bg-acc/5' : 'border-bor hover:border-acc/50 bg-sur'
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />
        {loading ? (
          <div className="flex items-center justify-center gap-3 text-acc">
            <div className="w-5 h-5 border-2 border-acc border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Parsing leads...</span>
          </div>
        ) : (
          <>
            <div className="text-3xl mb-3">📂</div>
            <div className="font-semibold mb-1">Drop CSV or XLSX here</div>
            <div className="text-mut text-sm">Outscraper exports accepted — all column layouts handled</div>
          </>
        )}
      </div>

      {error && (
        <div className="bg-red/10 border border-red/30 rounded-lg p-3 text-red text-sm">{error}</div>
      )}

      {/* Required keys info */}
      <div className="bg-sur2 rounded-lg p-4 text-xs text-mut space-y-1">
        <p className="text-txt font-semibold text-sm mb-2">Environment variables required</p>
        <p><code className="text-acc">ANTHROPIC_API_KEY</code> — Claude API key (sk-ant-...)</p>
        <p><code className="text-acc">NETLIFY_TOKEN</code> — from netlify.com → User Settings → Access tokens</p>
        {campaign === 'vm' && (
          <>
            <p><code className="text-acc">NEXT_PUBLIC_VAPI_PUBLIC_KEY</code> — from your Vapi dashboard</p>
            <p><code className="text-acc">NEXT_PUBLIC_VAPI_ASSISTANT_ID</code> — assistant UUID from Vapi</p>
          </>
        )}
        <p className="text-mut/60 mt-2">Set these in Vercel → Project Settings → Environment Variables</p>
      </div>
    </div>
  )
}
