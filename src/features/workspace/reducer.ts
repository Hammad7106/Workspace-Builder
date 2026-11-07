import type { AccessoryId, BillingPeriod, ChairId, DeskId } from '@/features/catalog'
import { getAccessoryLimit, normalizeWorkspace } from './rules'
import { EMPTY_WORKSPACE, type WorkspaceState } from './state'

export type WorkspaceAction =
  /** Choose a desk, or `null` to remove it. Excess monitors are trimmed. */
  | { type: 'desk/select'; id: DeskId | null }
  /** Choose a chair, or `null` to remove it. */
  | { type: 'chair/select'; id: ChairId | null }
  /** Add one unit. Ignored when the accessory is at its limit. */
  | { type: 'accessory/add'; id: AccessoryId }
  /** Remove one unit. Ignored when none are rented. */
  | { type: 'accessory/remove'; id: AccessoryId }
  /** Set an exact quantity; clamped to the accessory's current limit. */
  | { type: 'accessory/set-quantity'; id: AccessoryId; quantity: number }
  | { type: 'billing/set-period'; period: BillingPeriod }
  /** Clear the setup but keep the chosen billing period. */
  | { type: 'setup/reset' }
  /** Replace the whole setup (a preset, a shared link, saved state). Normalized on the way in. */
  | { type: 'setup/load'; state: WorkspaceState }

/**
 * Pure state transitions for the workspace. Every action that can't change anything
 * returns the same state object, so React skips the re-render.
 */
export function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  switch (action.type) {
    case 'desk/select':
      if (action.id === state.deskId) return state
      return normalizeWorkspace({ ...state, deskId: action.id })

    case 'chair/select':
      if (action.id === state.chairId) return state
      return { ...state, chairId: action.id }

    case 'accessory/add':
      return setAccessoryQuantity(state, action.id, (state.accessories[action.id] ?? 0) + 1)

    case 'accessory/remove':
      return setAccessoryQuantity(state, action.id, (state.accessories[action.id] ?? 0) - 1)

    case 'accessory/set-quantity':
      return setAccessoryQuantity(state, action.id, action.quantity)

    case 'billing/set-period':
      if (action.period === state.billingPeriod) return state
      return { ...state, billingPeriod: action.period }

    case 'setup/reset':
      return { ...EMPTY_WORKSPACE, billingPeriod: state.billingPeriod }

    case 'setup/load':
      return normalizeWorkspace(action.state)
  }
}

function setAccessoryQuantity(state: WorkspaceState, id: AccessoryId, requested: number): WorkspaceState {
  if (!Number.isFinite(requested)) return state

  const current = state.accessories[id] ?? 0
  const quantity = Math.min(Math.max(0, Math.floor(requested)), getAccessoryLimit(state, id).max)
  if (quantity === current) return state

  const { [id]: _removed, ...rest } = state.accessories
  return { ...state, accessories: quantity === 0 ? rest : { ...rest, [id]: quantity } }
}
