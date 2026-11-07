import { describe, expect, it } from 'vitest'
import { EMPTY_WORKSPACE, type WorkspaceState } from '@/features/workspace'
import { describeAccessoryLimit, describeMonitorSpace } from './limits'

const withDesk = (deskId: WorkspaceState['deskId'], accessories: WorkspaceState['accessories']): WorkspaceState => ({
  ...EMPTY_WORKSPACE,
  deskId,
  accessories,
})

describe('describeAccessoryLimit', () => {
  it('returns null while more units can be added', () => {
    expect(describeAccessoryLimit(EMPTY_WORKSPACE, 'plant-monstera')).toBeNull()
    expect(describeAccessoryLimit(withDesk('desk-electric', { 'monitor-24-fhd': 1 }), 'monitor-27-4k')).toBeNull()
  })

  it('names the desk when it is full of monitors', () => {
    const state = withDesk('desk-electric', { 'monitor-24-fhd': 2 })
    expect(describeAccessoryLimit(state, 'monitor-24-fhd')).toBe('Your Electric Standing Desk fits 2 monitors')
    expect(describeAccessoryLimit(state, 'monitor-27-4k')).toBe('Your Electric Standing Desk fits 2 monitors')
  })

  it('points to the widest desk before a desk is chosen', () => {
    expect(describeAccessoryLimit(withDesk(null, { 'monitor-27-4k': 3 }), 'monitor-24-fhd')).toBe(
      'Up to 3 monitors fit on our widest desk',
    )
  })

  it('explains per-product limits', () => {
    expect(describeAccessoryLimit(withDesk(null, { 'lamp-led': 1 }), 'lamp-led')).toBe('One per setup')
    expect(describeAccessoryLimit(withDesk(null, { 'plant-monstera': 2 }), 'plant-monstera')).toBe('Max 2 per setup')
  })
})

describe('describeMonitorSpace', () => {
  it('reflects the chosen desk', () => {
    expect(describeMonitorSpace(EMPTY_WORKSPACE)).toMatch(/depends on the desk/)
    expect(describeMonitorSpace(withDesk('desk-dual-motor', {}))).toBe(
      'Your Dual-Motor Standing Desk fits up to 3 monitors.',
    )
  })
})
