// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import App from '@/App'
import { WorkspaceProvider } from '@/features/workspace'

afterEach(cleanup)

const scene = () => screen.getByRole('img', { name: /Your workspace/ })
const drawn = (productId: string) => scene().querySelectorAll(`[data-product="${productId}"]`)

/** Full-app test: the builder and the preview share state, so picking updates the scene. */
describe('live preview', () => {
  it('starts with placeholders and a prompt', () => {
    render(<WorkspaceProvider persist={false}><App /></WorkspaceProvider>)
    expect(scene().getAttribute('aria-label')).toMatch(/empty/)
    expect(screen.getByText('Pick a desk')).toBeDefined()
    expect(screen.getByText('Pick a chair')).toBeDefined()
  })

  it('draws items as they are picked, changed and removed', async () => {
    const user = userEvent.setup()
    render(<WorkspaceProvider persist={false}><App /></WorkspaceProvider>)

    await user.click(screen.getByRole('button', { name: /Electric Standing Desk/ }))
    expect(drawn('desk-electric')).toHaveLength(1)
    expect(screen.queryByText('Pick a desk')).toBeNull()

    await user.click(screen.getByRole('button', { name: /Dual-Motor Standing Desk/ }))
    expect(drawn('desk-electric')).toHaveLength(0)
    expect(drawn('desk-dual-motor')).toHaveLength(1)

    await user.click(screen.getByRole('tab', { name: /Chairs/ }))
    await user.click(screen.getByRole('button', { name: /Ergonomic Office Chair/ }))
    expect(drawn('chair-ergonomic')).toHaveLength(1)

    await user.click(screen.getByRole('tab', { name: /Accessories/ }))
    await user.click(screen.getByRole('button', { name: 'Add 24" Full HD Monitor' }))
    await user.click(screen.getByRole('button', { name: 'Add another 24" Full HD Monitor' }))
    expect(drawn('monitor-24-fhd')).toHaveLength(2)

    await user.click(screen.getByRole('button', { name: 'Remove one 24" Full HD Monitor' }))
    expect(drawn('monitor-24-fhd')).toHaveLength(1)

    expect(scene().getAttribute('aria-label')).toBe(
      'Your workspace: Dual-Motor Standing Desk, Ergonomic Office Chair, and 24" Full HD Monitor.',
    )
    expect(screen.getByText('Dual-Motor Standing Desk · Ergonomic Office Chair · 1 accessory')).toBeDefined()
  })
})
