import { describe, expect, it } from 'vitest'
import { selectIsEmpty, selectIsReadyToRent, selectLines, selectQuote } from './selectors'
import { EMPTY_WORKSPACE, type WorkspaceState } from './state'

const setup: WorkspaceState = {
  deskId: 'desk-electric', // $5/week, $14.50/month
  chairId: 'chair-ergonomic', // $4/week, $11/month
  accessories: { 'plant-monstera': 1, 'monitor-24-fhd': 2 }, // $0.50/$1.50 and 2 × $5/$14
  billingPeriod: 'month',
}

describe('selectLines', () => {
  it('lists desk, chair, then accessories in catalog order', () => {
    expect(selectLines(setup).map(({ product, quantity }) => [product.id, quantity])).toEqual([
      ['desk-electric', 1],
      ['chair-ergonomic', 1],
      ['monitor-24-fhd', 2],
      ['plant-monstera', 1],
    ])
  })

  it('is empty for an empty workspace', () => {
    expect(selectLines(EMPTY_WORKSPACE)).toEqual([])
  })
})

describe('selectQuote', () => {
  it('prices the setup for the monthly plan', () => {
    expect(selectQuote(setup)).toMatchObject({ period: 'month', itemCount: 5, total: 1450 + 1100 + 2800 + 150 })
  })

  it('prices the setup for the weekly plan', () => {
    expect(selectQuote({ ...setup, billingPeriod: 'week' })).toMatchObject({
      period: 'week',
      total: 500 + 400 + 1000 + 50,
      savings: 0,
    })
  })
})

describe('setup status', () => {
  it('is ready to rent only with both a desk and a chair', () => {
    expect(selectIsReadyToRent(setup)).toBe(true)
    expect(selectIsReadyToRent({ ...setup, chairId: null })).toBe(false)
    expect(selectIsReadyToRent({ ...setup, deskId: null })).toBe(false)
  })

  it('knows when nothing has been picked', () => {
    expect(selectIsEmpty(EMPTY_WORKSPACE)).toBe(true)
    expect(selectIsEmpty({ ...EMPTY_WORKSPACE, accessories: { 'lamp-led': 1 } })).toBe(false)
  })
})
