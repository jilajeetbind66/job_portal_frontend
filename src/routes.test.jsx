import { render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { router } from './routes'

const cases = [
  ['/', 'public / HomePage'],
  ['/jobs', 'public / JobSearchPage'],
  ['/jobs/some-job', 'public / JobDetailPage'],
  ['/companies/sbi', 'public / CompanyPage'],
  ['/login', 'public / LoginPage'],
  ['/register', 'public / RegisterPage'],
  ['/candidate', 'candidate / DashboardPage'],
  ['/candidate/profile', 'candidate / ProfilePage'],
  ['/candidate/applications', 'candidate / ApplicationsPage'],
  ['/candidate/saved-jobs', 'candidate / SavedJobsPage'],
  ['/partner', 'partner / DashboardPage'],
  ['/partner/jobs', 'partner / JobsPage'],
  ['/partner/jobs/new', 'partner / JobEditorPage'],
  ['/partner/jobs/1/applicants', 'partner / ApplicantsPage'],
  ['/partner/recruiters', 'partner / RecruitersPage'],
  ['/admin', 'admin / DashboardPage'],
  ['/admin/partners', 'admin / PartnersPage'],
  ['/admin/moderation', 'admin / ModerationPage'],
  ['/admin/users', 'admin / UsersPage'],
  ['/admin/audit-logs', 'admin / AuditLogsPage'],
]

describe('placeholder routes', () => {
  it.each(cases)('%s renders %s', (path, text) => {
    const memory = createMemoryRouter(router.routes, { initialEntries: [path] })
    render(<RouterProvider router={memory} />)
    expect(screen.getByText(text)).toBeInTheDocument()
  })
})
