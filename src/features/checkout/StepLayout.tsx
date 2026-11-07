import type { ReactNode } from 'react'

/** A checkout step: a scrollable body with an action footer pinned to the bottom of the drawer. */
export function StepLayout({ children, footer }: { children: ReactNode; footer: ReactNode }) {
  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6">{children}</div>
      <div className="flex gap-2 border-t border-sand-200 bg-sand-50 px-5 py-4 sm:px-6">{footer}</div>
    </>
  )
}

export const primaryButton =
  'inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-sunset-500 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-sunset-600 disabled:cursor-wait disabled:opacity-70'
export const secondaryButton =
  'inline-flex items-center justify-center gap-2 rounded-full border border-sand-300 px-5 py-3 text-sm font-semibold text-ink-900 transition hover:bg-sand-200'
