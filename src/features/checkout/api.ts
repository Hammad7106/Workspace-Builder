import type { RentalRequest } from './checkout'

export interface RentalConfirmation {
  /** Short code the customer can quote on WhatsApp, e.g. "MON-4K7Q2X". */
  reference: string
}

/**
 * Sends a rental request to monis.rent.
 *
 * There is no backend for this exercise, so the request is simulated with a short delay.
 * This is the single place to swap in a real endpoint (e.g. `fetch('/api/rentals')`)
 * or a WhatsApp / email hand-off.
 */
export async function submitRentalRequest(request: RentalRequest): Promise<RentalConfirmation> {
  await new Promise((resolve) => setTimeout(resolve, 900))
  if (import.meta.env.DEV) console.info('[checkout] rental request', request)

  const code = Math.random().toString(36).slice(2, 8).toUpperCase().padEnd(6, '0')
  return { reference: `MON-${code}` }
}
