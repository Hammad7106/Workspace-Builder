import { describe, expect, it } from 'vitest'
import { formatPrice } from './format'

describe('formatPrice', () => {
  it.each([
    [0, '$0'],
    [50, '$0.50'],
    [1450, '$14.50'],
    [1900, '$19'],
    [123456, '$1,234.56'],
  ])('formats %i cents as %s', (cents, expected) => {
    expect(formatPrice(cents)).toBe(expected)
  })
})
