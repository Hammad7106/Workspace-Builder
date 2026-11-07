import { getAccessory, getDesk, type AccessoryId } from '@/features/catalog'
import { getAccessoryLimit, MAX_MONITORS, type WorkspaceState } from '@/features/workspace'

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`

/**
 * Explains why an accessory can't be added, or returns null if it still can.
 * Shown under a disabled "+" so the user is never left guessing.
 */
export function describeAccessoryLimit(state: WorkspaceState, id: AccessoryId): string | null {
  const quantity = state.accessories[id] ?? 0
  const limit = getAccessoryLimit(state, id)
  if (quantity < limit.max) return null

  if (limit.reason === 'slot-capacity' && getAccessory(id).slot === 'monitor') {
    if (!state.deskId) return `Up to ${plural(MAX_MONITORS, 'monitor')} fit on our widest desk`
    const desk = getDesk(state.deskId)
    return `Your ${desk.name} fits ${plural(desk.monitorCapacity, 'monitor')}`
  }

  return limit.max === 1 ? 'One per setup' : `Max ${limit.max} per setup`
}

/** The short hint under the tabs, tailored to the current setup. */
export function describeMonitorSpace(state: WorkspaceState): string {
  if (!state.deskId) return 'Add as many as you like. Monitor space depends on the desk you pick.'
  const desk = getDesk(state.deskId)
  return `Your ${desk.name} fits up to ${plural(desk.monitorCapacity, 'monitor')}.`
}
