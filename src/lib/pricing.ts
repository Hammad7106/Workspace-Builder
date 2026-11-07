import type { BillingPeriod, Cents, Price } from '@/features/catalog'

/** Average weeks in a month, used to compare monthly prices with weekly ones. */
export const WEEKS_PER_MONTH = 52 / 12

/** Billing plans, in display order. Monthly is the default because it's cheaper. */
export const BILLING_PERIODS = [
  { id: 'week', label: 'Weekly', unit: 'week' },
  { id: 'month', label: 'Monthly', unit: 'month' },
] as const satisfies readonly { id: BillingPeriod; label: string; unit: string }[]

export const DEFAULT_BILLING_PERIOD: BillingPeriod = 'month'

/** One line of a setup: a product's price and how many units are rented. */
export interface QuoteLine {
  readonly price: Price
  readonly quantity: number
}

export interface Quote {
  readonly period: BillingPeriod
  /** Total units across all lines. */
  readonly itemCount: number
  /** Amount billed each period. */
  readonly total: Cents
  /**
   * What the monthly plan saves per month compared with paying weekly for a
   * month. Always 0 on the weekly plan.
   */
  readonly savings: Cents
}

/** Prices a set of lines for one billing period. Throws on invalid quantities. */
export function calculateQuote(lines: readonly QuoteLine[], period: BillingPeriod): Quote {
  let itemCount = 0
  let total = 0
  let weeklyTotal = 0

  for (const { price, quantity } of lines) {
    if (!Number.isInteger(quantity) || quantity < 0) {
      throw new RangeError(`Quantity must be a non-negative integer, got ${quantity}`)
    }
    itemCount += quantity
    total += price[period] * quantity
    weeklyTotal += price.week * quantity
  }

  const savings = period === 'month' ? Math.max(0, Math.round(weeklyTotal * WEEKS_PER_MONTH) - total) : 0

  return { period, itemCount, total, savings }
}

/**
 * How much cheaper the monthly plan is than paying weekly, as a whole percentage
 * (e.g. 31 for "Save 31%"). Returns 0 if monthly is not cheaper.
 */
export function monthlySavingsPercent(price: Price): number {
  const weeklyForAMonth = price.week * WEEKS_PER_MONTH
  if (weeklyForAMonth <= 0) return 0
  return Math.max(0, Math.round((1 - price.month / weeklyForAMonth) * 100))
}
