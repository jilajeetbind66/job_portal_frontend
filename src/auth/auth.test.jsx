import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { ROLES } from '@/constants'
import { ToastProvider } from '@/components'
import { setMockRole } from '@/mocks/handlers'
import { routes } from '@/routes'
import AuthProvider from './AuthProvider'

function renderAt(path) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(
    <ToastProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ToastProvider>,
  )
  return router
}

async function fillLogin(user, email, password) {
  await user.type(await screen.findByLabelText('Email'), email)
  await user.type(screen.getByLabelText('Password'), password)
  await user.click(screen.getByRole('button', { name: 'Login' }))
}

describe('route guard', () => {
  it('guest ko /candidate se /login par bhejta hai', async () => {
    const router = renderAt('/candidate')
    await screen.findByRole('heading', { name: 'Login' })
    expect(router.state.location.pathname).toBe('/login')
  })

  it('galat role ko uske apne portal par bhejta hai', async () => {
    setMockRole(ROLES.CANDIDATE)
    const router = renderAt('/admin')
    await screen.findByText('candidate / DashboardPage')
    expect(router.state.location.pathname).toBe('/candidate')
  })

  it('partner_recruiter /partner dekh sakta hai', async () => {
    setMockRole(ROLES.PARTNER_RECRUITER)
    renderAt('/partner')
    expect(await screen.findByText('partner / DashboardPage')).toBeInTheDocument()
  })
})

describe('login', () => {
  it('candidate login ke baad /candidate par jata hai', async () => {
    const user = userEvent.setup()
    const router = renderAt('/login')
    await fillLogin(user, 'candidate@example.com', 'password')
    await screen.findByText('candidate / DashboardPage')
    expect(router.state.location.pathname).toBe('/candidate')
  })

  it('admin login ke baad /admin par jata hai', async () => {
    const user = userEvent.setup()
    const router = renderAt('/login')
    await fillLogin(user, 'admin@example.com', 'password')
    await screen.findByText('admin / DashboardPage')
    expect(router.state.location.pathname).toBe('/admin')
  })

  it('login se pehle wali page par wapas aata hai', async () => {
    const user = userEvent.setup()
    const router = renderAt('/candidate/profile')
    await fillLogin(user, 'candidate@example.com', 'password')
    await screen.findByText('candidate / ProfilePage')
    expect(router.state.location.pathname).toBe('/candidate/profile')
  })

  it('galat password par server ka error dikhata hai', async () => {
    const user = userEvent.setup()
    renderAt('/login')
    await fillLogin(user, 'candidate@example.com', 'wrong')
    expect(await screen.findByText(/do not match our records/i)).toBeInTheDocument()
  })

  it('khali form par validation error aata hai', async () => {
    const user = userEvent.setup()
    renderAt('/login')
    await user.click(await screen.findByRole('button', { name: 'Login' }))
    expect(await screen.findByText('Sahi email daalo')).toBeInTheDocument()
    expect(screen.getByText('Password daalo')).toBeInTheDocument()
  })
})

describe('logout', () => {
  it('logout ke baad /login par jata hai', async () => {
    setMockRole(ROLES.CANDIDATE)
    const user = userEvent.setup()
    const router = renderAt('/candidate')
    await screen.findByText('candidate / DashboardPage')
    await user.click(screen.getByRole('button', { name: /logout/i }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/login'))
  })
})

describe('register', () => {
  const fill = async (user, overrides = {}) => {
    const v = {
      name: 'Asha Rao',
      email: 'asha@example.com',
      phone: '9876543210',
      password: 'secret123',
      confirm: 'secret123',
      ...overrides,
    }
    await user.type(await screen.findByLabelText('Full name'), v.name)
    await user.type(screen.getByLabelText('Email'), v.email)
    await user.type(screen.getByLabelText('Mobile number'), v.phone)
    await user.type(screen.getByLabelText('Password'), v.password)
    await user.type(screen.getByLabelText('Confirm password'), v.confirm)
  }

  it('sahi form par /verify-email par jata hai', async () => {
    const user = userEvent.setup()
    const router = renderAt('/register')
    await fill(user)
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: 'Sign up' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/verify-email'))
  })

  it('sahmati ke bina submit nahi hota', async () => {
    const user = userEvent.setup()
    const router = renderAt('/register')
    await fill(user)
    await user.click(screen.getByRole('button', { name: 'Sign up' }))
    expect(await screen.findByText(/sahmati zaroori/)).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/register')
  })

  it('password match na ho to error', async () => {
    const user = userEvent.setup()
    renderAt('/register')
    await fill(user, { confirm: 'different1' })
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: 'Sign up' }))
    expect(await screen.findByText('Dono password same hone chahiye')).toBeInTheDocument()
  })

  it('email already taken ka server error dikhata hai', async () => {
    const user = userEvent.setup()
    renderAt('/register')
    await fill(user, { email: 'taken@example.com' })
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: 'Sign up' }))
    expect(await screen.findByText(/already been taken/i)).toBeInTheDocument()
  })
})

describe('password reset', () => {
  it('forgot password par success message aata hai', async () => {
    const user = userEvent.setup()
    renderAt('/forgot-password')
    await user.type(await screen.findByLabelText('Email'), 'asha@example.com')
    await user.click(screen.getByRole('button', { name: 'Send reset link' }))
    expect(await screen.findByText(/reset link bhej diya/)).toBeInTheDocument()
  })

  it('token ke bina reset page "link sahi nahi" dikhata hai', async () => {
    renderAt('/reset-password')
    expect(await screen.findByText('Link sahi nahi hai')).toBeInTheDocument()
  })

  it('reset ke baad /login par jata hai', async () => {
    const user = userEvent.setup()
    const router = renderAt('/reset-password?token=abc&email=asha@example.com')
    await user.type(await screen.findByLabelText('New password'), 'newsecret1')
    await user.type(screen.getByLabelText('Confirm password'), 'newsecret1')
    await user.click(screen.getByRole('button', { name: 'Set password' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/login'))
  })
})
