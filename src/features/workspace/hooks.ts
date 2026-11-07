import { use, useMemo } from 'react'
import type { Quote } from '@/lib/pricing'
import { WorkspaceActionsContext, WorkspaceStateContext, type WorkspaceActions } from './context'
import { selectLines, selectQuote, type SetupLine } from './selectors'
import type { WorkspaceState } from './state'

/** The current setup. Re-renders whenever the setup changes. */
export function useWorkspaceState(): WorkspaceState {
  const state = use(WorkspaceStateContext)
  if (!state) throw new Error('useWorkspaceState must be used inside <WorkspaceProvider>')
  return state
}

/** Stable action creators. Never causes a re-render on its own. */
export function useWorkspaceActions(): WorkspaceActions {
  const actions = use(WorkspaceActionsContext)
  if (!actions) throw new Error('useWorkspaceActions must be used inside <WorkspaceProvider>')
  return actions
}

/** The rows of the current setup, memoized per state. */
export function useSetupLines(): SetupLine[] {
  const state = useWorkspaceState()
  return useMemo(() => selectLines(state), [state])
}

/** The price of the current setup, memoized per state. */
export function useQuote(): Quote {
  const state = useWorkspaceState()
  return useMemo(() => selectQuote(state), [state])
}
