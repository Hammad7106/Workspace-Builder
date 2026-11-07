import { Dices } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  selectIsEmpty,
  selectIsSameSetup,
  selectQuote,
  useWorkspaceActions,
  useWorkspaceState,
  type WorkspaceState,
} from '@/features/workspace'
import { formatPrice } from '@/lib/format'
import { PRESETS, presetToSetup, surpriseSetup } from './presets'

const UNIT = { week: 'wk', month: 'mo' } as const

const chipClass =
  'inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-ink-900 shadow-sm ring-1 ring-sand-300 transition hover:bg-white aria-pressed:bg-jungle-900 aria-pressed:text-sand-50 aria-pressed:ring-jungle-900'

/** One-tap starting points: curated presets and a random "Surprise me", with undo. */
export function QuickStart() {
  const state = useWorkspaceState()
  const { loadSetup } = useWorkspaceActions()
  const [undo, setUndo] = useState<{ label: string; previous: WorkspaceState } | null>(null)

  useEffect(() => {
    if (!undo) return
    const timer = setTimeout(() => setUndo(null), 8000)
    return () => clearTimeout(timer)
  }, [undo])

  const replaceSetup = (next: WorkspaceState, label: string) => {
    // Only offer undo when there was a setup worth getting back.
    setUndo(selectIsEmpty(state) ? null : { label, previous: state })
    loadSetup(next)
  }

  return (
    <div className="mt-2 sm:mt-3">
      <div
        role="group"
        aria-label="Quick start setups"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:-mx-6 sm:flex-wrap sm:px-6"
      >
        {PRESETS.map((preset) => {
          const setup = presetToSetup(preset, state.billingPeriod)
          const isActive = selectIsSameSetup(setup, state)
          return (
            <button
              key={preset.id}
              type="button"
              aria-pressed={isActive}
              title={preset.description}
              onClick={() => !isActive && replaceSetup(setup, preset.name)}
              className={chipClass}
            >
              {preset.name}
              <span className="font-medium opacity-70">
                {formatPrice(selectQuote(setup).total)}/{UNIT[state.billingPeriod]}
              </span>
            </button>
          )
        })}
        <button
          type="button"
          onClick={() => replaceSetup(surpriseSetup(state), 'a surprise setup')}
          className={`${chipClass} text-sunset-600`}
        >
          <Dices className="size-3.5" aria-hidden />
          Surprise me
        </button>
      </div>

      <p role="status" className="mt-1 min-h-5 text-xs text-ink-600">
        {undo && (
          <>
            Loaded {undo.label}.{' '}
            <button
              type="button"
              onClick={() => {
                loadSetup(undo.previous)
                setUndo(null)
              }}
              className="font-semibold text-sunset-600 underline underline-offset-2"
            >
              Undo
            </button>
          </>
        )}
      </p>
    </div>
  )
}
