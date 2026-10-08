import { render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ROLES } from '@/constants'
import AuthProvider from '@/auth/AuthProvider'
import { ToastProvider } from '@/components'
import { setMockRole } from '@/mocks/handlers'
import { routes } from './routes'

// [path, role jisse login karna hai (null = guest), page ka text]
const cases = [
  ['/', null, 'public / HomePage'],
  ['/jobs', null, 'public / JobSearchPage'],
  ['/jobs/some-job', null, 'public / JobDetailPage'],
  ['/companies/sbi', null, 'public / CompanyPage'],
  ['/verify-email', null, 'Apna email verify karo'],
  ['/candidate', ROLES.CANDIDATE, 'candidate / DashboardPage'],
  ['/candidate/profile', ROLES.CANDIDATE, 'candidate / ProfilePage'],
  ['/candidate/applications', ROLES.CANDIDATE, 'candidate / ApplicationsPage'],
  ['/candidate/saved-jobs', ROLES.CANDIDATE, 'candidate / SavedJobsPage'],
  ['/partner', ROLES.PARTNER_ADMIN, 'partner / DashboardPage'],
  ['/partner/jobs', ROLES.PARTNER_RECRUITER, 'Post a New Job'],
  ['/partner/jobs/new', ROLES.PARTNER_ADMIN, 'Create New Job Posting'],
  ['/partner/jobs/1/applicants', ROLES.PARTNER_ADMIN, 'Applicant Tracking (ATS)'],
  ['/partner/recruiters', ROLES.PARTNER_ADMIN, 'Invite Team Member'],
  ['/partner/company', ROLES.PARTNER_ADMIN, 'Company Profile & Branding'],
  ['/admin', ROLES.SUPER_ADMIN, 'admin / DashboardPage'],
  ['/admin/partners', ROLES.SUPER_ADMIN, 'Add Partner'],
  ['/admin/moderation', ROLES.SUPER_ADMIN, 'Job Moderation Queue'],
  ['/admin/users', ROLES.SUPER_ADMIN, 'admin / UsersPage'],
  ['/admin/audit-logs', ROLES.SUPER_ADMIN, 'admin / AuditLogsPage'],
]

describe('placeholder routes', () => {
  it.each(cases)('%s (%s) renders %s', async (path, role, text) => {
    setMockRole(role)
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    })
    const router = createMemoryRouter(routes, { initialEntries: [path] })
    render(
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </ToastProvider>
      </QueryClientProvider>,
    )
    expect(await screen.findByText(text, {}, { timeout: 4000 })).toBeInTheDocument()
  })
})

