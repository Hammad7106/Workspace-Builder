import { SITE } from '@/config/site'

const priceFormatter = new Intl.NumberFormat(SITE.locale, {
  style: 'currency',
  currency: SITE.currency,
  maximumFractionDigits: 0,
})

/** Formats a whole-rupiah amount, e.g. 1250000 → "IDR 1,250,000". */
export function formatPrice(amount: number): string {
  return priceFormatter.format(amount)
}
