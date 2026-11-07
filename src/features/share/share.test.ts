import { describe, expect, it } from 'vitest'
import { PRESETS, presetToSetup, randomSetup } from '@/features/presets/presets'
import { EMPTY_WORKSPACE, type WorkspaceState } from '@/features/workspace'
import { seededRandom } from '@/test/random'
import { buildShareUrl, decodeSetup, encodeSetup } from './share'

const setup: WorkspaceState = {
  deskId: 'desk-electric',
  chairId: 'chair-ergonomic',
  accessories: { 'lamp-led': 1, 'monitor-24-fhd': 2 },
  billingPeriod: 'month',
}

describe('encodeSetup', () => {
  it('writes readable parameters in catalog order', () => {
    expect(encodeSetup(setup)).toBe('desk=desk-electric&chair=chair-ergonomic&item=monitor-24-fhd*2&item=lamp-led')
  })

  it('only includes the billing period when it is weekly', () => {
    expect(encodeSetup({ ...setup, billingPeriod: 'week' })).toMatch(/&billing=week$/)
  })
})

describe('decodeSetup', () => {
  it.each([
    ...PRESETS.map((p) => [p.name, presetToSetup(p, 'month')] as const),
    ...Array.from({ length: 40 }, (_, seed) => [`random #${seed}`, randomSetup(seed % 2 ? 'week' : 'month', seededRandom(seed))] as const),
  ])('round-trips %s', (_name, state) => {
    expect(decodeSetup(`?${encodeSetup(state)}`)).toEqual(state)
  })

  it('returns null for links without a setup', () => {
    expect(decodeSetup('')).toBeNull()
    expect(decodeSetup('?utm_source=instagram')).toBeNull()
  })

  it('cleans up hand-edited links instead of failing', () => {
    expect(
      decodeSetup('?desk=desk-mechanical&chair=chair-throne&item=monitor-24-fhd*9&item=jetpack&item=lamp-led*abc'),
    ).toEqual({ ...EMPTY_WORKSPACE, deskId: 'desk-mechanical', accessories: { 'monitor-24-fhd': 2 } })
  })

  it('adds up repeated items', () => {
    expect(decodeSetup('?item=plant-monstera&item=plant-monstera')?.accessories).toEqual({ 'plant-monstera': 2 })
  })
})

describe('buildShareUrl', () => {
  const location = { origin: 'https://workspace-builder-swart.vercel.app', pathname: '/' }

  it('builds a full link to the setup', () => {
    expect(buildShareUrl(setup, location)).toBe(
      'https://workspace-builder-swart.vercel.app/?desk=desk-electric&chair=chair-ergonomic&item=monitor-24-fhd*2&item=lamp-led',
    )
  })

  it('links to the bare app when the setup is empty', () => {
    expect(buildShareUrl(EMPTY_WORKSPACE, location)).toBe('https://workspace-builder-swart.vercel.app/')
  })
})
