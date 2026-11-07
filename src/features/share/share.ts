import { ACCESSORIES } from '@/features/catalog'
import { parseSetup, selectIsEmpty, type WorkspaceState } from '@/features/workspace'

/*
 * Share links keep the setup in readable query parameters, e.g.
 *   ?desk=desk-electric&chair=chair-ergonomic&item=monitor-24-fhd*2&item=lamp-led
 * The billing period is only included when it isn't the default (monthly).
 */

const PARAM = { desk: 'desk', chair: 'chair', item: 'item', billing: 'billing' } as const

/** Encodes the setup as a query string (without the leading "?"). */
export function encodeSetup(state: WorkspaceState): string {
  const params = new URLSearchParams()
  if (state.deskId) params.set(PARAM.desk, state.deskId)
  if (state.chairId) params.set(PARAM.chair, state.chairId)
  for (const { id } of ACCESSORIES) {
    const quantity = state.accessories[id] ?? 0
    if (quantity > 0) params.append(PARAM.item, quantity > 1 ? `${id}*${quantity}` : id)
  }
  if (state.billingPeriod === 'week') params.set(PARAM.billing, 'week')
  return params.toString()
}

/**
 * Reads a setup from a query string. Returns null when the link carries no setup.
 * Everything goes through the same validation as saved setups, so unknown products
 * are dropped and the setup rules are enforced: a hand-edited link can't break the app.
 */
export function decodeSetup(search: string): WorkspaceState | null {
  const params = new URLSearchParams(search)
  if (!params.has(PARAM.desk) && !params.has(PARAM.chair) && !params.has(PARAM.item)) return null

  const accessories: Record<string, number> = {}
  for (const entry of params.getAll(PARAM.item)) {
    const [id, count = '1'] = entry.split('*')
    accessories[id] = (accessories[id] ?? 0) + Number(count)
  }

  return parseSetup({
    deskId: params.get(PARAM.desk),
    chairId: params.get(PARAM.chair),
    accessories,
    billingPeriod: params.get(PARAM.billing) ?? 'month',
  })
}

/** A full link that opens the app with this setup. */
export function buildShareUrl(state: WorkspaceState, location: Pick<Location, 'origin' | 'pathname'>): string {
  const query = selectIsEmpty(state) ? '' : `?${encodeSetup(state)}`
  return `${location.origin}${location.pathname}${query}`
}

/** The setup in the current page's link, if it was opened from a share link. */
export function readSharedSetup(search: string = globalThis.location?.search ?? ''): WorkspaceState | null {
  return decodeSetup(search)
}

/**
 * Removes the setup parameters from the address bar once loaded, so refreshing keeps the
 * user's own edits (saved locally) instead of resetting to the shared setup.
 */
export function clearSharedSetupFromUrl(): void {
  const { pathname, hash } = window.location
  window.history.replaceState(window.history.state, '', `${pathname}${hash}`)
}
