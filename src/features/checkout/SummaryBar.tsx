import { ShoppingBag } from 'lucide-react'
import { selectIsReadyToRent, useQuote, useWorkspaceState } from '@/features/workspace'
import { formatPrice } from '@/lib/format'

/** Sticky footer with the running total and the "Rent" call-to-action. */
export function SummaryBar() {
  const state = useWorkspaceState()
  const { itemCount, total, period, savings } = useQuote()
  const isReady = selectIsReadyToRent(state)

  return (
    <div className="sticky bottom-0 z-20 border-t border-sand-200 bg-sand-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div aria-live="polite">
          <p className="text-xs text-ink-600">
            Your setup · {itemCount} {itemCount === 1 ? 'item' : 'items'}
            {savings > 0 && (
              <span className="ml-1 font-semibold text-jungle-700">
                · saving {formatPrice(savings)}/month vs weekly
              </span>
            )}
          </p>
          <p className="text-lg font-bold">
            {formatPrice(total)}
            <span className="text-sm font-medium text-ink-600"> / {period}</span>
          </p>
        </div>

        <button
          type="button"
          disabled={!isReady}
          title={isReady ? undefined : 'Pick a desk and a chair to rent your setup'}
          className="inline-flex items-center gap-2 rounded-full bg-sunset-500 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-sunset-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingBag className="size-4" aria-hidden />
          Rent your setup
        </button>
      </div>
    </div>
  )
}
