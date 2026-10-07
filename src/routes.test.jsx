import { render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
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
  ['/partner/jobs', ROLES.PARTNER_RECRUITER, 'partner / JobsPage'],
  ['/partner/jobs/new', ROLES.PARTNER_ADMIN, 'partner / JobEditorPage'],
  ['/partner/jobs/1/applicants', ROLES.PARTNER_ADMIN, 'partner / ApplicantsPage'],
  ['/partner/recruiters', ROLES.PARTNER_ADMIN, 'partner / RecruitersPage'],
  ['/admin', ROLES.SUPER_ADMIN, 'admin / DashboardPage'],
  ['/admin/partners', ROLES.SUPER_ADMIN, 'admin / PartnersPage'],
  ['/admin/moderation', ROLES.SUPER_ADMIN, 'admin / ModerationPage'],
  ['/admin/users', ROLES.SUPER_ADMIN, 'admin / UsersPage'],
  ['/admin/audit-logs', ROLES.SUPER_ADMIN, 'admin / AuditLogsPage'],
]

describe('placeholder routes', () => {
  it.each(cases)('%s (%s) renders %s', async (path, role, text) => {
    setMockRole(role)
    const router = createMemoryRouter(routes, { initialEntries: [path] })
    render(
      <ToastProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ToastProvider>,
    )
    expect(await screen.findByText(text)).toBeInTheDocument()
  })
})
