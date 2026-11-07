import { X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { useWorkspaceActions } from '@/features/workspace'
import type { RentalConfirmation } from './api'
import { EMPTY_DETAILS, type CustomerDetails, type RentalRequest } from './checkout'
import { ConfirmationStep } from './ConfirmationStep'
import { DetailsStep } from './DetailsStep'
import { ReviewStep } from './ReviewStep'

type Step = 'review' | 'details' | 'confirmed'

const STEPS: readonly { id: Step; label: string; title: string }[] = [
  { id: 'review', label: 'Review', title: 'Review your setup' },
  { id: 'details', label: 'Details', title: 'Where should we deliver?' },
  { id: 'confirmed', label: 'Done', title: 'Request sent!' },
]

interface CheckoutDialogProps {
  open: boolean
  onClose: () => void
}

/**
 * Checkout drawer built on the native <dialog>: showModal() gives focus trapping, Esc to
 * close, an inert background and correct screen-reader semantics for free.
 */
export function CheckoutDialog({ open, onClose }: CheckoutDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const titleId = useId()
  const { reset } = useWorkspaceActions()

  const [step, setStep] = useState<Step>('review')
  const [term, setTerm] = useState(1)
  // Kept across openings so the customer never has to retype their details.
  const [details, setDetails] = useState<CustomerDetails>(EMPTY_DETAILS)
  const [result, setResult] = useState<{ confirmation: RentalConfirmation; request: RentalRequest } | null>(null)
  const shouldFocusHeading = useRef(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  // After moving between steps, focus the new heading so keyboard and screen-reader users
  // follow along. Done in an effect (not a timer) so focus moves before any further input.
  useEffect(() => {
    if (!shouldFocusHeading.current) return
    shouldFocusHeading.current = false
    headingRef.current?.focus()
  }, [step])

  const goTo = (next: Step) => {
    shouldFocusHeading.current = true
    setStep(next)
  }

  /** Runs for every way of closing: the X, Esc, backdrop click or a footer button. */
  const handleClosed = () => {
    if (step === 'confirmed') {
      setResult(null)
      setTerm(1)
    }
    setStep('review')
    onClose()
  }

  const close = () => dialogRef.current?.close()
  const current = STEPS.find((s) => s.id === step)!

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={handleClosed}
      onClick={(event) => event.target === event.currentTarget && close()}
      className="m-0 ml-auto h-dvh max-h-none w-full max-w-lg bg-sand-50 p-0 text-ink-900 shadow-2xl backdrop:bg-ink-900/40 backdrop:backdrop-blur-sm open:flex open:flex-col sm:rounded-l-3xl motion-safe:open:animate-slide-in"
    >
      <header className="border-b border-sand-200 px-5 pt-5 pb-4 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} ref={headingRef} tabIndex={-1} className="text-xl font-extrabold tracking-tight outline-none">
            {current.title}
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close checkout"
            className="-mt-1 -mr-1 grid size-9 place-items-center rounded-full text-ink-600 transition hover:bg-sand-200 hover:text-ink-900"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <ol className="mt-3 flex gap-2 text-xs font-semibold" aria-label="Checkout progress">
          {STEPS.map((s, index) => {
            const isCurrent = s.id === step
            const isDone = STEPS.findIndex((x) => x.id === step) > index
            return (
              <li
                key={s.id}
                aria-current={isCurrent ? 'step' : undefined}
                className={`flex-1 border-t-4 pt-1.5 ${isCurrent ? 'border-sunset-500 text-ink-900' : isDone ? 'border-jungle-500 text-jungle-700' : 'border-sand-200 text-ink-400'}`}
              >
                {index + 1}. {s.label}
              </li>
            )
          })}
        </ol>
      </header>

      {open && step === 'review' && (
        <ReviewStep term={term} onTermChange={setTerm} onContinue={() => goTo('details')} onEditSetup={close} />
      )}
      {open && step === 'details' && (
        <DetailsStep
          term={term}
          details={details}
          onDetailsChange={setDetails}
          onBack={() => goTo('review')}
          onSubmitted={(confirmation, request) => {
            setResult({ confirmation, request })
            goTo('confirmed')
          }}
        />
      )}
      {open && step === 'confirmed' && result && (
        <ConfirmationStep
          confirmation={result.confirmation}
          request={result.request}
          onClose={close}
          onStartOver={() => {
            reset()
            close()
          }}
        />
      )}
    </dialog>
  )
}
