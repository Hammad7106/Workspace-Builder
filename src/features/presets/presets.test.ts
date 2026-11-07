import { describe, expect, it } from 'vitest'
import { ACCESSORIES } from '@/features/catalog'
import { normalizeWorkspace, selectIsReadyToRent, selectIsSameSetup } from '@/features/workspace'
import { seededRandom } from '@/test/random'
import { PRESETS, presetToSetup, randomSetup, surpriseSetup } from './presets'

const monitorCount = (accessories: Partial<Record<string, number>>) =>
  ACCESSORIES.filter((a) => a.slot === 'monitor').reduce((sum, a) => sum + (accessories[a.id] ?? 0), 0)

describe('presets', () => {
  it('have unique ids', () => {
    expect(new Set(PRESETS.map((p) => p.id)).size).toBe(PRESETS.length)
  })

  it.each(PRESETS.map((p) => [p.name, p] as const))('%s is a complete setup that obeys every rule', (_name, preset) => {
    const setup = presetToSetup(preset, 'month')
    // Normalizing changes nothing, so no limits are exceeded.
    expect(setup).toEqual({ ...preset.setup, billingPeriod: 'month' })
    expect(selectIsReadyToRent(setup)).toBe(true)
  })

  it('keeps the user’s billing period', () => {
    expect(presetToSetup(PRESETS[0], 'week').billingPeriod).toBe('week')
  })
})

describe('randomSetup', () => {
  it.each(Array.from({ length: 300 }, (_, seed) => seed))('seed %i gives a valid, rentable setup', (seed) => {
    const setup = randomSetup('week', seededRandom(seed))
    expect(normalizeWorkspace(setup)).toEqual(setup)
    expect(selectIsReadyToRent(setup)).toBe(true)
    expect(monitorCount(setup.accessories)).toBeGreaterThanOrEqual(1)
    expect(setup.billingPeriod).toBe('week')
  })

  it('is reproducible for the same random source', () => {
    expect(randomSetup('month', seededRandom(42))).toEqual(randomSetup('month', seededRandom(42)))
  })
})

describe('surpriseSetup', () => {
  it('always changes the setup', () => {
    for (let seed = 0; seed < 100; seed++) {
      const current = randomSetup('month', seededRandom(seed))
      expect(selectIsSameSetup(surpriseSetup(current, seededRandom(seed)), current)).toBe(false)
    }
  })

  it('gives up instead of looping forever if randomness never changes', () => {
    const stuck = () => 0
    const current = randomSetup('month', stuck)
    expect(surpriseSetup(current, stuck)).toEqual(current)
  })
})
