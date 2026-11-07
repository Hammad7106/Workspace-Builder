// @vitest-environment jsdom
import '@/test/dialogPolyfill'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '@/App'
import { EMPTY_WORKSPACE, WorkspaceProvider, type WorkspaceState } from '@/features/workspace'
import { submitRentalRequest } from './api'

vi.mock('./api', () => ({ submitRentalRequest: vi.fn() }))
const submit = vi.mocked(submitRentalRequest)

beforeEach(() => submit.mockResolvedValue({ reference: 'MON-TEST01' }))
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

const setup: WorkspaceState = {
  ...EMPTY_WORKSPACE,
  deskId: 'desk-electric', // $14.50/mo
  chairId: 'chair-ergonomic', // $11/mo
  accessories: { 'monitor-24-fhd': 2 }, // 2 × $14/mo
}

function renderApp(initialState: WorkspaceState = setup) {
  const user = userEvent.setup()
  render(
    <WorkspaceProvider persist={false} initialState={initialState}>
      <App />
    </WorkspaceProvider>,
  )
  return { user }
}

const rentButton = () => screen.getByRole('button', { name: /Rent your setup/ })
const dialog = () => screen.getByRole('dialog')
const openCheckout = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(rentButton())
  return dialog()
}

describe('opening checkout', () => {
  it('needs a desk and a chair before renting', () => {
    renderApp({ ...setup, chairId: null })
    expect((rentButton() as HTMLButtonElement).disabled).toBe(true)
  })

  it('opens a review of the setup with monthly totals', async () => {
    const { user } = renderApp()
    const checkout = await openCheckout(user)

    expect(checkout.getAttribute('open')).not.toBeNull()
    expect(within(checkout).getByRole('heading', { name: 'Review your setup' })).toBeDefined()
    expect(within(checkout).getByText('Electric Standing Desk')).toBeDefined()
    expect(within(checkout).getByText('2 × $14')).toBeDefined()
    expect(within(checkout).getByText('Rent per month').nextSibling?.textContent).toBe('$53.50')
    expect(within(checkout).getByText('Total for 1 month').nextSibling?.textContent).toBe('$53.50')
  })

  it('updates the total for the rental length and billing period', async () => {
    const { user } = renderApp()
    const checkout = await openCheckout(user)

    await user.selectOptions(within(checkout).getByLabelText('Rental length'), '3')
    expect(within(checkout).getByText('Total for 3 months').nextSibling?.textContent).toBe('$160.50')

    await user.click(within(checkout).getByRole('button', { name: 'Weekly' }))
    expect(within(checkout).getByText('Total for 3 weeks').nextSibling?.textContent).toBe('$57')
  })

  it('closes from the X and the backdrop, and reopens on the first step', async () => {
    const { user } = renderApp()
    let checkout = await openCheckout(user)
    await user.click(within(checkout).getByRole('button', { name: 'Continue' }))

    await user.click(within(checkout).getByRole('button', { name: 'Close checkout' }))
    expect(checkout.getAttribute('open')).toBeNull()

    checkout = await openCheckout(user)
    expect(within(checkout).getByRole('heading', { name: 'Review your setup' })).toBeDefined()

    fireEvent.click(checkout) // a click on the dialog itself is a click on the backdrop
    expect(checkout.getAttribute('open')).toBeNull()
  })
})

describe('sending a rental request', () => {
  it('validates the details form and focuses the first problem', async () => {
    const { user } = renderApp()
    const checkout = await openCheckout(user)
    await user.click(within(checkout).getByRole('button', { name: 'Continue' }))
    await user.click(within(checkout).getByRole('button', { name: 'Send rental request' }))

    expect(submit).not.toHaveBeenCalled()
    const name = within(checkout).getByLabelText('Full name')
    expect(document.activeElement).toBe(name)
    expect(name.getAttribute('aria-invalid')).toBe('true')
    expect(within(checkout).getByText('Please enter your name.')).toBeDefined()
    expect(within(checkout).getByText('Please choose a delivery area.')).toBeDefined()
  })

  it('sends the request and confirms it, then can start over', async () => {
    const { user } = renderApp()
    const checkout = await openCheckout(user)
    await user.selectOptions(within(checkout).getByLabelText('Rental length'), '3')
    await user.click(within(checkout).getByRole('button', { name: 'Continue' }))

    await user.type(within(checkout).getByLabelText('Full name'), 'Made Wirawan')
    await user.type(within(checkout).getByLabelText('Email'), 'made@example.com')
    await user.type(within(checkout).getByLabelText('WhatsApp number'), '+62 812 3456 7890')
    await user.selectOptions(within(checkout).getByLabelText('Delivery area'), 'Canggu')
    fireEvent.change(within(checkout).getByLabelText('Delivery date'), { target: { value: '2099-01-15' } })
    await user.type(within(checkout).getByLabelText('Address'), 'Villa Kayu, Jl. Batu Bolong 12')
    await user.click(within(checkout).getByRole('button', { name: 'Send rental request' }))

    expect(await within(checkout).findByRole('heading', { name: 'Request sent!' })).toBeDefined()
    expect(submit).toHaveBeenCalledOnce()
    expect(submit.mock.calls[0][0]).toMatchObject({
      term: 3,
      pricePerPeriod: 5350,
      termTotal: 16050,
      customer: { name: 'Made Wirawan', email: 'made@example.com', phone: '+62 812 3456 7890' },
      delivery: { area: 'Canggu', address: 'Villa Kayu, Jl. Batu Bolong 12', startDate: '2099-01-15' },
    })
    expect(within(checkout).getByText('MON-TEST01')).toBeDefined()
    expect(within(checkout).getByText('Thursday 15 January')).toBeDefined()

    await user.click(within(checkout).getByRole('button', { name: 'Start a new setup' }))
    expect(checkout.getAttribute('open')).toBeNull()
    expect((rentButton() as HTMLButtonElement).disabled).toBe(true)
    expect(screen.getByText(/0 items/)).toBeDefined()
  })

  it('shows an error and lets the user retry when sending fails', async () => {
    submit.mockRejectedValueOnce(new Error('network down'))
    const { user } = renderApp()
    const checkout = await openCheckout(user)
    await user.click(within(checkout).getByRole('button', { name: 'Continue' }))

    await user.type(within(checkout).getByLabelText('Full name'), 'Made')
    await user.type(within(checkout).getByLabelText('Email'), 'made@example.com')
    await user.type(within(checkout).getByLabelText('WhatsApp number'), '081234567890')
    await user.selectOptions(within(checkout).getByLabelText('Delivery area'), 'Ubud')
    fireEvent.change(within(checkout).getByLabelText('Delivery date'), { target: { value: '2099-01-15' } })
    await user.type(within(checkout).getByLabelText('Address'), 'Jl. Raya Ubud 1')

    await user.click(within(checkout).getByRole('button', { name: 'Send rental request' }))
    expect(await within(checkout).findByRole('alert')).toBeDefined()

    await user.click(within(checkout).getByRole('button', { name: 'Send rental request' }))
    expect(await within(checkout).findByRole('heading', { name: 'Request sent!' })).toBeDefined()
    expect(submit).toHaveBeenCalledTimes(2)
  })
})
