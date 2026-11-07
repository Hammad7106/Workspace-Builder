import { describe, expect, it } from 'vitest'
import { WEEKS_PER_MONTH } from '@/lib/pricing'
import {
  ACCESSORIES,
  CATEGORIES,
  CHAIRS,
  DESKS,
  PRODUCTS,
  getAccessory,
  getChair,
  getDesk,
  getProduct,
  getProductsByCategory,
  isAccessoryId,
  isChairId,
  isDeskId,
  isProductId,
} from '.'

describe('catalog data', () => {
  it('has unique product ids', () => {
    const ids = PRODUCTS.map((product) => product.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('offers at least two desks and two chairs to choose from', () => {
    expect(DESKS.length).toBeGreaterThanOrEqual(2)
    expect(CHAIRS.length).toBeGreaterThanOrEqual(2)
  })

  it('offers monitors, lamps and plants as accessories', () => {
    const slots = new Set(ACCESSORIES.map((accessory) => accessory.slot))
    expect([...slots]).toEqual(expect.arrayContaining(['monitor', 'lamp', 'plant']))
  })

  it.each(PRODUCTS.map((product) => [product.id, product] as const))(
    '%s has positive whole-cent prices with a cheaper monthly plan',
    (_id, product) => {
      for (const amount of [product.price.week, product.price.month]) {
        expect(Number.isInteger(amount)).toBe(true)
        expect(amount).toBeGreaterThan(0)
      }
      expect(product.price.month).toBeLessThan(product.price.week * WEEKS_PER_MONTH)
    },
  )

  it('gives every desk room for at least one monitor', () => {
    for (const desk of DESKS) expect(desk.monitorCapacity).toBeGreaterThanOrEqual(1)
  })

  it('gives every accessory a positive whole max quantity', () => {
    for (const accessory of ACCESSORIES) {
      expect(Number.isInteger(accessory.maxQuantity)).toBe(true)
      expect(accessory.maxQuantity).toBeGreaterThanOrEqual(1)
    }
  })

  it('has a tab for every category that has products', () => {
    const productCategories = new Set(PRODUCTS.map((product) => product.category))
    expect(new Set(CATEGORIES.map((category) => category.id))).toEqual(productCategories)
  })
})

describe('catalog lookups', () => {
  it('finds a product by id', () => {
    expect(getProduct('desk-electric').name).toBe('Electric Standing Desk')
  })

  it('validates untrusted ids', () => {
    expect(isProductId('chair-ergonomic')).toBe(true)
    expect(isProductId('chair-throne')).toBe(false)
  })

  it('filters products by category in display order', () => {
    expect(getProductsByCategory('chair').map((chair) => chair.id)).toEqual(CHAIRS.map((chair) => chair.id))
    expect(getProductsByCategory('accessory').every((product) => product.category === 'accessory')).toBe(true)
  })
})

describe('typed lookups', () => {
  it('narrows ids to their category', () => {
    expect(isDeskId('desk-electric')).toBe(true)
    expect(isDeskId('chair-task')).toBe(false)
    expect(isChairId('chair-task')).toBe(true)
    expect(isAccessoryId('lamp-led')).toBe(true)
    expect(isAccessoryId(42)).toBe(false)
  })

  it('returns category-specific products', () => {
    expect(getDesk('desk-dual-motor').monitorCapacity).toBe(3)
    expect(getChair('chair-ergonomic').category).toBe('chair')
    expect(getAccessory('monitor-27-4k').slot).toBe('monitor')
  })
})
