import { Palmtree } from 'lucide-react'
import { SITE } from '@/config/site'

export function Header() {
  return (
    <header className="border-b border-sand-200 bg-sand-50/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-xl bg-jungle-900 text-sand-100">
            <Palmtree className="size-5" aria-hidden />
          </span>
          <div className="leading-tight">
            <h1 className="text-base font-bold sm:text-lg">{SITE.name}</h1>
            <p className="hidden text-xs text-ink-600 sm:block">{SITE.tagline}</p>
          </div>
        </div>

        <a
          href={SITE.brandUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-sand-300 px-3 py-1.5 text-xs font-semibold text-jungle-900 transition hover:bg-sand-200"
        >
          by {SITE.brand}
        </a>
      </div>
    </header>
  )
}
