import { render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ROLES } from '@/constants'
import AuthProvider from '@/auth/AuthProvider'
import { ToastProvider } from '@/components'
import { setMockRole } from '@/mocks/handlers'
import { routes } from './routes'

// QueryClient for each test — no stale data between tests
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
}

function renderAt(path, role) {
  setMockRole(role)
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

// [path, role jisse login karna hai (null = guest), page ka text]
const cases = [
  ['/', null, 'Find Your Dream Job'],
  ['/jobs', null, 'Find Jobs'],
  ['/verify-email', null, 'Apna email verify karo'],
  ['/candidate', ROLES.CANDIDATE, 'Quick Links'],
  ['/candidate/profile', ROLES.CANDIDATE, 'Your Profile'],
  ['/candidate/applications', ROLES.CANDIDATE, 'My Applications'],
  ['/candidate/saved-jobs', ROLES.CANDIDATE, 'Saved Jobs'],
  ['/partner', ROLES.PARTNER_ADMIN, 'partner / DashboardPage'],
  ['/admin', ROLES.SUPER_ADMIN, 'admin / DashboardPage'],
]

describe('placeholder routes', () => {
  it.each(cases)('%s (%s) renders expected content', async (path, role, text) => {
    renderAt(path, role)
    expect(await screen.findByText(text, {}, { timeout: 3000 })).toBeInTheDocument()
  })
})

