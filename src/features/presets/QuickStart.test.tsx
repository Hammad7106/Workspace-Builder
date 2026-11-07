// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import App from '@/App'
import { EMPTY_WORKSPACE, WorkspaceProvider, type WorkspaceState } from '@/features/workspace'

afterEach(cleanup)

function renderApp(initialState: WorkspaceState = EMPTY_WORKSPACE) {
  const user = userEvent.setup() // also installs a clipboard stub on navigator
  render(
    <WorkspaceProvider persist={false} initialState={initialState}>
      <App />
    </WorkspaceProvider>,
  )
  return { user }
}

const scene = () => screen.getByRole('img', { name: /Your workspace/ })
const drawn = (productId: string) => scene().querySelectorAll(`[data-product="${productId}"]`).length
const chip = (name: RegExp) => screen.getByRole('button', { name })

describe('quick start setups', () => {
  it('loads a preset in one tap and marks it active', async () => {
    const { user } = renderApp()
    await user.click(chip(/Deep Focus/))

    expect(chip(/Deep Focus/).getAttribute('aria-pressed')).toBe('true')
    expect(drawn('desk-electric')).toBe(1)
    expect(drawn('monitor-27-4k')).toBe(1)
    expect(screen.getByText('Electric Standing Desk · Ergonomic Office Chair · 4 accessories')).toBeDefined()
  })

  it('shows each preset’s price for the current billing period', () => {
    renderApp()
    // Nomad Starter: $9 + $8 + $2.50 + $4 + $1.50 a month.
    expect(chip(/Nomad Starter/).textContent).toContain('$25/mo')
  })

  it('offers undo when a preset replaces an existing setup', async () => {
    const { user } = renderApp({ ...EMPTY_WORKSPACE, deskId: 'desk-mechanical', chairId: 'chair-task' })
    await user.click(chip(/Triple-Monitor Pro/))
    expect(drawn('desk-dual-motor')).toBe(1)
    expect(screen.getByRole('status').textContent).toContain('Loaded Triple-Monitor Pro.')

    await user.click(screen.getByRole('button', { name: 'Undo' }))
    expect(drawn('desk-mechanical')).toBe(1)
    expect(drawn('desk-dual-motor')).toBe(0)
  })

  it('builds a random rentable setup with "Surprise me"', async () => {
    const { user } = renderApp()
    await user.click(chip(/Surprise me/))
    expect(scene().getAttribute('aria-label')).not.toMatch(/empty/)
    expect((screen.getByRole('button', { name: /Rent your setup/ }) as HTMLButtonElement).disabled).toBe(false)
  })
})

describe('share link', () => {
  it('is disabled for an empty setup', () => {
    renderApp()
    expect((screen.getByRole('button', { name: 'Share setup' }) as HTMLButtonElement).disabled).toBe(true)
  })

  it('copies a link to the current setup', async () => {
    const { user } = renderApp({
      ...EMPTY_WORKSPACE,
      deskId: 'desk-electric',
      chairId: 'chair-task',
      accessories: { 'plant-monstera': 2 },
    })
    await user.click(screen.getByRole('button', { name: 'Share setup' }))

    expect(await navigator.clipboard.readText()).toBe(
      `${window.location.origin}/?desk=desk-electric&chair=chair-task&item=plant-monstera*2`,
    )
    expect(screen.getByRole('button', { name: 'Link copied' })).toBeDefined()
  })
})
