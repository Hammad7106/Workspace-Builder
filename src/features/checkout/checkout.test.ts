import { describe, expect, it } from 'vitest'
import { EMPTY_WORKSPACE, type WorkspaceState } from '@/features/workspace'
import {
  buildRentalRequest,
  calculateTermTotal,
  earliestStartDate,
  EMPTY_DETAILS,
  periodLabel,
  toLocalISODate,
  validateDetails,
  type CustomerDetails,
} from './checkout'

const today = new Date(2026, 10, 8) // 8 Nov 2026, local time

const valid: CustomerDetails = {
  name: 'Made Wirawan',
  email: 'made@example.com',
  phone: '+62 812-3456-7890',
  area: 'Canggu',
  address: 'Villa Kayu, Jl. Batu Bolong 12',
  startDate: '2026-11-09',
  notes: '',
}

const setup: WorkspaceState = {
  ...EMPTY_WORKSPACE,
  deskId: 'desk-electric', // $5/wk · $14.50/mo
  chairId: 'chair-ergonomic', // $4/wk · $11/mo
  accessories: { 'monitor-24-fhd': 2 }, // 2 × ($5/wk · $14/mo)
}

describe('dates', () => {
  it('formats local dates as yyyy-mm-dd', () => {
    expect(toLocalISODate(new Date(2026, 0, 5))).toBe('2026-01-05')
  })

  it('offers next-day delivery at the earliest, across month ends', () => {
    expect(earliestStartDate(today)).toBe('2026-11-09')
    expect(earliestStartDate(new Date(2026, 11, 31))).toBe('2027-01-01')
  })
})

describe('validateDetails', () => {
  it('accepts complete, valid details', () => {
    expect(validateDetails(valid, today)).toEqual({})
  })

  it('flags every required field on an empty form', () => {
    expect(Object.keys(validateDetails(EMPTY_DETAILS, today)).sort()).toEqual(
      ['address', 'area', 'email', 'name', 'phone', 'startDate'].sort(),
    )
  })

  it.each([
    ['email', 'made@example'],
    ['email', 'made example.com'],
    ['phone', '12345'],
    ['phone', '+62 812 abc 7890'],
    ['name', ' '],
    ['address', 'Bali'],
  ] as const)('rejects an invalid %s: %j', (field, value) => {
    expect(validateDetails({ ...valid, [field]: value }, today)).toHaveProperty(field)
  })

  it.each(['+6281234567890', '0812 3456 7890', '(0812) 3456-7890', '+49 151 2345 6789'])(
    'accepts the phone format %j',
    (phone) => {
      expect(validateDetails({ ...valid, phone }, today)).toEqual({})
    },
  )

  it('requires a delivery date from tomorrow onwards', () => {
    expect(validateDetails({ ...valid, startDate: '2026-11-08' }, today).startDate).toBe(
      'The earliest delivery is tomorrow.',
    )
    expect(validateDetails({ ...valid, startDate: '' }, today).startDate).toBe('Please choose a delivery date.')
  })

  it('allows the notes to be empty', () => {
    expect(validateDetails({ ...valid, notes: '' }, today)).not.toHaveProperty('notes')
  })
})

describe('pricing the term', () => {
  it('multiplies the period price by the term', () => {
    expect(calculateTermTotal(setup, 3)).toMatchObject({ total: 5350, termTotal: 16050, term: 3 })
  })

  it('uses weekly prices on the weekly plan', () => {
    expect(calculateTermTotal({ ...setup, billingPeriod: 'week' }, 2)).toMatchObject({ total: 1900, termTotal: 3800 })
  })

  it('pluralises period labels', () => {
    expect(periodLabel('month', 1)).toBe('1 month')
    expect(periodLabel('week', 3)).toBe('3 weeks')
  })
})

describe('buildRentalRequest', () => {
  it('snapshots the setup, price and trimmed customer details', () => {
    const request = buildRentalRequest(setup, 3, { ...valid, name: '  Made Wirawan  ', notes: ' Gate code 1234 ' })
    expect(request).toEqual({
      items: [
        { productId: 'desk-electric', name: 'Electric Standing Desk', quantity: 1, unitPrice: 1450 },
        { productId: 'chair-ergonomic', name: 'Ergonomic Office Chair', quantity: 1, unitPrice: 1100 },
        { productId: 'monitor-24-fhd', name: '24" Full HD Monitor', quantity: 2, unitPrice: 1400 },
      ],
      billingPeriod: 'month',
      term: 3,
      pricePerPeriod: 5350,
      termTotal: 16050,
      customer: { name: 'Made Wirawan', email: 'made@example.com', phone: '+62 812-3456-7890' },
      delivery: { area: 'Canggu', address: 'Villa Kayu, Jl. Batu Bolong 12', startDate: '2026-11-09' },
      notes: 'Gate code 1234',
    })
  })
})
