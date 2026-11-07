import type { BillingPeriod, Price } from '@/features/catalog'
import { formatPrice } from '@/lib/format'
import { monthlySavingsPercent } from '@/lib/pricing'

const UNIT: Record<BillingPeriod, string> = { week: 'wk', month: 'mo' }

/** A product's price for the chosen billing period, with the monthly saving when relevant. */
export function PriceTag({ price, period }: { price: Price; period: BillingPeriod }) {
  const savings = period === 'month' ? monthlySavingsPercent(price) : 0

  return (
    <span className="flex flex-col items-end gap-1 text-right">
      <span className="text-sm font-bold whitespace-nowrap text-ink-900">
        {formatPrice(price[period])}
        <span className="font-medium text-ink-600">/{UNIT[period]}</span>
      </span>
      {savings > 0 && (
        <span className="rounded-full bg-jungle-100 px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap text-jungle-700">
          Save {savings}%
        </span>
      )}
    </span>
  )
}
