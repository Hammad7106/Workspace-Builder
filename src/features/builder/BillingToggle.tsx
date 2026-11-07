import { useWorkspaceActions, useWorkspaceState } from '@/features/workspace'
import { BILLING_PERIODS } from '@/lib/pricing'

/** Weekly / Monthly switch. Every price in the builder and summary follows it. */
export function BillingToggle() {
  const { billingPeriod } = useWorkspaceState()
  const { setBillingPeriod } = useWorkspaceActions()

  return (
    <div role="group" aria-label="Billing period" className="inline-flex rounded-full bg-sand-100 p-0.5">
      {BILLING_PERIODS.map((period) => (
        <button
          key={period.id}
          type="button"
          aria-pressed={period.id === billingPeriod}
          onClick={() => setBillingPeriod(period.id)}
          className="rounded-full px-3 py-1 text-xs font-semibold text-ink-600 transition aria-pressed:bg-white aria-pressed:text-ink-900 aria-pressed:shadow-sm"
        >
          {period.label}
        </button>
      ))}
    </div>
  )
}
