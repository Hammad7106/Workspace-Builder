import { describe, expect, it } from 'vitest'
import { workspaceReducer as reduce, type WorkspaceAction } from './reducer'
import { getAccessoryLimit, MAX_MONITORS } from './rules'
import { EMPTY_WORKSPACE, type WorkspaceState } from './state'

/** Applies actions in order, starting from an empty workspace. */
const run = (...actions: WorkspaceAction[]): WorkspaceState => actions.reduce(reduce, EMPTY_WORKSPACE)

describe('desk & chair selection', () => {
  it('selects exactly one desk, replacing the previous one', () => {
    const state = run(
      { type: 'desk/select', id: 'desk-mechanical' },
      { type: 'desk/select', id: 'desk-electric' },
    )
    expect(state.deskId).toBe('desk-electric')
  })

  it('selects exactly one chair and can clear it', () => {
    expect(run({ type: 'chair/select', id: 'chair-task' }).chairId).toBe('chair-task')
    expect(
      run({ type: 'chair/select', id: 'chair-task' }, { type: 'chair/select', id: null }).chairId,
    ).toBeNull()
  })

  it('returns the same state object when re-selecting the current item', () => {
    const state = run({ type: 'desk/select', id: 'desk-electric' }, { type: 'chair/select', id: 'chair-task' })
    expect(reduce(state, { type: 'desk/select', id: 'desk-electric' })).toBe(state)
    expect(reduce(state, { type: 'chair/select', id: 'chair-task' })).toBe(state)
  })
})

describe('accessories', () => {
  it('adds and removes units, dropping the entry at zero', () => {
    const twoPlants = run({ type: 'accessory/add', id: 'plant-monstera' }, { type: 'accessory/add', id: 'plant-monstera' })
    expect(twoPlants.accessories).toEqual({ 'plant-monstera': 2 })

    const none = run(
      { type: 'accessory/add', id: 'plant-monstera' },
      { type: 'accessory/remove', id: 'plant-monstera' },
    )
    expect(none.accessories).toEqual({})
  })

  it('ignores adding past the product limit', () => {
    const oneLamp = run({ type: 'accessory/add', id: 'lamp-led' })
    expect(reduce(oneLamp, { type: 'accessory/add', id: 'lamp-led' })).toBe(oneLamp)
    expect(getAccessoryLimit(oneLamp, 'lamp-led')).toEqual({ max: 1, reason: 'product-limit' })
  })

  it('ignores removing an accessory that is not in the setup', () => {
    expect(reduce(EMPTY_WORKSPACE, { type: 'accessory/remove', id: 'lamp-led' })).toBe(EMPTY_WORKSPACE)
  })

  it.each([
    [5, { 'plant-monstera': 2 }], // clamped to maxQuantity
    [1.7, { 'plant-monstera': 1 }], // whole units only
    [-3, {}], // removes the accessory
  ])('clamps set-quantity %s', (quantity, expected) => {
    expect(run({ type: 'accessory/set-quantity', id: 'plant-monstera', quantity }).accessories).toEqual(expected)
  })

  it('ignores a non-finite quantity', () => {
    const state = run({ type: 'accessory/add', id: 'plant-monstera' })
    expect(reduce(state, { type: 'accessory/set-quantity', id: 'plant-monstera', quantity: Number.NaN })).toBe(state)
  })
})

describe('monitor capacity', () => {
  it('caps all monitor models combined at the desk capacity', () => {
    const full = run(
      { type: 'desk/select', id: 'desk-mechanical' }, // fits 2
      { type: 'accessory/add', id: 'monitor-24-fhd' },
      { type: 'accessory/add', id: 'monitor-24-fhd' },
    )
    expect(reduce(full, { type: 'accessory/add', id: 'monitor-27-4k' })).toBe(full)
    expect(getAccessoryLimit(full, 'monitor-27-4k')).toEqual({ max: 0, reason: 'slot-capacity' })
  })

  it('allows up to the largest desk capacity before a desk is chosen', () => {
    const state = run(
      { type: 'accessory/set-quantity', id: 'monitor-24-fhd', quantity: 2 },
      { type: 'accessory/set-quantity', id: 'monitor-27-4k', quantity: 5 },
    )
    expect(state.accessories).toEqual({ 'monitor-24-fhd': 2, 'monitor-27-4k': MAX_MONITORS - 2 })
  })

  it('trims monitors when switching to a smaller desk, later catalog items first', () => {
    const state = run(
      { type: 'desk/select', id: 'desk-dual-motor' }, // fits 3
      { type: 'accessory/add', id: 'monitor-27-4k' },
      { type: 'accessory/add', id: 'monitor-24-fhd' },
      { type: 'accessory/add', id: 'monitor-24-fhd' },
      { type: 'accessory/add', id: 'lamp-led' },
      { type: 'desk/select', id: 'desk-electric' }, // fits 2
    )
    expect(state.accessories).toEqual({ 'monitor-24-fhd': 2, 'lamp-led': 1 })
  })
})

describe('billing, reset & load', () => {
  it('switches the billing period', () => {
    expect(run({ type: 'billing/set-period', period: 'week' }).billingPeriod).toBe('week')
  })

  it('resets the setup but keeps the billing period', () => {
    const state = run(
      { type: 'billing/set-period', period: 'week' },
      { type: 'desk/select', id: 'desk-electric' },
      { type: 'accessory/add', id: 'lamp-led' },
      { type: 'setup/reset' },
    )
    expect(state).toEqual({ ...EMPTY_WORKSPACE, billingPeriod: 'week' })
  })

  it('normalizes a loaded setup', () => {
    const state = run({
      type: 'setup/load',
      state: {
        deskId: 'desk-mechanical',
        chairId: 'chair-ergonomic',
        accessories: { 'monitor-24-fhd': 3, 'lamp-led': 4, 'plant-monstera': 0 },
        billingPeriod: 'month',
      },
    })
    expect(state.accessories).toEqual({ 'monitor-24-fhd': 2, 'lamp-led': 1 })
  })
})
