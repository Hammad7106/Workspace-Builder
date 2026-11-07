import type { BillingPeriod, ProductId } from '@/features/catalog'
import { selectLines, selectQuote, type WorkspaceState } from '@/features/workspace'

/** Areas monis.rent delivers to, roughly north-west to south-east. */
export const DELIVERY_AREAS = [
  'Canggu',
  'Pererenan',
  'Seminyak',
  'Kerobokan',
  'Ubud',
  'Denpasar',
  'Sanur',
  'Uluwatu',
  'Other (we will confirm)',
] as const
export type DeliveryArea = (typeof DELIVERY_AREAS)[number]

/** How many billing periods can be booked up front. Rentals can be extended later. */
export const MAX_TERM = 12

export const periodLabel = (period: BillingPeriod, count: number) => `${count} ${period}${count === 1 ? '' : 's'}`

/** What the customer types into the details form. All strings, exactly as entered. */
export interface CustomerDetails {
  name: string
  email: string
  phone: string
  area: DeliveryArea | ''
  address: string
  /** Local date as yyyy-mm-dd (the value of an `<input type="date">`). */
  startDate: string
  notes: string
}

export const EMPTY_DETAILS: CustomerDetails = {
  name: '',
  email: '',
  phone: '',
  area: '',
  address: '',
  startDate: '',
  notes: '',
}

export type DetailErrors = Partial<Record<keyof CustomerDetails, string>>

/** Formats a date as yyyy-mm-dd in the user's local time zone. */
export function toLocalISODate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** Next-day delivery is the earliest monis.rent offers. */
export function earliestStartDate(today: Date): string {
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  return toLocalISODate(tomorrow)
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE = /^\+?\d{8,15}$/

/** Validates the details form. Returns an error message per invalid field (empty = valid). */
export function validateDetails(details: CustomerDetails, today: Date): DetailErrors {
  const errors: DetailErrors = {}

  if (details.name.trim().length < 2) errors.name = 'Please enter your name.'
  if (!EMAIL.test(details.email.trim())) errors.email = 'Please enter a valid email, e.g. you@example.com.'
  if (!PHONE.test(details.phone.replace(/[\s\-().]/g, ''))) {
    errors.phone = 'Please enter a WhatsApp number with country code, e.g. +62 812 3456 7890.'
  }
  if (!details.area) errors.area = 'Please choose a delivery area.'
  if (details.address.trim().length < 5) errors.address = 'Please add your villa, street or coworking space.'

  if (!/^\d{4}-\d{2}-\d{2}$/.test(details.startDate)) {
    errors.startDate = 'Please choose a delivery date.'
  } else if (details.startDate < earliestStartDate(today)) {
    // yyyy-mm-dd strings compare correctly as text.
    errors.startDate = 'The earliest delivery is tomorrow.'
  }

  return errors
}

/** The payload sent to monis.rent: a snapshot of the setup, the price, and the customer. */
export interface RentalRequest {
  readonly items: readonly {
    readonly productId: ProductId
    readonly name: string
    readonly quantity: number
    /** Price per unit per billing period, in cents. */
    readonly unitPrice: number
  }[]
  readonly billingPeriod: BillingPeriod
  /** Number of billing periods booked up front. */
  readonly term: number
  /** Cents billed each period. */
  readonly pricePerPeriod: number
  /** Cents for the whole term. */
  readonly termTotal: number
  readonly customer: { readonly name: string; readonly email: string; readonly phone: string }
  readonly delivery: { readonly area: DeliveryArea; readonly address: string; readonly startDate: string }
  readonly notes: string
}

/** The total for booking `term` billing periods up front. */
export function calculateTermTotal(state: WorkspaceState, term: number) {
  const quote = selectQuote(state)
  return { ...quote, term, termTotal: quote.total * term, termSavings: quote.savings * term }
}

/** Builds the request from the setup and already-validated details. */
export function buildRentalRequest(state: WorkspaceState, term: number, details: CustomerDetails): RentalRequest {
  if (!details.area) throw new Error('buildRentalRequest needs validated details')
  const { total, termTotal } = calculateTermTotal(state, term)

  return {
    items: selectLines(state).map(({ product, quantity }) => ({
      productId: product.id,
      name: product.name,
      quantity,
      unitPrice: product.price[state.billingPeriod],
    })),
    billingPeriod: state.billingPeriod,
    term,
    pricePerPeriod: total,
    termTotal,
    customer: { name: details.name.trim(), email: details.email.trim(), phone: details.phone.trim() },
    delivery: { area: details.area, address: details.address.trim(), startDate: details.startDate },
    notes: details.notes.trim(),
  }
}
