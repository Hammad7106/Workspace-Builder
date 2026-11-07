/**
 * Domain model for everything a user can rent.
 *
 * Money is stored as integer US cents (monis.rent bills in USD) so totals never
 * suffer from floating-point drift. Format it for display with `formatPrice`.
 */

/** An amount of money in whole US cents, e.g. 350 = $3.50. */
export type Cents = number

/** How often the rent is billed. monis.rent offers weekly and (cheaper) monthly plans. */
export type BillingPeriod = 'week' | 'month'

/** Rental price per billing period. The monthly rate is discounted vs. paying weekly. */
export type Price = Readonly<Record<BillingPeriod, Cents>>

interface BaseProduct {
  readonly id: string
  readonly name: string
  /** One-line pitch shown on the product card. */
  readonly description: string
  /** Two or three short selling points. */
  readonly highlights: readonly string[]
  readonly price: Price
}

export interface Desk extends BaseProduct {
  readonly category: 'desk'
  readonly size: { readonly widthCm: number; readonly depthCm: number }
  /** How many monitors fit side by side on this desk (all monitor products combined). */
  readonly monitorCapacity: number
}

export interface Chair extends BaseProduct {
  readonly category: 'chair'
}

/**
 * Where an accessory lives in the workspace. The preview maps each slot to a
 * position in the scene; products sharing a slot (e.g. two monitor models) also
 * share any capacity limits.
 */
export type AccessorySlot = 'monitor' | 'lamp' | 'laptop-stand' | 'keyboard' | 'headphones' | 'plant'

export interface Accessory extends BaseProduct {
  readonly category: 'accessory'
  readonly slot: AccessorySlot
  /** Most units of this product a single setup can hold. */
  readonly maxQuantity: number
}

export type Product = Desk | Chair | Accessory
export type Category = Product['category']
