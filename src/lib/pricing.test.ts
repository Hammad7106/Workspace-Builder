import { describe, expect, it } from 'vitest'
import { calculateQuote, monthlySavingsPercent, type QuoteLine } from './pricing'

const desk: QuoteLine = { price: { week: 500, month: 1450 }, quantity: 1 }
const monitors: QuoteLine = { price: { week: 500, month: 1400 }, quantity: 2 }
const plant: QuoteLine = { price: { week: 50, month: 150 }, quantity: 1 }

describe('calculateQuote', () => {
  it('returns an empty quote for an empty setup', () => {
    expect(calculateQuote([], 'month')).toEqual({ period: 'month', itemCount: 0, total: 0, savings: 0 })
  })

  it('sums monthly prices × quantity and reports the saving vs. paying weekly', () => {
    // Weekly total 1550¢ × 52/12 weeks = 6716.67 → 6717¢; monthly total 4400¢.
    expect(calculateQuote([desk, monitors, plant], 'month')).toEqual({
      period: 'month',
      itemCount: 4,
      total: 4400,
      savings: 2317,
    })
  })

  it('sums weekly prices and never reports a saving on the weekly plan', () => {
    expect(calculateQuote([desk, monitors, plant], 'week')).toEqual({
      period: 'week',
      itemCount: 4,
      total: 1550,
      savings: 0,
    })
  })

  it('ignores lines with zero quantity', () => {
    expect(calculateQuote([{ ...desk, quantity: 0 }], 'month').total).toBe(0)
  })

  it('never reports a negative saving', () => {
    const pricey: QuoteLine = { price: { week: 100, month: 1000 }, quantity: 1 }
    expect(calculateQuote([pricey], 'month').savings).toBe(0)
  })

  it.each([-1, 1.5, Number.NaN])('rejects invalid quantity %s', (quantity) => {
    expect(() => calculateQuote([{ ...desk, quantity }], 'month')).toThrow(RangeError)
  })
})

describe('monthlySavingsPercent', () => {
  it('rounds the monthly discount to a whole percentage', () => {
    // 300¢/week ≈ 1300¢/month; 900¢ monthly saves ~30.8%.
    expect(monthlySavingsPercent({ week: 300, month: 900 })).toBe(31)
  })

  it('returns 0 when monthly is not cheaper or the price is free', () => {
    expect(monthlySavingsPercent({ week: 100, month: 1000 })).toBe(0)
    expect(monthlySavingsPercent({ week: 0, month: 0 })).toBe(0)
  })
})
