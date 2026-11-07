import { ACCESSORIES } from '@/features/catalog'
import { useWorkspaceActions, useWorkspaceState } from '@/features/workspace'
import { describeAccessoryLimit } from './limits'
import { ProductCardBody } from './ProductCardBody'
import { QuantityStepper } from './QuantityStepper'

/** Add-many list for accessories, with a quantity stepper and a reason when one is maxed out. */
export function AccessoryList() {
  const state = useWorkspaceState()
  const { addAccessory, removeAccessory } = useWorkspaceActions()

  return (
    <ul className="flex flex-col gap-2">
      {ACCESSORIES.map((accessory) => {
        const quantity = state.accessories[accessory.id] ?? 0
        const limitMessage = describeAccessoryLimit(state, accessory.id)

        return (
          <li
            key={accessory.id}
            data-active={quantity > 0 || undefined}
            className="rounded-2xl border-2 border-transparent bg-white p-3 shadow-sm ring-1 ring-sand-200 transition data-active:border-jungle-500 data-active:bg-jungle-50 data-active:ring-0"
          >
            <ProductCardBody product={accessory} period={state.billingPeriod} />
            <div className="mt-2 flex items-center justify-between gap-3 pl-[4.25rem]">
              <p className="text-[11px] font-medium text-sunset-600">{limitMessage}</p>
              <QuantityStepper
                label={accessory.name}
                quantity={quantity}
                canAdd={limitMessage === null}
                onAdd={() => addAccessory(accessory.id)}
                onRemove={() => removeAccessory(accessory.id)}
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
