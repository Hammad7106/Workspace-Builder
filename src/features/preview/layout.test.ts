import { describe, expect, it } from 'vitest'
import { DESKS } from '@/features/catalog'
import { EMPTY_WORKSPACE, type WorkspaceState } from '@/features/workspace'
import { ART } from './art/registry'
import { DESK_HEIGHT, GHOST_DESK_WIDTH, SCENE, deskWidthPx } from './geometry'
import { layoutScene, type Placement } from './layout'

const setup = (overrides: Partial<WorkspaceState>): WorkspaceState => ({ ...EMPTY_WORKSPACE, ...overrides })
const ofProduct = (placements: readonly Placement[], id: string) => placements.filter((p) => p.productId === id)
const halfWidth = (p: Placement) => (ART[p.productId].width * p.scale) / 2

describe('layoutScene', () => {
  it('draws a placeholder desk and chair for an empty setup', () => {
    const layout = layoutScene(EMPTY_WORKSPACE)
    expect(layout.desk).toMatchObject({ id: null, width: GHOST_DESK_WIDTH })
    expect(layout.chair.id).toBeNull()
    expect(layout.accessories).toEqual([])
  })

  it('draws each desk to scale', () => {
    for (const desk of DESKS) {
      expect(layoutScene(setup({ deskId: desk.id })).desk.width).toBe(deskWidthPx(desk.size.widthCm))
    }
  })

  it('places one unit per quantity, with unique keys', () => {
    const { accessories } = layoutScene(
      setup({ deskId: 'desk-dual-motor', accessories: { 'monitor-24-fhd': 2, 'monitor-27-4k': 1, 'plant-monstera': 2 } }),
    )
    expect(ofProduct(accessories, 'monitor-24-fhd')).toHaveLength(2)
    expect(ofProduct(accessories, 'monitor-27-4k')).toHaveLength(1)
    expect(ofProduct(accessories, 'plant-monstera')).toHaveLength(2)
    expect(new Set(accessories.map((p) => p.key)).size).toBe(accessories.length)
  })

  it('centres a lone monitor at full size when there is room', () => {
    const [monitor] = layoutScene(setup({ deskId: 'desk-electric', accessories: { 'monitor-24-fhd': 1 } })).accessories
    expect(monitor).toMatchObject({ x: SCENE.centerX, scale: 1 })
  })

  it.each(DESKS.map((desk) => [desk.id, desk.monitorCapacity] as const))(
    'fits a full row of monitors on the %s without hitting the lamp or plant',
    (deskId, capacity) => {
      const { desk, accessories } = layoutScene(
        setup({ deskId, accessories: { 'monitor-27-4k': capacity, 'lamp-led': 1, 'plant-monstera': 1 } }),
      )
      const monitors = ofProduct(accessories, 'monitor-27-4k')
      const lamp = ofProduct(accessories, 'lamp-led')[0]
      const plant = ofProduct(accessories, 'plant-monstera')[0]

      // Left to right, not overlapping each other.
      for (let i = 1; i < monitors.length; i++) {
        expect(monitors[i].x - halfWidth(monitors[i])).toBeGreaterThanOrEqual(monitors[i - 1].x + halfWidth(monitors[i - 1]))
      }
      // Clear of the lamp base and the plant pot, and on the desk.
      expect(monitors[0].x - halfWidth(monitors[0])).toBeGreaterThan(lamp.x + 18)
      expect(monitors.at(-1)!.x + halfWidth(monitors.at(-1)!)).toBeLessThan(plant.x - 21 * plant.scale)
      expect(monitors[0].x - halfWidth(monitors[0])).toBeGreaterThanOrEqual(desk.x - desk.width / 2)
    },
  )

  it('puts the first plant on the desk and the second on the floor', () => {
    const [onDesk, onFloor] = ofProduct(
      layoutScene(setup({ deskId: 'desk-mechanical', accessories: { 'plant-monstera': 2 } })).accessories,
      'plant-monstera',
    )
    expect(onDesk.y).toBeLessThan(SCENE.floorY - DESK_HEIGHT)
    expect(onFloor.y).toBeGreaterThan(SCENE.floorY)
  })

  it.each(DESKS.map((desk) => desk.id))('keeps the headphones clear of the keyboard on the %s', (deskId) => {
    const { accessories } = layoutScene(setup({ deskId, accessories: { 'headphones-anc': 1, 'keyboard-mouse': 1 } }))
    const [headphones] = ofProduct(accessories, 'headphones-anc')
    const [keyboard] = ofProduct(accessories, 'keyboard-mouse')
    expect(headphones.x + halfWidth(headphones)).toBeLessThanOrEqual(keyboard.x - 58)
  })

  it('paints back-row items before front-row items', () => {
    const order = layoutScene(
      setup({ deskId: 'desk-electric', accessories: { 'keyboard-mouse': 1, 'lamp-led': 1, 'monitor-24-fhd': 1 } }),
    ).accessories.map((p) => p.productId)
    expect(order).toEqual(['monitor-24-fhd', 'lamp-led', 'keyboard-mouse'])
  })

  it('stands the chair in front of the desk', () => {
    const { chair, desk } = layoutScene(setup({ deskId: 'desk-electric', chairId: 'chair-task' }))
    expect(chair).toMatchObject({ id: 'chair-task', x: desk.x })
    expect(chair.y).toBeGreaterThan(desk.y)
  })
})
