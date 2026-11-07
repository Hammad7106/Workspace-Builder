import { ArrowRight } from 'lucide-react'
import { useId } from 'react'
import { BillingToggle } from '@/features/builder/BillingToggle'
import { useSetupLines, useWorkspaceState } from '@/features/workspace'
import { calculateTermTotal, MAX_TERM, periodLabel } from './checkout'
import { LineItems } from './LineItems'
import { OrderTotals } from './OrderTotals'
import { primaryButton, secondaryButton, StepLayout } from './StepLayout'

interface ReviewStepProps {
  term: number
  onTermChange: (term: number) => void
  onContinue: () => void
  onEditSetup: () => void
}

/** Step 1: check the setup, pick weekly/monthly billing and how long to rent for. */
export function ReviewStep({ term, onTermChange, onContinue, onEditSetup }: ReviewStepProps) {
  const termId = useId()
  const state = useWorkspaceState()
  const lines = useSetupLines()
  const totals = calculateTermTotal(state, term)

  return (
    <StepLayout
      footer={
        <>
          <button type="button" onClick={onEditSetup} className={secondaryButton}>
            Edit setup
          </button>
          <button type="button" onClick={onContinue} className={primaryButton}>
            Continue
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </>
      }
    >
      <LineItems lines={lines} period={state.billingPeriod} />

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-1.5 text-xs font-semibold text-ink-600">Billing</p>
          <BillingToggle />
        </div>
        <div>
          <label htmlFor={termId} className="mb-1.5 block text-xs font-semibold text-ink-600">
            Rental length
          </label>
          <select
            id={termId}
            value={term}
            onChange={(event) => onTermChange(Number(event.target.value))}
            className="rounded-full border border-sand-300 bg-white px-3 py-1.5 text-sm font-semibold"
          >
            {Array.from({ length: MAX_TERM }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {periodLabel(state.billingPeriod, n)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <OrderTotals
          period={state.billingPeriod}
          term={term}
          total={totals.total}
          termTotal={totals.termTotal}
          savings={totals.savings}
        />
      </div>
    </StepLayout>
  )
}
