import { StrictMode } from 'react'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { clearCsrfCookieCache } from '@/api/client'
import { ROLES } from '@/constants'
import { ToastProvider } from '@/components'
import { setMockRole } from '@/mocks/handlers'
import { server } from '@/setupTests'
import { http, HttpResponse } from 'msw'
import { routes } from '@/routes'
import AuthProvider from './AuthProvider'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
}

function renderAt(path) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(
    <QueryClientProvider client={makeQueryClient()}>
      <ToastProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>,
  )
  return router
}

async function fillLogin(user, email, password) {
  await user.type(await screen.findByLabelText('Email'), email)
  await user.type(screen.getByLabelText('Password'), password)
  await user.click(screen.getByRole('button', { name: 'Login' }))
}

describe('route guard', () => {
  it('shows public auth actions while the session request is pending', async () => {
    let resolveSessionRequest

    server.use(
      http.get(
        '*/api/v1/auth/me',
        () =>
          new Promise((resolve) => {
            resolveSessionRequest = () =>
              resolve(HttpResponse.json({ message: 'Unauthenticated.' }, { status: 401 }))
          }),
      ),
    )

    renderAt('/')

    expect(await screen.findByRole('link', { name: 'Log In' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Register Now/ })).toBeInTheDocument()

    resolveSessionRequest()
  })

  it('deduplicates the initial session request in StrictMode', async () => {
    let sessionRequests = 0
    server.use(
      http.get('*/api/v1/auth/me', () => {
        sessionRequests += 1
        return HttpResponse.json({ message: 'Unauthenticated.' }, { status: 401 })
      }),
    )

    const router = createMemoryRouter(routes, { initialEntries: ['/login'] })
    render(
      <StrictMode>
        <QueryClientProvider client={makeQueryClient()}>
          <ToastProvider>
            <AuthProvider>
              <RouterProvider router={router} />
            </AuthProvider>
          </ToastProvider>
        </QueryClientProvider>
      </StrictMode>,
    )

    await screen.findByRole('heading', { name: 'Login' })
    expect(sessionRequests).toBe(1)
  })

  it('guest ko /candidate se /login par bhejta hai', async () => {
    const router = renderAt('/candidate')
    await screen.findByRole('heading', { name: 'Login' })
    expect(router.state.location.pathname).toBe('/login')
  })

  it('galat role ko uske apne portal par bhejta hai', async () => {
    setMockRole(ROLES.CANDIDATE)
    const router = renderAt('/admin')
    await screen.findByText('Quick Links')
    expect(router.state.location.pathname).toBe('/candidate')
  })

  it('partner_recruiter /partner dekh sakta hai', async () => {
    setMockRole(ROLES.PARTNER_RECRUITER)
    renderAt('/partner')
    expect(await screen.findByText('Partner Recruitment Dashboard')).toBeInTheDocument()
  })
})

describe('login', () => {
  it('uses the login response without fetching the session a second time', async () => {
    let sessionRequests = 0

    server.use(
      http.get('*/api/v1/auth/me', () => {
        sessionRequests += 1
        return HttpResponse.json({ message: 'Unauthenticated.' }, { status: 401 })
      }),
    )

    const user = userEvent.setup()
    renderAt('/login')
    await fillLogin(user, 'candidate@example.com', 'password')
    await screen.findByText('Quick Links')

    expect(sessionRequests).toBe(1)
  })

  it('candidate login ke baad /candidate par jata hai', async () => {
    const user = userEvent.setup()
    const router = renderAt('/login')
    await fillLogin(user, 'candidate@example.com', 'password')
    await screen.findByText('Quick Links')
    expect(router.state.location.pathname).toBe('/candidate')
  })

  it('admin login ke baad /admin par jata hai', async () => {
    const user = userEvent.setup()
    const router = renderAt('/login')
    await fillLogin(user, 'admin@example.com', 'password')
    await screen.findByText('Admin Platform Overview')
    expect(router.state.location.pathname).toBe('/admin')
  })

  it('login se pehle wali page par wapas aata hai', async () => {
    const user = userEvent.setup()
    const router = renderAt('/candidate/profile')
    await fillLogin(user, 'candidate@example.com', 'password')
    await screen.findByText('Your Profile')
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
    expect(await screen.findByText('Please enter a valid email address')).toBeInTheDocument()
    expect(screen.getByText('Password is required')).toBeInTheDocument()
  })
})

