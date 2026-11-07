import { ACCESSORIES, getChair, getDesk, type AccessoryId, type CatalogProduct } from '@/features/catalog'
import { calculateQuote, type Quote } from '@/lib/pricing'
import type { WorkspaceState } from './state'

/** One row of the setup, as shown in the summary and checkout. */
export interface SetupLine {
  readonly product: CatalogProduct
  readonly quantity: number
}

/** Everything in the setup: desk, chair, then accessories in catalog order. */
export function selectLines(state: WorkspaceState): SetupLine[] {
  const lines: SetupLine[] = []
  if (state.deskId) lines.push({ product: getDesk(state.deskId), quantity: 1 })
  if (state.chairId) lines.push({ product: getChair(state.chairId), quantity: 1 })

  for (const accessory of ACCESSORIES) {
    const quantity = state.accessories[accessory.id] ?? 0
    if (quantity > 0) lines.push({ product: accessory, quantity })
  }
  return lines
}

/** The price of the setup for its billing period. */
export function selectQuote(state: WorkspaceState): Quote {
  const lines = selectLines(state).map(({ product, quantity }) => ({ price: product.price, quantity }))
  return calculateQuote(lines, state.billingPeriod)
}

export function selectAccessoryQuantity(state: WorkspaceState, id: AccessoryId): number {
  return state.accessories[id] ?? 0
}

/** A setup can be rented once it has the two essentials: a desk and a chair. */
export function selectIsReadyToRent(state: WorkspaceState): boolean {
  return state.deskId !== null && state.chairId !== null
}

export function selectIsEmpty(state: WorkspaceState): boolean {
  return !state.deskId && !state.chairId && Object.keys(state.accessories).length === 0
}
