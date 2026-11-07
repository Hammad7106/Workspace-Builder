// @vitest-environment jsdom
import '@/test/dialogPolyfill'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axe from 'axe-core'
import { afterEach, describe, expect, it } from 'vitest'
import App from '@/App'
import { WorkspaceProvider, type WorkspaceState } from '@/features/workspace'

afterEach(cleanup)

const setup: WorkspaceState = {
  deskId: 'desk-dual-motor',
  chairId: 'chair-ergonomic',
  accessories: { 'monitor-27-4k': 2, 'lamp-led': 1, 'plant-monstera': 2 },
  billingPeriod: 'month',
}

/**
 * Runs axe over a part of the page. Colour contrast is skipped because jsdom can't
 * compute styles; contrast is covered by the theme tokens (see index.css) and Lighthouse.
 */
async function violations(context: Element) {
  const results = await axe.run(context, { rules: { 'color-contrast': { enabled: false } } })
  return results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(' ')).join(', ')})`)
}

function renderApp() {
  const user = userEvent.setup()
  const { container } = render(
    <WorkspaceProvider persist={false} initialState={setup}>
      <App />
    </WorkspaceProvider>,
  )
  return { user, container }
}

describe('accessibility (axe)', () => {
  it('has no violations in the builder', async () => {
    const { container } = renderApp()
    expect(await violations(container)).toEqual([])
  })

  it('has no violations on each tab of the picker', async () => {
    const { user, container } = renderApp()
    for (const name of [/Chairs/, /Accessories/]) {
      await user.click(screen.getByRole('tab', { name }))
      expect(await violations(container)).toEqual([])
    }
  })

  it('has no violations in checkout, including the form with errors showing', async () => {
    const { user } = renderApp()
    await user.click(screen.getByRole('button', { name: /Rent your setup/ }))
    const checkout = await screen.findByRole('dialog')
    expect(await violations(checkout)).toEqual([])

    await user.click(within(checkout).getByRole('button', { name: 'Continue' }))
    await user.click(within(checkout).getByRole('button', { name: 'Send rental request' }))
    expect(await violations(checkout)).toEqual([])
  })
})
