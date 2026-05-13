'use client'

import type { CleanResult } from '@/lib/types'

interface Props {
  result: CleanResult
  onBack: () => void
  onContinue: () => void
}

export function CleanStep({ result, onBack, onContinue }: Props) {
  const { clean, removed, stats } = result

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold mb-1">Clean Leads</h2>
        <p className="text-mut text-sm">Removes only leads with no valid email and exact duplicates. Everything else passes through.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Loaded', value: stats.total, color: '' },
          { label: 'Kept', value: stats.kept, color: 'text-grn' },
          { label: 'No email', value: stats.noEmail, color: stats.noEmail > 0 ? 'text-red' : 'text-mut' },
          { label: 'Duplicates', value: stats.duplicates, color: stats.duplicates > 0 ? 'text-ylw' : 'text-mut' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-sur border border-bor rounded-lg p-4 text-center">
            <div className={`text-3xl font-bold font-mono mb-1 ${color || 'text-txt'}`}>{value}</div>
            <div className="text-mut text-xs">{label}</div>
          </div>
        ))}
      </div>

      {/* Clean leads table */}
      <div className="bg-sur border border-bor rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-bor flex items-center gap-3">
          <h3 className="font-semibold text-sm flex-1">Clean Leads</h3>
          <span className="text-xs bg-grn/15 text-grn px-2 py-0.5 rounded-full font-semibold">{clean.length} ready</span>
        </div>
        <div className="overflow-auto max-h-64">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-sur2">
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-mut">#</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-mut">Business</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-mut">Email</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-mut">City</th>
              </tr>
            </thead>
            <tbody>
              {clean.slice(0, 100).map((lead, i) => (
                <tr key={lead._id} className="border-t border-bor hover:bg-sur2/50">
                  <td className="px-3 py-2 text-mut font-mono text-[11px]">{i + 1}</td>
                  <td className="px-3 py-2 font-medium max-w-[180px] truncate">{lead.business_name}</td>
                  <td className="px-3 py-2 text-mut text-xs max-w-[200px] truncate">{lead.email}</td>
                  <td className="px-3 py-2 text-mut text-xs">{lead.city}</td>
                </tr>
              ))}
              {clean.length > 100 && (
                <tr className="border-t border-bor">
                  <td colSpan={4} className="px-3 py-2 text-center text-mut text-xs">
                    + {clean.length - 100} more leads
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Removed reasons */}
      {removed.length > 0 && (
        <div className="bg-sur border border-bor rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-bor">
            <h3 className="font-semibold text-sm text-mut">Removed ({removed.length})</h3>
          </div>
          <div className="p-3 max-h-40 overflow-y-auto space-y-1">
            {removed.slice(0, 50).map((lead, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-bor/50 last:border-0">
                <span className="text-mut truncate max-w-[200px]">{lead.business_name}</span>
                <span className="text-red ml-3 flex-shrink-0">{lead._reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={onBack} className="px-4 py-2 rounded-lg border border-bor text-sm hover:border-acc/50 transition-colors">
          ← Back
        </button>
        <button
          onClick={onContinue}
          disabled={clean.length === 0}
          className="px-5 py-2 rounded-lg bg-acc text-white text-sm font-semibold hover:bg-acc/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Continue to Generate →
        </button>
      </div>
    </div>
  )
}
