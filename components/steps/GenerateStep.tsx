'use client'

import { useState, useRef, useCallback } from 'react'
import type { Campaign, CleanedLead, GeneratedLead } from '@/lib/types'

interface Props {
  leads: CleanedLead[]
  campaign: Campaign
  onBack: () => void
  onContinue: (results: GeneratedLead[]) => void
}

interface LogEntry {
  text: string
  type: 'ok' | 'err' | 'warn' | 'info'
}

export function GenerateStep({ leads, campaign, onBack, onContinue }: Props) {
  const [running, setRunning] = useState(false)
  const [stopped, setStopped] = useState(false)
  const [progress, setProgress] = useState({ done: 0, total: 0, ok: 0, err: 0 })
  const [log, setLog] = useState<LogEntry[]>([])
  const [results, setResults] = useState<GeneratedLead[]>([])
  const [batchSize, setBatchSize] = useState(10)
  const [startFrom, setStartFrom] = useState(1)
  const stopRef = useRef(false)
  const logRef = useRef<HTMLDivElement>(null)

  function addLog(text: string, type: LogEntry['type'] = 'info') {
    const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    setLog(prev => [...prev.slice(-200), { text: `[${time}] ${text}`, type }])
    setTimeout(() => {
      if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
    }, 50)
  }

  async function startGeneration() {
    const batch = leads.slice(startFrom - 1, startFrom - 1 + batchSize)
    if (!batch.length) return

    setRunning(true)
    setStopped(false)
    stopRef.current = false
    setProgress({ done: 0, total: batch.length, ok: 0, err: 0 })
    setLog([])

    const batchResults: GeneratedLead[] = []
    let ok = 0, err = 0

    for (let i = 0; i < batch.length; i++) {
      if (stopRef.current) { addLog('Stopped by user', 'warn'); break }

      const lead = batch[i]
      addLog(`[${i + 1}/${batch.length}] ${lead.business_name}...`, 'info')

      try {
        const resp = await fetch('/api/generate-lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lead,
            campaign,
            vapiPublicKey: process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY,
            vapiAssistantId: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID,
          }),
        })

        const data = await resp.json()

        if (!resp.ok || !data.success) {
          throw new Error(data.error || `HTTP ${resp.status}`)
        }

        const result = data.result as GeneratedLead
        batchResults.push(result)
        ok++

        const demoStatus = result.demoUrl ? `✓ Demo: ${result.demoUrl.slice(0, 40)}...` : '⚠ No demo URL'
        addLog(`✓ ${lead.business_name} — ${result.niche}`, 'ok')
        addLog(`  ${demoStatus}`, result.demoUrl ? 'ok' : 'warn')

      } catch (e) {
        err++
        const msg = e instanceof Error ? e.message : String(e)

        // Parse rate limit JSON
        let display = msg
        try {
          const ej = JSON.parse(msg)
          if (ej.windows?.['5h']) {
            const resetTs = ej.windows['5h'].resets_at
            const resetTime = new Date(resetTs * 1000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
            display = `Claude API 5-hour limit reached. Resets at ${resetTime}. Stop and resume then.`
            stopRef.current = true
          }
        } catch (_) {}

        addLog(`✗ ${lead.business_name}: ${display}`, 'err')
      }

      setProgress({ done: i + 1, total: batch.length, ok, err })

      // Delay between leads to respect rate limits
      if (i < batch.length - 1 && !stopRef.current) {
        await new Promise(r => setTimeout(r, 3000))
      }
    }

    // Auto-save batch results
    if (batchResults.length > 0) {
      setResults(prev => {
        const map = new Map(prev.map(g => [g.lead.email, g]))
        batchResults.forEach(r => map.set(r.lead.email, r))
        return Array.from(map.values())
      })
      addLog(`Batch complete — ${ok} generated, ${err} errors`, ok > 0 ? 'ok' : 'err')

      // Check for missing demo URLs
      const noDemoUrls = batchResults.filter(r => !r.demoUrl).map(r => r.lead.business_name)
      if (noDemoUrls.length > 0) {
        addLog(`⚠ ${noDemoUrls.length} lead(s) have no demo URL: ${noDemoUrls.slice(0, 3).join(', ')}`, 'warn')
      }
    }

    setRunning(false)
    // Advance start position for next batch
    setStartFrom(prev => prev + batchSize)
  }

  const pct = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold mb-1">Generate Emails + Demos</h2>
        <p className="text-mut text-sm">
          Claude visits each website, writes 4 personalised emails, builds and deploys a live demo, then injects the URL into every email.
          All API calls happen server-side — no CORS issues.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-sur border border-bor rounded-xl p-4 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm text-mut">Batch size:</label>
          <select
            value={batchSize}
            onChange={e => setBatchSize(Number(e.target.value))}
            disabled={running}
            className="bg-bg border border-bor rounded-lg px-3 py-1.5 text-sm outline-none focus:border-acc"
          >
            <option value={3}>3 (test)</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-mut">Start from #:</label>
          <input
            type="number"
            value={startFrom}
            onChange={e => setStartFrom(Math.max(1, Number(e.target.value)))}
            disabled={running}
            min={1}
            max={leads.length}
            className="w-20 bg-bg border border-bor rounded-lg px-3 py-1.5 text-sm outline-none focus:border-acc"
          />
        </div>
        <div className="text-xs text-mut">{leads.length} clean leads total</div>
        <div className="ml-auto flex gap-2">
          {!running ? (
            <button
              onClick={startGeneration}
              className="px-5 py-2 bg-acc text-white text-sm font-semibold rounded-lg hover:bg-acc/80 transition-colors"
            >
              Start Generation
            </button>
          ) : (
            <button
              onClick={() => { stopRef.current = true; setStopped(true) }}
              className="px-5 py-2 bg-red/20 text-red border border-red/30 text-sm font-semibold rounded-lg hover:bg-red/30 transition-colors"
            >
              Stop
            </button>
          )}
        </div>
      </div>

      {/* Progress */}
      {progress.total > 0 && (
        <div>
          <div className="flex justify-between text-xs text-mut mb-2">
            <span>{progress.done} / {progress.total}</span>
            <span className="text-grn">{progress.ok} ok</span>
            {progress.err > 0 && <span className="text-red">{progress.err} errors</span>}
          </div>
          <div className="bg-bor rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-acc to-acc2 rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {/* Log */}
      <div ref={logRef} className="log-box">
        {log.length === 0 ? (
          <div className="text-mut">Ready. Click Start Generation to begin.</div>
        ) : (
          log.map((entry, i) => (
            <div key={i} className={`leading-5 log-${entry.type}`}>{entry.text}</div>
          ))
        )}
      </div>

      {/* Results table */}
      {results.length > 0 && (
        <div className="bg-sur border border-bor rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-bor flex items-center gap-3">
            <h3 className="font-semibold text-sm flex-1">Generated</h3>
            <span className="text-xs bg-grn/15 text-grn px-2 py-0.5 rounded-full font-semibold">{results.length}</span>
          </div>
          <div className="overflow-auto max-h-64">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-sur2">
                  <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-mut">#</th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-mut">Business</th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-mut">Niche</th>
                  <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-mut">Demo</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={r.lead._id} className="border-t border-bor hover:bg-sur2/50">
                    <td className="px-3 py-2 text-mut font-mono text-[11px]">{i + 1}</td>
                    <td className="px-3 py-2 font-medium max-w-[200px] truncate">{r.lead.business_name}</td>
                    <td className="px-3 py-2 text-mut text-xs max-w-[150px] truncate">{r.niche}</td>
                    <td className="px-3 py-2">
                      {r.demoUrl ? (
                        <a href={r.demoUrl} target="_blank" rel="noopener noreferrer"
                          className="text-grn text-xs hover:underline">Live ↗</a>
                      ) : (
                        <span className="text-red text-xs">No URL</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={onBack} disabled={running}
          className="px-4 py-2 rounded-lg border border-bor text-sm hover:border-acc/50 disabled:opacity-40 transition-colors">
          ← Back
        </button>
        <button
          onClick={() => onContinue(results)}
          disabled={results.length === 0}
          className="px-5 py-2 rounded-lg bg-acc text-white text-sm font-semibold hover:bg-acc/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Review Leads →
        </button>
      </div>
    </div>
  )
}
