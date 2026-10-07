import { render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { router } from './routes'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
})

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
  ['/partner/jobs', 'Job Postings'],
  ['/partner/jobs/new', 'Create New Job Posting'],
  ['/partner/jobs/1/applicants', 'partner / ApplicantsPage'],
  ['/partner/recruiters', 'partner / RecruitersPage'],
  ['/admin', 'admin / DashboardPage'],
  ['/admin/partners', 'Partners'],
  ['/admin/moderation', 'Job Moderation Queue'],
  ['/admin/users', 'admin / UsersPage'],
  ['/admin/audit-logs', 'admin / AuditLogsPage'],
]

describe('placeholder routes', () => {
  it.each(cases)('%s renders %s', (path, text) => {
    const memory = createMemoryRouter(router.routes, { initialEntries: [path] })
    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={memory} />
      </QueryClientProvider>
    )
    expect(screen.getAllByText(text)[0]).toBeInTheDocument()
  })
})

