import { Minus, Plus } from 'lucide-react'

interface QuantityStepperProps {
  /** Product name, used to label the buttons for screen readers. */
  label: string
  quantity: number
  canAdd: boolean
  onAdd: () => void
  onRemove: () => void
}

const buttonClass =
  'grid size-8 place-items-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-40'

/** "Add" button that turns into a − / count / + stepper once the item is in the setup. */
export function QuantityStepper({ label, quantity, canAdd, onAdd, onRemove }: QuantityStepperProps) {
  if (quantity === 0) {
    return (
      <button
        type="button"
        onClick={onAdd}
        disabled={!canAdd}
        aria-label={`Add ${label}`}
        className="inline-flex items-center gap-1 rounded-full bg-jungle-900 px-3.5 py-1.5 text-xs font-bold text-sand-50 transition hover:bg-jungle-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus className="size-3.5" aria-hidden />
        Add
      </button>
    )
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-jungle-50 p-0.5 ring-1 ring-jungle-200">
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove one ${label}`}
        className={`${buttonClass} text-jungle-900 hover:bg-jungle-100`}
      >
        <Minus className="size-3.5" aria-hidden />
      </button>
      <output aria-live="polite" aria-label={`${label} quantity`} className="w-5 text-center text-sm font-bold">
        {quantity}
      </output>
      <button
        type="button"
        onClick={onAdd}
        disabled={!canAdd}
        aria-label={`Add another ${label}`}
        className={`${buttonClass} bg-jungle-900 text-sand-50 hover:bg-jungle-700`}
      >
        <Plus className="size-3.5" aria-hidden />
      </button>
    </div>
  )
}
