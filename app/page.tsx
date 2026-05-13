'use client'

import { useState, useRef, useCallback } from 'react'
import type { Campaign, CleanResult, CleanedLead, GeneratedLead } from '@/lib/types'
import { UploadStep } from '@/components/steps/UploadStep'
import { CleanStep } from '@/components/steps/CleanStep'
import { GenerateStep } from '@/components/steps/GenerateStep'
import { ReviewStep } from '@/components/steps/ReviewStep'
import { ExportStep } from '@/components/steps/ExportStep'

const STEPS = ['Upload', 'Clean', 'Generate', 'Review', 'Export']

export default function OmiflowApp() {
  const [step, setStep] = useState(1)
  const [campaign, setCampaign] = useState<Campaign>('web')
  const [cleanResult, setCleanResult] = useState<CleanResult | null>(null)
  const [generated, setGenerated] = useState<GeneratedLead[]>([])

  const approved = generated.filter(g => g.reviewStatus === 'approved')

  function goTo(n: number) {
    if (n > 1 && !cleanResult) return
    if (n > 2 && !cleanResult?.clean.length) return
    if (n > 3 && !generated.length) return
    setStep(n)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-sur border-b border-bor px-5 py-3 flex items-center gap-4 flex-wrap">
        <div className="text-lg font-bold bg-gradient-to-r from-acc to-acc2 bg-clip-text text-transparent">
          Omiflow
        </div>

        {/* Step nav */}
        <nav className="flex gap-2 flex-1 justify-center flex-wrap">
          {STEPS.map((label, i) => {
            const n = i + 1
            const isActive = step === n
            const isDone = step > n
            return (
              <button
                key={n}
                onClick={() => goTo(n)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all ${
                  isActive
                    ? 'bg-acc border-acc text-white'
                    : isDone
                    ? 'border-grn text-grn'
                    : 'border-bor text-mut cursor-default'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isActive ? 'bg-white/20' : isDone ? 'bg-grn text-black' : 'bg-bor'
                }`}>
                  {isDone ? '✓' : n}
                </span>
                {label}
              </button>
            )
          })}
        </nav>

        {/* Stats */}
        <div className="flex gap-3 text-[11px] text-mut flex-shrink-0">
          <span>Loaded <b className="text-txt">{cleanResult?.stats.total ?? 0}</b></span>
          <span>Clean <b className="text-txt">{cleanResult?.stats.kept ?? 0}</b></span>
          <span>Generated <b className="text-txt">{generated.length}</b></span>
          <span>Approved <b className="text-txt">{approved.length}</b></span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-5 py-6">
        {step === 1 && (
          <UploadStep
            campaign={campaign}
            onCampaignChange={setCampaign}
            onLeadsParsed={(result) => {
              setCleanResult(result)
              setStep(2)
            }}
          />
        )}
        {step === 2 && cleanResult && (
          <CleanStep
            result={cleanResult}
            onBack={() => setStep(1)}
            onContinue={() => setStep(3)}
          />
        )}
        {step === 3 && cleanResult && (
          <GenerateStep
            leads={cleanResult.clean}
            campaign={campaign}
            onBack={() => setStep(2)}
            onContinue={(results) => {
              setGenerated(prev => {
                const map = new Map(prev.map(g => [g.lead.email, g]))
                results.forEach(r => map.set(r.lead.email, r))
                return Array.from(map.values())
              })
              setStep(4)
            }}
          />
        )}
        {step === 4 && (
          <ReviewStep
            generated={generated}
            onBack={() => setStep(3)}
            onUpdate={(updated) => setGenerated(updated)}
            onContinue={() => setStep(5)}
          />
        )}
        {step === 5 && (
          <ExportStep
            approved={approved}
            onBack={() => setStep(4)}
          />
        )}
      </main>
    </div>
  )
}
