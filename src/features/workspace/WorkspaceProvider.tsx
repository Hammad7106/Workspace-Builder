import { useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { createWorkspaceActions, WorkspaceActionsContext, WorkspaceStateContext } from './context'
import { loadSetup, saveSetup } from './persistence'
import { workspaceReducer } from './reducer'
import { normalizeWorkspace } from './rules'
import { EMPTY_WORKSPACE, type WorkspaceState } from './state'

interface WorkspaceProviderProps {
  children: ReactNode
  /** Start from this setup instead of the saved one (tests, presets, shared links). */
  initialState?: WorkspaceState
  /** Save the setup to localStorage and restore it on reload. Defaults to true. */
  persist?: boolean
}

export function WorkspaceProvider({ children, initialState, persist = true }: WorkspaceProviderProps) {
  const [state, dispatch] = useReducer(workspaceReducer, undefined, () =>
    initialState
      ? normalizeWorkspace(initialState)
      : ((persist ? loadSetup() : null) ?? EMPTY_WORKSPACE),
  )

  useEffect(() => {
    if (persist) saveSetup(state)
  }, [persist, state])

  const actions = useMemo(() => createWorkspaceActions(dispatch), [dispatch])

  return (
    <WorkspaceActionsContext value={actions}>
      <WorkspaceStateContext value={state}>{children}</WorkspaceStateContext>
    </WorkspaceActionsContext>
  )
}
