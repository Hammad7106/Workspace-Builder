import { ACCESSORIES, getDesk, type AccessoryId, type AccessorySlot, type ChairId, type DeskId } from '@/features/catalog'
import type { WorkspaceState } from '@/features/workspace'
import { ART } from './art/registry'
import {
  CHAIR_OFFSET_Y,
  CHAIR_SCALE,
  DESK_HEIGHT,
  DESK_TOP_DEPTH,
  GHOST_DESK_WIDTH,
  SCENE,
  deskWidthPx,
} from './geometry'

/** Where one accessory unit is drawn. `x`/`y` is its bottom-centre. */
export interface Placement {
  /** Stable per unit (e.g. "monitor-24-fhd#1") so React keeps it mounted and can animate moves. */
  readonly key: string
  readonly productId: AccessoryId
  readonly x: number
  readonly y: number
  readonly scale: number
}

export interface SceneLayout {
  readonly desk: {
    /** null = draw the dashed placeholder. */
    readonly id: DeskId | null
    readonly x: number
    readonly y: number
    readonly width: number
  }
  readonly chair: { readonly id: ChairId | null; readonly x: number; readonly y: number; readonly scale: number }
  /** Accessory units in paint order (back to front). */
  readonly accessories: readonly Placement[]
}

const MONITOR_GAP = 8
const MONITOR_MARGIN = 10
/** Desk space kept free beside the monitor row for the lamp (left) and a desk plant (right). */
const LAMP_ZONE = 46
const PLANT_ZONE = 40
const KEYBOARD_HALF_WIDTH = 58
const KEYBOARD_OFFSET_X = -12

/** Back-to-front paint order. Monitors are laid out separately as a centred row. */
const SLOT_ORDER: readonly Exclude<AccessorySlot, 'monitor'>[] = [
  'plant',
  'lamp',
  'laptop-stand',
  'headphones',
  'keyboard',
]

/**
 * Pure scene layout: turns a setup into positions. Kept free of React so it can be
 * unit-tested and so the drawing code holds no geometry logic.
 */
export function layoutScene(state: WorkspaceState): SceneLayout {
  const cx = SCENE.centerX
  const floor = SCENE.floorY
  const width = state.deskId ? deskWidthPx(getDesk(state.deskId).size.widthCm) : GHOST_DESK_WIDTH
  const left = cx - width / 2
  const right = cx + width / 2
  const backRowY = floor - DESK_HEIGHT - DESK_TOP_DEPTH + 6
  const frontRowY = floor - DESK_HEIGHT - 2

  const accessories: Placement[] = []

  // Every unit in a slot, in catalog order, numbered per product.
  const unitsIn = (slot: AccessorySlot) =>
    ACCESSORIES.filter((accessory) => accessory.slot === slot).flatMap((accessory) =>
      Array.from({ length: state.accessories[accessory.id] ?? 0 }, (_, index) => ({ id: accessory.id, index })),
    )

  // Monitors: a row along the back of the desk, centred in the space the lamp and desk
  // plant leave free, and shrunk if they wouldn't fit.
  const monitors = unitsIn('monitor')
  const rowLeft = left + MONITOR_MARGIN + (unitsIn('lamp').length > 0 ? LAMP_ZONE : 0)
  const rowRight = right - MONITOR_MARGIN - (unitsIn('plant').length > 0 ? PLANT_ZONE : 0)
  const rowWidth = monitors.reduce((sum, { id }) => sum + ART[id].width, 0) + MONITOR_GAP * Math.max(0, monitors.length - 1)
  const monitorScale = rowWidth > 0 ? Math.min(1, (rowRight - rowLeft) / rowWidth) : 1
  let cursor = (rowLeft + rowRight) / 2 - (rowWidth * monitorScale) / 2
  for (const { id, index } of monitors) {
    const w = ART[id].width * monitorScale
    accessories.push({ key: `${id}#${index}`, productId: id, x: cursor + w / 2, y: backRowY, scale: monitorScale })
    cursor += w + MONITOR_GAP * monitorScale
  }

  // Everything else has a fixed spot relative to the desk. The nth unit in a slot
  // can go somewhere different (the second plant stands on the floor).
  const spot: Record<(typeof SLOT_ORDER)[number], (n: number) => { x: number; y: number; scale?: number }> = {
    plant: (n) =>
      n === 0 ? { x: right - 30, y: backRowY, scale: 0.85 } : { x: right + 58 + (n - 1) * 64, y: floor + 10, scale: 1.5 },
    lamp: (n) => ({ x: left + 30 + n * 40, y: backRowY }),
    'laptop-stand': (n) => ({ x: cx + width * 0.3 + n * 20, y: frontRowY }),
    // Left of the keyboard, never on top of it.
    headphones: (n) => ({
      x: Math.min(cx - width * 0.27, cx + KEYBOARD_OFFSET_X - KEYBOARD_HALF_WIDTH - 34) - n * 20,
      y: frontRowY,
    }),
    keyboard: (n) => ({ x: cx + KEYBOARD_OFFSET_X, y: frontRowY + n * 6 }),
  }

  for (const slot of SLOT_ORDER) {
    unitsIn(slot).forEach(({ id, index }, n) => {
      const { x, y, scale = 1 } = spot[slot](n)
      accessories.push({ key: `${id}#${index}`, productId: id, x, y, scale })
    })
  }

  return {
    desk: { id: state.deskId, x: cx, y: floor, width },
    chair: { id: state.chairId, x: cx, y: floor + CHAIR_OFFSET_Y, scale: CHAIR_SCALE },
    accessories,
  }
}
