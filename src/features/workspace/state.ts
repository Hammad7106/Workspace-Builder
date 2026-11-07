import type { AccessoryId, BillingPeriod, ChairId, DeskId } from '@/features/catalog'
import { DEFAULT_BILLING_PERIOD } from '@/lib/pricing'

/** Units rented per accessory. Absent ids mean zero; zero is never stored. */
export type AccessoryQuantities = Readonly<Partial<Record<AccessoryId, number>>>

/** The user's workspace setup: the single source of truth for builder, preview and checkout. */
export interface WorkspaceState {
  readonly deskId: DeskId | null
  readonly chairId: ChairId | null
  readonly accessories: AccessoryQuantities
  readonly billingPeriod: BillingPeriod
}

export const EMPTY_WORKSPACE: WorkspaceState = {
  deskId: null,
  chairId: null,
  accessories: {},
  billingPeriod: DEFAULT_BILLING_PERIOD,
}
