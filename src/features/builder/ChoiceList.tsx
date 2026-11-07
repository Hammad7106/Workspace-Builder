import { Check } from 'lucide-react'
import type { BillingPeriod, Product } from '@/features/catalog'
import { ProductCardBody } from './ProductCardBody'

interface ChoiceListProps<P extends Product> {
  products: readonly P[]
  selectedId: P['id'] | null
  period: BillingPeriod
  /** Called with the product's id, or null when the selected product is clicked again. */
  onSelect: (id: P['id'] | null) => void
}

/** Pick-one list for desks and chairs. Clicking the selected card clears it. */
export function ChoiceList<P extends Product>({ products, selectedId, period, onSelect }: ChoiceListProps<P>) {
  return (
    <ul className="flex flex-col gap-2">
      {products.map((product) => {
        const isSelected = product.id === selectedId
        return (
          <li key={product.id}>
            <button
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(isSelected ? null : product.id)}
              className="relative w-full rounded-2xl border-2 border-transparent bg-white p-3 shadow-sm ring-1 ring-sand-200 transition hover:ring-sand-300 aria-pressed:border-jungle-500 aria-pressed:bg-jungle-50 aria-pressed:ring-0"
            >
              <ProductCardBody product={product} period={period} />
              {isSelected && (
                <span className="absolute -top-2 -left-2 grid size-6 place-items-center rounded-full bg-jungle-500 text-white shadow">
                  <Check className="size-3.5" strokeWidth={3} aria-hidden />
                </span>
              )}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
