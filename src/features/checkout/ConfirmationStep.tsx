import { PartyPopper } from 'lucide-react'
import { formatPrice } from '@/lib/format'
import type { RentalConfirmation } from './api'
import { periodLabel, type RentalRequest } from './checkout'
import { primaryButton, secondaryButton, StepLayout } from './StepLayout'

const dateFormat = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

/** Formats a yyyy-mm-dd local date, e.g. "Monday 9 November". */
function formatDeliveryDate(isoDate: string) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return dateFormat.format(new Date(year, month - 1, day))
}

interface ConfirmationStepProps {
  confirmation: RentalConfirmation
  request: RentalRequest
  onStartOver: () => void
  onClose: () => void
}

/** Step 3: the request is in. Recap what happens next. */
export function ConfirmationStep({ confirmation, request, onStartOver, onClose }: ConfirmationStepProps) {
  const firstName = request.customer.name.split(/\s+/)[0]

  return (
    <StepLayout
      footer={
        <>
          <button type="button" onClick={onClose} className={secondaryButton}>
            Back to my setup
          </button>
          <button type="button" onClick={onStartOver} className={primaryButton}>
            Start a new setup
          </button>
        </>
      }
    >
      <div className="flex flex-col items-center py-4 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-jungle-100 text-jungle-700">
          <PartyPopper className="size-7" aria-hidden />
        </span>
        <p className="mt-3 text-sm text-ink-600">
          Reference <strong className="font-mono text-ink-900">{confirmation.reference}</strong>
        </p>
        <p className="mt-3 max-w-sm text-sm text-ink-600">
          Thanks, {firstName}! We'll message you on WhatsApp at <strong>{request.customer.phone}</strong> to
          confirm delivery to <strong>{request.delivery.area}</strong> on{' '}
          <strong>{formatDeliveryDate(request.delivery.startDate)}</strong>.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-4 text-sm ring-1 ring-sand-200">
        <ul className="space-y-1">
          {request.items.map((item) => (
            <li key={item.productId} className="flex justify-between gap-3">
              <span>
                {item.quantity > 1 && `${item.quantity} × `}
                {item.name}
              </span>
              <span className="text-ink-600">{formatPrice(item.unitPrice * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-sand-200 pt-2 font-bold">
          <span>Total for {periodLabel(request.billingPeriod, request.term)}</span>
          <span>{formatPrice(request.termTotal)}</span>
        </div>
      </div>
    </StepLayout>
  )
}
