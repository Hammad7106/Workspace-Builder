const PLACEHOLDER_TABS = ['Desks', 'Chairs', 'Accessories'] as const

/**
 * Product picker. Currently a static shell (tabs + skeleton cards) so the layout
 * can be reviewed; it's wired to the catalog and store in the next batches.
 */
export function BuilderPanel() {
  return (
    <aside
      aria-label="Choose your items"
      className="flex flex-col rounded-3xl bg-sand-50 p-4 shadow-sm ring-1 ring-sand-200"
    >
      <div role="tablist" className="flex gap-1 rounded-2xl bg-sand-100 p-1">
        {PLACEHOLDER_TABS.map((tab, i) => (
          <button
            key={tab}
            role="tab"
            type="button"
            aria-selected={i === 0}
            disabled
            className="flex-1 rounded-xl px-3 py-2 text-sm font-semibold text-ink-600 aria-selected:bg-white aria-selected:text-ink-900 aria-selected:shadow-sm"
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3" aria-hidden>
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="aspect-[4/5] animate-pulse rounded-2xl border-2 border-dashed border-sand-300 bg-sand-100"
          />
        ))}
      </div>
    </aside>
  )
}
