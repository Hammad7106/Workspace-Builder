// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { EMPTY_WORKSPACE, WorkspaceProvider, type WorkspaceState } from '@/features/workspace'
import { BuilderPanel } from './BuilderPanel'

afterEach(cleanup)

function renderPanel(initialState: WorkspaceState = EMPTY_WORKSPACE) {
  const user = userEvent.setup()
  render(
    <WorkspaceProvider persist={false} initialState={initialState}>
      <BuilderPanel />
    </WorkspaceProvider>,
  )
  return { user }
}

const tab = (name: RegExp) => screen.getByRole('tab', { name })
const card = (name: RegExp) => screen.getByRole('button', { name })

describe('category tabs', () => {
  it('links the active tab to its panel', () => {
    renderPanel()
    expect(tab(/Desks/).getAttribute('aria-selected')).toBe('true')
    expect(screen.getByRole('tabpanel').getAttribute('aria-labelledby')).toBe(tab(/Desks/).id)
  })

  it('moves between tabs with arrow keys, Home and End', async () => {
    const { user } = renderPanel()
    await user.click(tab(/Desks/))

    await user.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(tab(/Chairs/))
    expect(card(/Ergonomic Office Chair/)).toBeDefined()

    await user.keyboard('{End}')
    expect(tab(/Accessories/).getAttribute('aria-selected')).toBe('true')

    await user.keyboard('{ArrowRight}') // wraps around
    expect(document.activeElement).toBe(tab(/Desks/))

    await user.keyboard('{ArrowLeft}{Home}')
    expect(tab(/Desks/).getAttribute('aria-selected')).toBe('true')
  })

  it('keeps only the active tab in the Tab order', () => {
    renderPanel()
    expect(screen.getAllByRole('tab').map((t) => t.tabIndex)).toEqual([0, -1, -1])
  })
})

describe('desk & chair selection', () => {
  it('selects one desk at a time and clears it on a second click', async () => {
    const { user } = renderPanel()

    await user.click(card(/Electric Standing Desk/))
    expect(card(/Electric Standing Desk/).getAttribute('aria-pressed')).toBe('true')
    expect(within(tab(/Desks/)).getByLabelText('chosen')).toBeDefined()

    await user.click(card(/Dual-Motor Standing Desk/))
    expect(card(/Electric Standing Desk/).getAttribute('aria-pressed')).toBe('false')
    expect(card(/Dual-Motor Standing Desk/).getAttribute('aria-pressed')).toBe('true')

    await user.click(card(/Dual-Motor Standing Desk/))
    expect(screen.getAllByRole('button', { pressed: true }).map((b) => b.textContent)).toEqual(['Monthly'])
  })

  it('selects a chair', async () => {
    const { user } = renderPanel()
    await user.click(tab(/Chairs/))
    await user.click(card(/Active Balance Stool/))
    expect(card(/Active Balance Stool/).getAttribute('aria-pressed')).toBe('true')
  })
})

describe('accessories', () => {
  it('stops adding monitors when the desk is full and says why', async () => {
    const { user } = renderPanel({ ...EMPTY_WORKSPACE, deskId: 'desk-mechanical' })
    await user.click(tab(/Accessories/))

    await user.click(screen.getByRole('button', { name: 'Add 24" Full HD Monitor' }))
    await user.click(screen.getByRole('button', { name: 'Add another 24" Full HD Monitor' }))

    expect(screen.getByLabelText('24" Full HD Monitor quantity').textContent).toBe('2')
    expect((screen.getByRole('button', { name: 'Add 27" 4K Monitor' }) as HTMLButtonElement).disabled).toBe(true)
    expect(screen.getAllByText('Your Mechanical Adjustable Desk fits 2 monitors')).toHaveLength(2)
    expect(tab(/Accessories/).textContent).toContain('2')
  })

  it('removes an accessory with the minus button', async () => {
    const { user } = renderPanel()
    await user.click(tab(/Accessories/))
    await user.click(screen.getByRole('button', { name: 'Add Smart LED Desk Lamp' }))
    await user.click(screen.getByRole('button', { name: 'Remove one Smart LED Desk Lamp' }))
    expect(screen.getByRole('button', { name: 'Add Smart LED Desk Lamp' })).toBeDefined()
  })
})

describe('billing & reset', () => {
  it('shows monthly prices with savings, and weekly prices on request', async () => {
    const { user } = renderPanel()
    expect(card(/Electric Standing Desk/).textContent).toContain('$14.50/mo')
    expect(card(/Electric Standing Desk/).textContent).toContain('Save 33%')

    await user.click(screen.getByRole('button', { name: 'Weekly' }))
    expect(card(/Electric Standing Desk/).textContent).toContain('$5/wk')
    expect(card(/Electric Standing Desk/).textContent).not.toContain('Save')
  })

  it('offers a reset once something is picked', async () => {
    const { user } = renderPanel()
    expect(screen.queryByRole('button', { name: 'Start over' })).toBeNull()

    await user.click(card(/Electric Standing Desk/))
    await user.click(screen.getByRole('button', { name: 'Start over' }))

    expect(card(/Electric Standing Desk/).getAttribute('aria-pressed')).toBe('false')
    expect(screen.queryByRole('button', { name: 'Start over' })).toBeNull()
  })
})
