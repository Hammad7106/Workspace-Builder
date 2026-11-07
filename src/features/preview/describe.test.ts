import { describe, expect, it } from 'vitest'
import { EMPTY_WORKSPACE, type WorkspaceState } from '@/features/workspace'
import { describeSetup, summarizeSetup } from './describe'

const full: WorkspaceState = {
  ...EMPTY_WORKSPACE,
  deskId: 'desk-electric',
  chairId: 'chair-ergonomic',
  accessories: { 'monitor-24-fhd': 2, 'lamp-led': 1 },
}

describe('describeSetup', () => {
  it('describes an empty workspace', () => {
    expect(describeSetup(EMPTY_WORKSPACE)).toBe('Your workspace is empty. Pick a desk and a chair to start.')
  })

  it('lists every item with quantities', () => {
    expect(describeSetup(full)).toBe(
      'Your workspace: Electric Standing Desk, Ergonomic Office Chair, 2 × 24" Full HD Monitor, and Smart LED Desk Lamp.',
    )
  })
})

describe('summarizeSetup', () => {
  it('prompts the user when nothing is picked', () => {
    expect(summarizeSetup(EMPTY_WORKSPACE)).toMatch(/^Pick a desk and a chair/)
  })

  it('summarises desk, chair and accessory count', () => {
    expect(summarizeSetup(full)).toBe('Electric Standing Desk · Ergonomic Office Chair · 3 accessories')
  })

  it('calls out what is still missing', () => {
    expect(summarizeSetup({ ...EMPTY_WORKSPACE, accessories: { 'lamp-led': 1 } })).toBe(
      'No desk yet · No chair yet · 1 accessory',
    )
  })
})
