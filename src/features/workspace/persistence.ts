import { isAccessoryId, isChairId, isDeskId, type AccessoryId } from '@/features/catalog'
import { normalizeWorkspace } from './rules'
import { EMPTY_WORKSPACE, type WorkspaceState } from './state'

/** Bump the version whenever the stored shape changes incompatibly. */
export const STORAGE_KEY = 'monis-workspace:v1'

type KeyValueStore = Pick<Storage, 'getItem' | 'setItem'>

/**
 * Turns untrusted data (parsed localStorage, later a shared link) into a valid setup.
 * Unknown or discontinued products are dropped instead of failing the whole setup, so
 * a catalog change never wipes a user's saved work. Returns null if it isn't a setup.
 */
export function parseSetup(data: unknown): WorkspaceState | null {
  if (typeof data !== 'object' || data === null) return null
  const raw = data as Record<string, unknown>

  const accessories: Partial<Record<AccessoryId, number>> = {}
  if (typeof raw.accessories === 'object' && raw.accessories !== null) {
    for (const [id, quantity] of Object.entries(raw.accessories)) {
      if (isAccessoryId(id) && typeof quantity === 'number') accessories[id] = quantity
    }
  }

  return normalizeWorkspace({
    deskId: isDeskId(raw.deskId) ? raw.deskId : null,
    chairId: isChairId(raw.chairId) ? raw.chairId : null,
    accessories,
    billingPeriod:
      raw.billingPeriod === 'week' || raw.billingPeriod === 'month'
        ? raw.billingPeriod
        : EMPTY_WORKSPACE.billingPeriod,
  })
}

/** Storage can be missing or throw (private mode, blocked cookies, SSR); treat that as "no storage". */
function getBrowserStorage(): KeyValueStore | null {
  try {
    return globalThis.localStorage ?? null
  } catch {
    return null
  }
}

/** Reads the saved setup, or null if there is none or it can't be read. */
export function loadSetup(storage: KeyValueStore | null = getBrowserStorage()): WorkspaceState | null {
  try {
    const json = storage?.getItem(STORAGE_KEY)
    return json ? parseSetup(JSON.parse(json)) : null
  } catch {
    return null
  }
}

/** Saves the setup. Fails silently: persistence is a convenience, never a blocker. */
export function saveSetup(state: WorkspaceState, storage: KeyValueStore | null = getBrowserStorage()): void {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Quota exceeded or storage disabled; the setup still works in memory.
  }
}
