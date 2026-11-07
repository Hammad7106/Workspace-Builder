import { ProductArt } from '@/features/preview/ProductArt'
import type { SetupLine } from '@/features/workspace'
import type { BillingPeriod } from '@/features/catalog'
import { formatPrice } from '@/lib/format'

/** The setup as a receipt: artwork, name, quantity and line price for the billing period. */
export function LineItems({ lines, period }: { lines: readonly SetupLine[]; period: BillingPeriod }) {
  return (
    <ul className="divide-y divide-sand-200 rounded-2xl bg-white ring-1 ring-sand-200">
      {lines.map(({ product, quantity }) => (
        <li key={product.id} className="flex items-center gap-3 px-3 py-2.5">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-sand-100">
            <ProductArt id={product.id} className="size-9" />
          </span>
          <span className="min-w-0 flex-1 text-sm">
            <span className="block font-semibold">{product.name}</span>
            <span className="text-xs text-ink-600">
              {quantity > 1 ? `${quantity} × ${formatPrice(product.price[period])}` : 'Qty 1'}
            </span>
          </span>
          <span className="text-sm font-semibold whitespace-nowrap">{formatPrice(product.price[period] * quantity)}</span>
        </li>
      ))}
    </ul>
  )
}
