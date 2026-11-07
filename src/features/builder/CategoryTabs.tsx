import { Check } from 'lucide-react'
import { useRef, type KeyboardEvent } from 'react'
import { CATEGORIES, type Category } from '@/features/catalog'
import { panelId, tabId } from './tabIds'

interface CategoryTabsProps {
  /** Prefix for tab/panel ids so aria-controls/aria-labelledby line up. */
  idPrefix: string
  active: Category
  onChange: (category: Category) => void
  /** Status shown next to each tab label: a check, or a count. */
  status: Record<Category, boolean | number>
}

/**
 * WAI-ARIA tabs: arrow keys move between tabs (wrapping), Home/End jump to the ends,
 * and only the active tab is in the Tab order (roving tabindex).
 */
export function CategoryTabs({ idPrefix, active, onChange, status }: CategoryTabsProps) {
  const tabRefs = useRef(new Map<Category, HTMLButtonElement>())

  const focusTab = (index: number) => {
    const category = CATEGORIES[(index + CATEGORIES.length) % CATEGORIES.length].id
    onChange(category)
    tabRefs.current.get(category)?.focus()
  }

  const handleKeyDown = (event: KeyboardEvent, index: number) => {
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: CATEGORIES.length - 1,
    }
    if (!(event.key in moves)) return
    event.preventDefault()
    focusTab(moves[event.key])
  }

  return (
    <div role="tablist" aria-label="Product categories" className="flex gap-1 rounded-2xl bg-sand-100 p-1">
      {CATEGORIES.map((category, index) => {
        const isActive = category.id === active
        const badge = status[category.id]
        return (
          <button
            key={category.id}
            ref={(node) => {
              if (node) tabRefs.current.set(category.id, node)
              else tabRefs.current.delete(category.id)
            }}
            id={tabId(idPrefix, category.id)}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-controls={panelId(idPrefix, category.id)}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(category.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-ink-600 transition hover:text-ink-900 aria-selected:bg-white aria-selected:text-ink-900 aria-selected:shadow-sm"
          >
            {category.label}
            {badge === true && (
              <span className="grid size-4 place-items-center rounded-full bg-jungle-500 text-white">
                <Check className="size-2.5" strokeWidth={3.5} aria-label="chosen" />
              </span>
            )}
            {typeof badge === 'number' && badge > 0 && (
              <span className="min-w-4 rounded-full bg-sunset-500 px-1 text-[10px] leading-4 font-bold text-white">
                {badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
