import { RotateCcw } from 'lucide-react'
import { useId, useState } from 'react'
import { CHAIRS, DESKS, type Category } from '@/features/catalog'
import { selectIsEmpty, useQuote, useWorkspaceActions, useWorkspaceState } from '@/features/workspace'
import { AccessoryList } from './AccessoryList'
import { BillingToggle } from './BillingToggle'
import { CategoryTabs } from './CategoryTabs'
import { ChoiceList } from './ChoiceList'
import { describeMonitorSpace } from './limits'
import { panelId, tabId } from './tabIds'

/** The product picker: category tabs, product cards, billing switch and reset. */
export function BuilderPanel() {
  const idPrefix = useId()
  const [activeCategory, setActiveCategory] = useState<Category>('desk')
  const state = useWorkspaceState()
  const { selectDesk, selectChair, reset } = useWorkspaceActions()
  const { itemCount } = useQuote()
  const accessoryCount = itemCount - (state.deskId ? 1 : 0) - (state.chairId ? 1 : 0)

  const hints: Record<Category, string> = {
    desk: 'Pick one desk. Everything else sits on top of it.',
    chair: 'Pick one chair to go with your desk.',
    accessory: describeMonitorSpace(state),
  }

  return (
    <aside
      aria-label="Choose your items"
      className="flex flex-col rounded-3xl bg-sand-50 p-4 shadow-sm ring-1 ring-sand-200 lg:sticky lg:top-6 lg:max-h-[calc(100dvh-8.5rem)] lg:self-start"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold">Build your setup</h2>
        <div className="flex items-center gap-2">
          <BillingToggle />
          {!selectIsEmpty(state) && (
            <button
              type="button"
              onClick={reset}
              title="Start over"
              aria-label="Start over"
              className="grid size-7 place-items-center rounded-full text-ink-600 transition hover:bg-sand-200 hover:text-ink-900"
            >
              <RotateCcw className="size-3.5" aria-hidden />
            </button>
          )}
        </div>
      </div>

      <CategoryTabs
        idPrefix={idPrefix}
        active={activeCategory}
        onChange={setActiveCategory}
        status={{ desk: state.deskId !== null, chair: state.chairId !== null, accessory: accessoryCount }}
      />

      <div
        role="tabpanel"
        id={panelId(idPrefix, activeCategory)}
        aria-labelledby={tabId(idPrefix, activeCategory)}
        className="-mx-1 mt-3 min-h-0 flex-1 overflow-y-auto px-1 pt-2 pb-1"
      >
        <p className="mb-3 text-xs text-ink-600">{hints[activeCategory]}</p>
        {activeCategory === 'desk' && (
          <ChoiceList products={DESKS} selectedId={state.deskId} period={state.billingPeriod} onSelect={selectDesk} />
        )}
        {activeCategory === 'chair' && (
          <ChoiceList products={CHAIRS} selectedId={state.chairId} period={state.billingPeriod} onSelect={selectChair} />
        )}
        {activeCategory === 'accessory' && <AccessoryList />}
      </div>
    </aside>
  )
}
