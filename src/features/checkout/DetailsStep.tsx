import { ArrowLeft, LoaderCircle, Send } from 'lucide-react'
import { useId, useState, type FormEvent } from 'react'
import { useWorkspaceState } from '@/features/workspace'
import { formatPrice } from '@/lib/format'
import { submitRentalRequest, type RentalConfirmation } from './api'
import {
  buildRentalRequest,
  calculateTermTotal,
  DELIVERY_AREAS,
  earliestStartDate,
  periodLabel,
  validateDetails,
  type CustomerDetails,
  type RentalRequest,
} from './checkout'
import { Field, inputClass } from './Field'
import { primaryButton, secondaryButton, StepLayout } from './StepLayout'

interface DetailsStepProps {
  term: number
  details: CustomerDetails
  onDetailsChange: (details: CustomerDetails) => void
  onBack: () => void
  onSubmitted: (confirmation: RentalConfirmation, request: RentalRequest) => void
}

type Status = 'idle' | 'submitting' | 'error'

/** Step 2: contact and delivery details, validated on blur and on submit. */
export function DetailsStep({ term, details, onDetailsChange, onBack, onSubmitted }: DetailsStepProps) {
  const formId = useId()
  const fieldId = (name: keyof CustomerDetails) => `${formId}-${name}`
  const state = useWorkspaceState()
  const [touched, setTouched] = useState<Partial<Record<keyof CustomerDetails, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  // Captured once so validation and the date picker agree for the whole visit.
  const [today] = useState(() => new Date())

  const errors = validateDetails(details, today)
  const errorFor = (name: keyof CustomerDetails) => (submitted || touched[name] ? errors[name] : undefined)
  const { termTotal } = calculateTermTotal(state, term)

  const bind = (name: Exclude<keyof CustomerDetails, 'area'>) => ({
    value: details[name],
    onChange: (event: { target: { value: string } }) => onDetailsChange({ ...details, [name]: event.target.value }),
    onBlur: () => setTouched((t) => ({ ...t, [name]: true })),
  })

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitted(true)

    const firstInvalid = (Object.keys(errors) as (keyof CustomerDetails)[])[0]
    if (firstInvalid) {
      document.getElementById(fieldId(firstInvalid))?.focus()
      return
    }

    setStatus('submitting')
    try {
      const request = buildRentalRequest(state, term, details)
      onSubmitted(await submitRentalRequest(request), request)
    } catch {
      setStatus('error')
    }
  }

  const isSubmitting = status === 'submitting'

  return (
    <StepLayout
      footer={
        <>
          <button type="button" onClick={onBack} disabled={isSubmitting} className={secondaryButton}>
            <ArrowLeft className="size-4" aria-hidden />
            Back
          </button>
          <button type="submit" form={formId} disabled={isSubmitting} className={primaryButton}>
            {isSubmitting ? (
              <LoaderCircle className="size-4 motion-safe:animate-spin" aria-hidden />
            ) : (
              <Send className="size-4" aria-hidden />
            )}
            {isSubmitting ? 'Sending…' : 'Send rental request'}
          </button>
        </>
      }
    >
      <p className="mb-4 rounded-xl bg-jungle-50 px-3 py-2 text-xs text-jungle-900">
        {periodLabel(state.billingPeriod, term)} · <strong>{formatPrice(termTotal)}</strong> total. Nothing is
        charged now: we confirm everything with you on WhatsApp first.
      </p>

      <form id={formId} noValidate onSubmit={handleSubmit} className="space-y-3">
        <Field id={fieldId('name')} label="Full name" error={errorFor('name')}>
          {(aria) => <input {...aria} {...bind('name')} autoComplete="name" className={inputClass} />}
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field id={fieldId('email')} label="Email" error={errorFor('email')}>
            {(aria) => (
              <input {...aria} {...bind('email')} type="email" autoComplete="email" className={inputClass} />
            )}
          </Field>
          <Field id={fieldId('phone')} label="WhatsApp number" error={errorFor('phone')}>
            {(aria) => (
              <input
                {...aria}
                {...bind('phone')}
                type="tel"
                autoComplete="tel"
                placeholder="+62 812 3456 7890"
                className={inputClass}
              />
            )}
          </Field>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field id={fieldId('area')} label="Delivery area" error={errorFor('area')}>
            {(aria) => (
              <select
                {...aria}
                value={details.area}
                onChange={(event) =>
                  onDetailsChange({ ...details, area: event.target.value as CustomerDetails['area'] })
                }
                onBlur={() => setTouched((t) => ({ ...t, area: true }))}
                className={inputClass}
              >
                <option value="" disabled>
                  Choose an area
                </option>
                {DELIVERY_AREAS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Field id={fieldId('startDate')} label="Delivery date" error={errorFor('startDate')}>
            {(aria) => (
              <input
                {...aria}
                {...bind('startDate')}
                type="date"
                min={earliestStartDate(today)}
                className={inputClass}
              />
            )}
          </Field>
        </div>

        <Field
          id={fieldId('address')}
          label="Address"
          hint="Villa name, street or coworking space."
          error={errorFor('address')}
        >
          {(aria) => <input {...aria} {...bind('address')} autoComplete="street-address" className={inputClass} />}
        </Field>

        <Field id={fieldId('notes')} label="Anything we should know?" optional>
          {(aria) => <textarea {...aria} {...bind('notes')} rows={2} className={inputClass} />}
        </Field>

        {status === 'error' && (
          <p role="alert" className="rounded-xl bg-sunset-100 px-3 py-2 text-sm text-sunset-600">
            Something went wrong sending your request. Please try again.
          </p>
        )}
      </form>
    </StepLayout>
  )
}
