import type { ComponentType } from 'react'
import { getDesk, type DeskId, type ProductId } from '@/features/catalog'
import { DESK_HEIGHT, DESK_TOP_DEPTH, deskWidthPx } from '../geometry'
import {
  DeskLamp,
  HeadphonesOnStand,
  KeyboardMouse,
  LaptopOnStand,
  Monitor24,
  Monitor27,
  Monstera,
} from './accessories'
import { BalanceStool, ErgonomicChair, TaskChair } from './chairs'
import { DualMotorDesk, ElectricDesk, MechanicalDesk } from './desks'

export interface ArtSpec {
  /** Draws the product with its origin at bottom-centre. */
  readonly Art: ComponentType
  /** Bounding box, used for layout and thumbnails. */
  readonly width: number
  readonly height: number
}

const desk = (id: DeskId, Art: ComponentType): ArtSpec => ({
  Art,
  width: deskWidthPx(getDesk(id).size.widthCm),
  height: DESK_HEIGHT + DESK_TOP_DEPTH,
})

/**
 * Artwork for every product. Keyed by `ProductId`, so adding a product to the catalog
 * without drawing it is a compile error.
 */
export const ART: Readonly<Record<ProductId, ArtSpec>> = {
  'desk-mechanical': desk('desk-mechanical', MechanicalDesk),
  'desk-electric': desk('desk-electric', ElectricDesk),
  'desk-dual-motor': desk('desk-dual-motor', DualMotorDesk),
  'chair-task': { Art: TaskChair, width: 124, height: 176 },
  'chair-ergonomic': { Art: ErgonomicChair, width: 156, height: 224 },
  'chair-balance-stool': { Art: BalanceStool, width: 92, height: 124 },
  'monitor-24-fhd': { Art: Monitor24, width: 120, height: 98 },
  'monitor-27-4k': { Art: Monitor27, width: 146, height: 116 },
  'lamp-led': { Art: DeskLamp, width: 130, height: 100 },
  'laptop-stand': { Art: LaptopOnStand, width: 72, height: 78 },
  'keyboard-mouse': { Art: KeyboardMouse, width: 168, height: 14 },
  'headphones-anc': { Art: HeadphonesOnStand, width: 60, height: 66 },
  'plant-monstera': { Art: Monstera, width: 92, height: 106 },
}
