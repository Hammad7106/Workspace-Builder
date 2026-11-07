import { ACCESSORIES, CHAIRS, DESKS, type AccessoryId } from '@/features/catalog'
import { normalizeWorkspace, selectIsSameSetup, type WorkspaceState } from '@/features/workspace'

export interface Preset {
  readonly id: string
  readonly name: string
  readonly description: string
  /** Products only; the user's billing period is kept when a preset is loaded. */
  readonly setup: Omit<WorkspaceState, 'billingPeriod'>
}

/** Curated starting points for common kinds of remote work. Each is a complete, rentable setup. */
export const PRESETS = [
  {
    id: 'nomad-starter',
    name: 'Nomad Starter',
    description: 'Laptop-first and light on the budget.',
    setup: {
      deskId: 'desk-mechanical',
      chairId: 'chair-task',
      accessories: { 'laptop-stand': 1, 'keyboard-mouse': 1, 'plant-monstera': 1 },
    },
  },
  {
    id: 'deep-focus',
    name: 'Deep Focus',
    description: 'One big screen, good light and no distractions.',
    setup: {
      deskId: 'desk-electric',
      chairId: 'chair-ergonomic',
      accessories: { 'monitor-27-4k': 1, 'keyboard-mouse': 1, 'lamp-led': 1, 'headphones-anc': 1 },
    },
  },
  {
    id: 'triple-monitor-pro',
    name: 'Triple-Monitor Pro',
    description: 'Three screens for trading, data or code.',
    setup: {
      deskId: 'desk-dual-motor',
      chairId: 'chair-ergonomic',
      accessories: { 'monitor-24-fhd': 2, 'monitor-27-4k': 1, 'keyboard-mouse': 1, 'lamp-led': 1, 'plant-monstera': 1 },
    },
  },
  {
    id: 'active-creator',
    name: 'Active Creator',
    description: 'Stand, wobble and create among the plants.',
    setup: {
      deskId: 'desk-electric',
      chairId: 'chair-balance-stool',
      accessories: { 'monitor-27-4k': 1, 'laptop-stand': 1, 'headphones-anc': 1, 'plant-monstera': 2 },
    },
  },
] as const satisfies readonly Preset[]

export type PresetId = (typeof PRESETS)[number]['id']

/** A preset as a full setup, keeping the given billing period. */
export function presetToSetup(preset: Preset, billingPeriod: WorkspaceState['billingPeriod']): WorkspaceState {
  return normalizeWorkspace({ ...preset.setup, billingPeriod })
}

/** A random number in [0, 1). Injected so randomness is reproducible in tests. */
export type Random = () => number

const pick = <T>(items: readonly T[], random: Random): T => items[Math.floor(random() * items.length)]

/**
 * A random but sensible setup: always a desk, a chair and at least one monitor, plus a
 * random mix of other accessories. Normalized, so it always obeys the setup rules.
 */
export function randomSetup(billingPeriod: WorkspaceState['billingPeriod'], random: Random = Math.random): WorkspaceState {
  const desk = pick(DESKS, random)
  const accessories: Partial<Record<AccessoryId, number>> = {}
  const monitors = ACCESSORIES.filter((a) => a.slot === 'monitor')

  const monitorCount = 1 + Math.floor(random() * desk.monitorCapacity)
  for (let i = 0; i < monitorCount; i++) {
    const { id } = pick(monitors, random)
    accessories[id] = (accessories[id] ?? 0) + 1
  }
  for (const accessory of ACCESSORIES) {
    if (accessory.slot === 'monitor' || random() < 0.5) continue
    accessories[accessory.id] = 1 + Math.floor(random() * accessory.maxQuantity)
  }

  return normalizeWorkspace({ deskId: desk.id, chairId: pick(CHAIRS, random).id, accessories, billingPeriod })
}

/** A random setup that differs from the current one, so "Surprise me" always changes something. */
export function surpriseSetup(current: WorkspaceState, random: Random = Math.random): WorkspaceState {
  let next = randomSetup(current.billingPeriod, random)
  for (let attempt = 0; attempt < 10 && selectIsSameSetup(next, current); attempt++) {
    next = randomSetup(current.billingPeriod, random)
  }
  return next
}
