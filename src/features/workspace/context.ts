import { createContext, type Dispatch } from 'react'
import type { AccessoryId, BillingPeriod, ChairId, DeskId } from '@/features/catalog'
import type { WorkspaceAction } from './reducer'
import type { WorkspaceState } from './state'

/** Stable, pre-bound action creators. Components that only change the setup never re-render. */
export interface WorkspaceActions {
  selectDesk: (id: DeskId | null) => void
  selectChair: (id: ChairId | null) => void
  addAccessory: (id: AccessoryId) => void
  removeAccessory: (id: AccessoryId) => void
  setAccessoryQuantity: (id: AccessoryId, quantity: number) => void
  setBillingPeriod: (period: BillingPeriod) => void
  reset: () => void
  loadSetup: (state: WorkspaceState) => void
}

export function createWorkspaceActions(dispatch: Dispatch<WorkspaceAction>): WorkspaceActions {
  return {
    selectDesk: (id) => dispatch({ type: 'desk/select', id }),
    selectChair: (id) => dispatch({ type: 'chair/select', id }),
    addAccessory: (id) => dispatch({ type: 'accessory/add', id }),
    removeAccessory: (id) => dispatch({ type: 'accessory/remove', id }),
    setAccessoryQuantity: (id, quantity) => dispatch({ type: 'accessory/set-quantity', id, quantity }),
    setBillingPeriod: (period) => dispatch({ type: 'billing/set-period', period }),
    reset: () => dispatch({ type: 'setup/reset' }),
    loadSetup: (state) => dispatch({ type: 'setup/load', state }),
  }
}

// State and actions live in separate contexts so action-only consumers skip state updates.
export const WorkspaceStateContext = createContext<WorkspaceState | null>(null)
export const WorkspaceActionsContext = createContext<WorkspaceActions | null>(null)
