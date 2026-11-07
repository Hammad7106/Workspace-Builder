import { describe, expect, it } from 'vitest'
import { loadSetup, parseSetup, saveSetup, STORAGE_KEY } from './persistence'
import { EMPTY_WORKSPACE, type WorkspaceState } from './state'

const setup: WorkspaceState = {
  deskId: 'desk-dual-motor',
  chairId: 'chair-task',
  accessories: { 'monitor-27-4k': 3, 'lamp-led': 1 },
  billingPeriod: 'week',
}

/** A minimal in-memory stand-in for localStorage. */
function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial))
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
  }
}

const brokenStorage = {
  getItem: () => {
    throw new Error('SecurityError')
  },
  setItem: () => {
    throw new Error('QuotaExceededError')
  },
}

describe('parseSetup', () => {
  it('accepts a valid setup unchanged', () => {
    expect(parseSetup(setup)).toEqual(setup)
  })

  it.each([null, 'desk', 42, undefined])('rejects non-object input %s', (input) => {
    expect(parseSetup(input)).toBeNull()
  })

  it('drops unknown or mistyped products and defaults the billing period', () => {
    expect(
      parseSetup({
        deskId: 'desk-gold-plated',
        chairId: 'desk-electric', // a desk is not a chair
        accessories: { 'lamp-led': 1, 'jetpack': 1, 'plant-monstera': '2' },
        billingPeriod: 'yearly',
      }),
    ).toEqual({ ...EMPTY_WORKSPACE, accessories: { 'lamp-led': 1 } })
  })

  it('enforces the setup rules on stored data', () => {
    const parsed = parseSetup({ ...setup, deskId: 'desk-mechanical' })
    expect(parsed?.accessories).toEqual({ 'monitor-27-4k': 2, 'lamp-led': 1 })
  })
})

describe('loadSetup / saveSetup', () => {
  it('round-trips a setup through storage', () => {
    const storage = memoryStorage()
    saveSetup(setup, storage)
    expect(loadSetup(storage)).toEqual(setup)
  })

  it('returns null when nothing is saved or the data is corrupt', () => {
    expect(loadSetup(memoryStorage())).toBeNull()
    expect(loadSetup(memoryStorage({ [STORAGE_KEY]: '{not json' }))).toBeNull()
  })

  it('never throws when storage is unavailable', () => {
    expect(loadSetup(brokenStorage)).toBeNull()
    expect(() => saveSetup(setup, brokenStorage)).not.toThrow()
    expect(loadSetup(null)).toBeNull()
  })
})
