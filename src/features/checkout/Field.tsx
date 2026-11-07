import type { ReactNode } from 'react'

interface FieldProps {
  id: string
  label: string
  /** Shown under the input and linked via aria-describedby. */
  error?: string
  hint?: string
  optional?: boolean
  /** Receives the aria props to spread onto the input. */
  children: (aria: { id: string; 'aria-invalid': boolean; 'aria-describedby'?: string }) => ReactNode
}

/** Label + input + hint/error, wired up for screen readers. */
export function Field({ id, label, error, hint, optional, children }: FieldProps) {
  const messageId = `${id}-message`
  const message = error ?? hint
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-semibold text-ink-600">
        {label}
        {optional && <span className="font-normal text-ink-400"> (optional)</span>}
      </label>
      {children({ id, 'aria-invalid': Boolean(error), 'aria-describedby': message ? messageId : undefined })}
      {message && (
        <p id={messageId} className={`mt-1 text-xs ${error ? 'font-medium text-sunset-600' : 'text-ink-400'}`}>
          {message}
        </p>
      )}
    </div>
  )
}

export const inputClass =
  'w-full rounded-xl border border-sand-300 bg-white px-3 py-2 text-sm transition placeholder:text-ink-400 focus:border-jungle-500 aria-invalid:border-sunset-500'
