import {
  ACCESSORIES,
  DESKS,
  getAccessory,
  getDesk,
  type AccessoryId,
  type AccessorySlot,
} from '@/features/catalog'
import type { AccessoryQuantities, WorkspaceState } from './state'

/*
 * Business rules for a valid setup:
 *   • at most one desk and one chair (enforced by the state shape)
 *   • each accessory is capped at its own `maxQuantity`
 *   • all monitors combined must fit on the desk (`monitorCapacity`); before a desk
 *     is chosen, the cap is the largest desk's capacity
 */

/** Most monitors any desk in the catalog can hold. */
export const MAX_MONITORS = Math.max(...DESKS.map((desk) => desk.monitorCapacity))

/** How many units of a slot fit in this setup (Infinity = no shared limit). */
export function getSlotCapacity(state: WorkspaceState, slot: AccessorySlot): number {
  if (slot !== 'monitor') return Infinity
  return state.deskId ? getDesk(state.deskId).monitorCapacity : MAX_MONITORS
}

/** Total units rented in a slot, optionally excluding one product. */
export function getSlotCount(
  accessories: AccessoryQuantities,
  slot: AccessorySlot,
  excludeId?: AccessoryId,
): number {
  return ACCESSORIES.reduce(
    (sum, accessory) =>
      accessory.slot === slot && accessory.id !== excludeId
        ? sum + (accessories[accessory.id] ?? 0)
        : sum,
    0,
  )
}

export interface AccessoryLimit {
  /** Most units of this product the setup can hold right now. */
  readonly max: number
  /** Why `max` is what it is, so the UI can explain a disabled "+" button. */
  readonly reason: 'product-limit' | 'slot-capacity'
}

/** The current quantity limit for one accessory, given everything else in the setup. */
export function getAccessoryLimit(state: WorkspaceState, id: AccessoryId): AccessoryLimit {
  const accessory = getAccessory(id)
  const slotRoom = getSlotCapacity(state, accessory.slot) - getSlotCount(state.accessories, accessory.slot, id)

  return slotRoom < accessory.maxQuantity
    ? { max: Math.max(0, slotRoom), reason: 'slot-capacity' }
    : { max: accessory.maxQuantity, reason: 'product-limit' }
}

/**
 * Returns a copy of the state that satisfies every rule: quantities are whole numbers
 * within each product's limit, zero quantities are dropped, and slots over capacity
 * (e.g. after switching to a smaller desk) are trimmed. When trimming, products later
 * in the catalog lose units first, so the result is deterministic.
 */
export function normalizeWorkspace(state: WorkspaceState): WorkspaceState {
  const accessories: Partial<Record<AccessoryId, number>> = {}
  const usedBySlot = new Map<AccessorySlot, number>()

  for (const accessory of ACCESSORIES) {
    const requested = Math.floor(state.accessories[accessory.id] ?? 0)
    if (!(requested > 0)) continue // also drops NaN

    const used = usedBySlot.get(accessory.slot) ?? 0
    const room = getSlotCapacity(state, accessory.slot) - used
    const quantity = Math.min(requested, accessory.maxQuantity, room)
    if (quantity <= 0) continue

    accessories[accessory.id] = quantity
    usedBySlot.set(accessory.slot, used + quantity)
  }

  return { ...state, accessories }
}
