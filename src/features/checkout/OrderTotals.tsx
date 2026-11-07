import type { BillingPeriod } from '@/features/catalog'
import { formatPrice } from '@/lib/format'
import { periodLabel } from './checkout'

interface OrderTotalsProps {
  period: BillingPeriod
  term: number
  total: number
  termTotal: number
  /** Monthly saving vs paying weekly, per month. */
  savings: number
}

/** Price breakdown: per period, saving, and the total for the booked term. */
export function OrderTotals({ period, term, total, termTotal, savings }: OrderTotalsProps) {
  return (
    <dl className="space-y-2 rounded-2xl bg-white p-4 text-sm ring-1 ring-sand-200">
      <div className="flex justify-between gap-4">
        <dt className="text-ink-600">Rent per {period}</dt>
        <dd className="font-semibold">{formatPrice(total)}</dd>
      </div>
      {savings > 0 && (
        <div className="flex justify-between gap-4 text-jungle-700">
          <dt>Monthly saving vs weekly</dt>
          <dd className="font-semibold">−{formatPrice(savings)}/mo</dd>
        </div>
      )}
      <div className="flex justify-between gap-4 border-t border-sand-200 pt-2 text-base">
        <dt className="font-bold">Total for {periodLabel(period, term)}</dt>
        <dd className="font-extrabold">{formatPrice(termTotal)}</dd>
      </div>
      <p className="text-xs text-ink-400">
        Delivery fee is confirmed with you before delivery. Extend or end your rental anytime.
      </p>
    </dl>
  )
}
