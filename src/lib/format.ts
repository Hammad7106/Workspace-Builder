import { SITE } from '@/config/site'
import type { Cents } from '@/features/catalog'

const wholeFormatter = new Intl.NumberFormat(SITE.locale, {
  style: 'currency',
  currency: SITE.currency,
  maximumFractionDigits: 0,
})

const fractionalFormatter = new Intl.NumberFormat(SITE.locale, {
  style: 'currency',
  currency: SITE.currency,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/**
 * Formats an amount in cents. Whole dollars drop the decimals:
 * 1900 → "$19", 1450 → "$14.50", 50 → "$0.50".
 */
export function formatPrice(amount: Cents): string {
  const formatter = amount % 100 === 0 ? wholeFormatter : fractionalFormatter
  return formatter.format(amount / 100)
}