describe('logout', () => {
  it('logout ke baad /login par jata hai', async () => {
    setMockRole(ROLES.CANDIDATE)
    const user = userEvent.setup()
    const router = renderAt('/candidate')
    await screen.findByText('Quick Links')
    await user.click(screen.getByRole('button', { name: /logout/i }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/login'))
  })

  it('partner header shows the signed-in user and logs out', async () => {
    setMockRole(ROLES.PARTNER_ADMIN)
    const user = userEvent.setup()
    const router = renderAt('/partner')

    expect(await screen.findByText('Demo Partner Admin')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Logout' }))

    await waitFor(() => expect(router.state.location.pathname).toBe('/login'))
  })

  it('shows a partner notification and opens its destination', async () => {
    setMockRole(ROLES.PARTNER_ADMIN)
    const user = userEvent.setup()
    const router = renderAt('/partner')

    await user.click(await screen.findByRole('button', { name: /Notifications/ }))
    await user.click(await screen.findByRole('button', { name: /New applicant/ }))

    await waitFor(() => expect(router.state.location.pathname).toBe('/partner/applicants'))
  })

  it.each([
    [ROLES.CANDIDATE, '/candidate', 'Application update', '/candidate/applications'],
    [ROLES.SUPER_ADMIN, '/admin', 'Job awaiting review', '/admin/moderation/7'],
  ])(
    'shows the %s notification in its portal and opens the destination',
    async (role, path, title, destination) => {
      setMockRole(role)
      const user = userEvent.setup()
      const router = renderAt(path)

      await user.click(await screen.findByRole('button', { name: /Notifications/ }))
      await user.click(await screen.findByRole('button', { name: new RegExp(title) }))

      await waitFor(() => expect(router.state.location.pathname).toBe(destination))
    },
  )

  it('asks guests to sign in before opening notifications', async () => {
    setMockRole(null)
    const user = userEvent.setup()
    const router = renderAt('/')

    await user.click(await screen.findByRole('button', { name: 'Notifications' }))

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
    await user.type(await screen.findByLabelText('Full name', {}, { timeout: 4000 }), v.name)
    await user.type(screen.getByLabelText('Email'), v.email)
    await user.type(screen.getByLabelText('Mobile number'), v.phone)
    await user.type(screen.getByLabelText('Password'), v.password)
    await user.type(screen.getByLabelText('Confirm password'), v.confirm)
  }

  it('prefetches the CSRF cookie on form focus and reuses it on submit', async () => {
    clearCsrfCookieCache()
    let csrfRequests = 0

    server.use(
      http.get('*/sanctum/csrf-cookie', () => {
        csrfRequests += 1
        return new HttpResponse(null, { status: 204 })
      }),
    )

    const user = userEvent.setup()
    const router = renderAt('/register')
    await user.click(await screen.findByLabelText('Full name'))
    await waitFor(() => expect(csrfRequests).toBe(1))
    await fill(user)
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: 'Sign up' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/verify-email'))

    expect(csrfRequests).toBe(1)
    clearCsrfCookieCache()
  })

  it('rejects names over the server limit before sending a registration request', async () => {
    clearCsrfCookieCache()
    let registrationRequests = 0

    server.use(
      http.post('*/api/v1/auth/register', () => {
        registrationRequests += 1
        return HttpResponse.json({ message: 'Unexpected registration request.' }, { status: 500 })
      }),
    )

    const user = userEvent.setup()
    renderAt('/register')
    await fill(user)
    fireEvent.change(screen.getByLabelText('Full name'), {
      target: { value: 'A'.repeat(256) },
    })
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: 'Sign up' }))

    expect(await screen.findByText('Full name must be at most 255 characters')).toBeInTheDocument()
    expect(registrationRequests).toBe(0)
    clearCsrfCookieCache()
  })

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
    expect(await screen.findByText(/consent is required/i)).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/register')
  })

  it('password match na ho to error', async () => {
    const user = userEvent.setup()
    renderAt('/register')
    await fill(user, { confirm: 'different1' })
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: 'Sign up' }))
    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument()
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
    expect(await screen.findByText(/password reset link has been sent/i)).toBeInTheDocument()
  })

  it('token ke bina reset page "link sahi nahi" dikhata hai', async () => {
    renderAt('/reset-password')
    expect(await screen.findByText('Invalid or Expired Link')).toBeInTheDocument()
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
