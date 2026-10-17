import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import { ROLES } from '@/constants'
import AuthProvider from '@/auth/AuthProvider'
import { ToastProvider } from '@/components'
import { setMockRole } from '@/mocks/handlers'
import { server } from './setupTests'
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
  ['/verify-email', null, 'Verify Your Email Address'],
  ['/candidate', ROLES.CANDIDATE, 'Quick Links'],
  ['/candidate/profile', ROLES.CANDIDATE, 'Your Profile'],
  ['/candidate/applications', ROLES.CANDIDATE, 'My Applications'],
  ['/candidate/saved-jobs', ROLES.CANDIDATE, 'Saved Jobs'],
  ['/partner', ROLES.PARTNER_ADMIN, 'Partner Recruitment Dashboard'],
  ['/partner/jobs', ROLES.PARTNER_RECRUITER, 'Post a New Job'],
  ['/partner/jobs/new', ROLES.PARTNER_ADMIN, 'Create New Job Posting'],
  ['/partner/jobs/1/applicants', ROLES.PARTNER_ADMIN, 'Applicant Tracking (ATS)'],
  ['/partner/recruiters', ROLES.PARTNER_ADMIN, 'Invite Team Member'],
  ['/partner/company', ROLES.PARTNER_ADMIN, 'Company Profile & Branding'],
  ['/admin', ROLES.SUPER_ADMIN, 'Admin Platform Overview'],
  ['/admin/partners', ROLES.SUPER_ADMIN, 'Add Partner'],
  ['/admin/moderation', ROLES.SUPER_ADMIN, 'Job Moderation Queue'],
  ['/admin/users', ROLES.SUPER_ADMIN, 'User Management'],
  ['/admin/audit-logs', ROLES.SUPER_ADMIN, 'Platform Audit Logs'],
]

describe('routes rendering test', () => {
  it.each(cases)('%s (%s) renders expected content', async (path, role, text) => {
    renderAt(path, role)
    expect(await screen.findByText(text, {}, { timeout: 4000 })).toBeInTheDocument()
  })

  it('shows recruiter-specific panel and actions to partner recruiters', async () => {
    renderAt('/partner', ROLES.PARTNER_RECRUITER)

    expect(await screen.findByRole('heading', { name: 'Recruiter Dashboard' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Recruiter Panel' })).toBeInTheDocument()
    expect(await screen.findByRole('link', { name: /Review Applicants/ })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Manage Recruiter Team/ })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Company Profile/ })).not.toBeInTheDocument()
  })

  it('sends the department when inviting a recruiter', async () => {
    let submittedPayload

    server.use(
      http.post('*/api/v1/partner/recruiters/invite', async ({ request }) => {
        submittedPayload = await request.json()
        return HttpResponse.json({ data: { id: 5 } }, { status: 201 })
      }),
    )

    renderAt('/partner/recruiters', ROLES.PARTNER_ADMIN)
    await userEvent.click(await screen.findByRole('button', { name: 'Invite Team Member' }))
    fireEvent.change(screen.getByPlaceholderText('e.g. Priya Sharma'), {
      target: { value: 'Priyanka Vishwas' },
    })
    fireEvent.change(screen.getByPlaceholderText('priya.sharma@company.com'), {
      target: { value: 'priyanka@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText('e.g. Engineering Hiring or Talent Acquisition'), {
      target: { value: 'Talent Acquisition' },
    })
    await userEvent.click(screen.getByRole('button', { name: 'Send Invitation' }))

    await waitFor(() => expect(submittedPayload).toBeDefined())
    expect(submittedPayload).toMatchObject({
      name: 'Priyanka Vishwas',
      email: 'priyanka@example.com',
      department: 'Talent Acquisition',
    })
  })

  it('shows the public homepage instead of the admin portal at the root URL', async () => {
    renderAt('/', ROLES.SUPER_ADMIN)

    expect(await screen.findByText('Find Your Dream Job')).toBeInTheDocument()
    expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'For Employers' }).length).toBeGreaterThan(0)
  })

  it('shows public companies and links each one to its profile', async () => {
    server.use(
      http.get('*/api/v1/public/companies', () =>
        HttpResponse.json({
          data: [
            {
              id: 1,
              name: 'Acme Systems',
              slug: 'acme-systems',
              industry: 'Technology',
              description: 'Building software for modern teams.',
              active_jobs_count: 3,
            },
          ],
          meta: { current_page: 1, last_page: 1, per_page: 12, total: 1 },
        }),
      ),
    )

    renderAt('/companies')

    expect(await screen.findByRole('heading', { name: 'Browse Companies' })).toBeInTheDocument()
    expect(await screen.findByRole('link', { name: /Acme Systems/ })).toHaveAttribute(
      'href',
      '/companies/acme-systems',
    )
    expect(screen.getByText('3 active jobs')).toBeInTheDocument()
  })

  it('renders analytics and audit activity for the super admin dashboard', async () => {
    server.use(
      http.get('*/api/v1/admin/audit-logs', () =>
        HttpResponse.json({
          data: [
            {
              id: 23,
              action: 'job_approved',
              actor: { name: 'Platform Admin' },
              subject_type: 'App\\Models\\Job',
              subject_id: 7,
              created_at: '2026-10-09T09:15:00Z',
            },
          ],
        }),
      ),
    )

    renderAt('/admin', ROLES.SUPER_ADMIN)

    expect(await screen.findByText('52')).toBeInTheDocument()
    expect(screen.getByText('1,280')).toBeInTheDocument()
    expect(await screen.findByText('Job Approved')).toBeInTheDocument()
    expect(screen.getByText('Platform Admin')).toBeInTheDocument()
    expect(screen.getByText('Job #7')).toBeInTheDocument()
  })

  it('loads pending moderation jobs and their tab count', async () => {
    renderAt('/admin/moderation', ROLES.SUPER_ADMIN)

    expect(await screen.findByText('2 Pending')).toBeInTheDocument()
    expect(screen.getByText('Product Marketing Manager')).toBeInTheDocument()
  })

  it('submits the backend-required fields when creating a partner', async () => {
    let submittedFields

    server.use(
      http.post('*/api/v1/admin/partners', async ({ request }) => {
        submittedFields = Object.fromEntries((await request.formData()).entries())

        return HttpResponse.json({ data: { id: 1 } }, { status: 201 })
      }),
    )

    const router = renderAt('/admin/partners/new', ROLES.SUPER_ADMIN)

    fireEvent.change(await screen.findByLabelText(/Company Name/), {
      target: { value: 'Acme Systems' },
    })
    fireEvent.change(screen.getByLabelText(/Description/), {
      target: { value: 'A hiring partner.' },
    })
    await waitFor(() => {
      expect(screen.getByLabelText(/Partner URL Slug/)).toHaveValue('acme-systems')
    })
    fireEvent.click(screen.getByRole('button', { name: 'Create Partner' }))

    await waitFor(() => expect(submittedFields).toBeDefined())
    expect(submittedFields).toMatchObject({
      name: 'Acme Systems',
      slug: 'acme-systems',
      max_active_jobs: '50',
      about: 'A hiring partner.',
    })
    await waitFor(() => expect(router.state.location.pathname).toBe('/admin/partners/1'))
  })

  it('shows backend validation details when a partner slug is already taken', async () => {
    server.use(
      http.post('*/api/v1/admin/partners', () =>
        HttpResponse.json(
          {
            message: 'The given data was invalid.',
            errors: { slug: ['This partner slug is already in use.'] },
          },
          { status: 422 },
        ),
      ),
    )

    renderAt('/admin/partners/new', ROLES.SUPER_ADMIN)

    fireEvent.change(await screen.findByLabelText(/Company Name/), {
      target: { value: 'Existing Partner' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Create Partner' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('HTTP 422')
    expect(screen.getByRole('alert')).toHaveTextContent('This partner slug is already in use.')
    expect(screen.getAllByText('This partner slug is already in use.')).toHaveLength(2)
  })

  it('shows backend validation details when job creation fails', async () => {
    server.use(
      http.post('*/api/v1/partner/jobs', () =>
        HttpResponse.json(
          {
            message: 'The given data was invalid.',
            errors: { work_mode: ['The work mode field is required.'] },
          },
          { status: 422 },
        ),
      ),
    )

    renderAt('/partner/jobs/new', ROLES.PARTNER_ADMIN)

    fireEvent.change(await screen.findByPlaceholderText(/Senior Full Stack Engineer/), {
      target: { value: 'Platform Engineer' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Bangalore, India or Remote/), {
      target: { value: 'Delhi' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Describe the mission of this role/), {
      target: { value: 'Build and maintain platform services for customers.' },
    })
    fireEvent.change(screen.getByPlaceholderText(/4\+ years of hands-on experience/), {
      target: { value: 'Experience with production systems.' },
    })
    fireEvent.change(screen.getByPlaceholderText(/React, TypeScript/), {
      target: { value: 'React, Laravel' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Save as Draft/ }))

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('The given data was invalid.')
    expect(alert).toHaveTextContent('The work mode field is required.')
  })

  it('saves a job before submitting it for review', async () => {
    let savedPayload
    let reviewJobId

    server.use(
      http.post('*/api/v1/partner/jobs', async ({ request }) => {
        savedPayload = await request.json()
        return HttpResponse.json({ data: { id: 42 } }, { status: 201 })
      }),
      http.post('*/api/v1/partner/jobs/:jobId/submit-review', ({ params }) => {
        reviewJobId = params.jobId
        return HttpResponse.json({ data: { id: 42, status: 'pending_review' } })
      }),
    )

    const router = renderAt('/partner/jobs/new', ROLES.PARTNER_ADMIN)

    fireEvent.change(await screen.findByPlaceholderText(/Senior Full Stack Engineer/), {
      target: { value: 'Platform Engineer' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Bangalore, India or Remote/), {
      target: { value: 'Delhi' },
    })
    fireEvent.change(screen.getByPlaceholderText(/Describe the mission of this role/), {
      target: { value: 'Build and maintain platform services for customers.' },
    })
    fireEvent.change(screen.getByPlaceholderText(/4\+ years of hands-on experience/), {
      target: { value: 'Experience with production systems.' },
    })
    fireEvent.change(screen.getByPlaceholderText(/React, TypeScript/), {
      target: { value: 'React, Laravel' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Submit for Review/ }))

    await waitFor(() => expect(reviewJobId).toBe('42'))
    expect(savedPayload).toMatchObject({
      title: 'Platform Engineer',
      skills: ['React', 'Laravel'],
      status: 'pending_review',
    })
    await waitFor(() => expect(router.state.location.pathname).toBe('/partner/jobs'))
  })

  it('omits the all-status filter when loading partner jobs', async () => {
    let requestedStatus

    server.use(
      http.get('*/api/v1/partner/jobs', ({ request }) => {
        requestedStatus = new URL(request.url).searchParams.get('status')
        return HttpResponse.json({
          data: [],
          meta: { current_page: 1, last_page: 1, total: 0 },
        })
      }),
    )

    renderAt('/partner/jobs', ROLES.PARTNER_RECRUITER)

    await waitFor(() => expect(requestedStatus).toBeNull())
  })

  it('sends normalized values for public job search filters', async () => {
    const requestedQueries = []

    server.use(
      http.get('*/api/v1/public/jobs', ({ request }) => {
        requestedQueries.push(Object.fromEntries(new URL(request.url).searchParams.entries()))
        return HttpResponse.json({ data: [], meta: { current_page: 1, last_page: 1, total: 0 } })
      }),
    )

    const router = renderAt('/jobs')
    let filters = screen.getAllByRole('combobox')
    const valueForLabel = (select, label) =>
      [...select.options].find((option) => option.label === label)?.value

    fireEvent.change(filters[0], { target: { value: valueForLabel(filters[0], 'Remote') } })
    await waitFor(() => expect(router.state.location.search).toContain('workplace_type=remote'))

    filters = screen.getAllByRole('combobox')
    fireEvent.change(filters[1], { target: { value: valueForLabel(filters[1], 'Senior') } })
    await waitFor(() => expect(router.state.location.search).toContain('experience_level=senior'))

    filters = screen.getAllByRole('combobox')
    fireEvent.change(filters[2], { target: { value: valueForLabel(filters[2], 'Full-time') } })

    await waitFor(() => expect(router.state.location.search).toContain('employment_type=full_time'))

    await waitFor(() => {
      expect(requestedQueries.at(-1)).toMatchObject({
        workplace_type: 'remote',
        experience_level: 'senior',
        employment_type: 'full_time',
      })
    })
  })

  it('paginates public company jobs and keeps the page in the URL', async () => {
    const requestedPages = []

    server.use(
      http.get('*/api/v1/public/companies/paginated-co', ({ request }) => {
        const page = Number(new URL(request.url).searchParams.get('page') || '1')
        requestedPages.push(page)

        const jobId = page === 1 ? 1 : 13

        return HttpResponse.json({
          data: {
            name: 'Paginated Co',
            slug: 'paginated-co',
            jobs: [
              {
                id: jobId,
                title: `Role ${jobId}`,
                slug: `role-${jobId}`,
                location: 'Remote',
                workplace_type: 'remote',
                experience_level: 'mid',
                employment_type: 'full_time',
                created_at: '2026-10-15T10:00:00Z',
              },
            ],
            jobs_pagination: {
              current_page: page,
              last_page: 2,
              total: 13,
            },
          },
        })
      }),
    )

    const router = renderAt('/companies/paginated-co')

    expect(await screen.findByRole('link', { name: 'Role 1' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(await screen.findByRole('link', { name: 'Role 13' })).toBeInTheDocument()
    await waitFor(() => expect(router.state.location.search).toBe('?page=2'))

    fireEvent.click(screen.getByRole('button', { name: 'Previous' }))
    expect(await screen.findByRole('link', { name: 'Role 1' })).toBeInTheDocument()
    await waitFor(() => expect(router.state.location.search).toBe('?page=1'))
    expect(requestedPages).toContain(2)
  })

  it('creates a partner admin through the backend admin-user route', async () => {
    let submittedPath
    let submittedPayload

    server.use(
      http.post('*/api/v1/admin/partners/:partnerId/admin-user', async ({ request }) => {
        submittedPath = new URL(request.url).pathname
        submittedPayload = await request.json()

        return HttpResponse.json({ data: { id: 2 } }, { status: 201 })
      }),
    )

    renderAt('/admin/partners/1', ROLES.SUPER_ADMIN)

    fireEvent.click(await screen.findByRole('button', { name: 'Add Admin' }))
    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'Acme Admin' },
    })
    fireEvent.change(screen.getByLabelText('Work Email Address'), {
      target: { value: 'admin@acme.example' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Create Admin' }))

    await waitFor(() => expect(submittedPath).toBe('/api/v1/admin/partners/1/admin-user'))
    expect(submittedPayload).toEqual({
      name: 'Acme Admin',
      email: 'admin@acme.example',
    })
  })

  it('shows backend validation details when a partner admin email already exists', async () => {
    server.use(
      http.post('*/api/v1/admin/partners/:partnerId/admin-user', () =>
        HttpResponse.json(
          {
            message: 'The given data was invalid.',
            errors: { email: ['The email has already been taken.'] },
          },
          { status: 422 },
        ),
      ),
    )

    renderAt('/admin/partners/1', ROLES.SUPER_ADMIN)

    fireEvent.click(await screen.findByRole('button', { name: 'Add Admin' }))
    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'Another Admin' },
    })
    fireEvent.change(screen.getByLabelText('Work Email Address'), {
      target: { value: 'existing@partner.example' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Create Admin' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('HTTP 422')
    expect(screen.getByRole('alert')).toHaveTextContent('The email has already been taken.')
    expect(screen.getAllByText('The email has already been taken.')).toHaveLength(2)
  })

  it('shows recruiter and company navigation only to partner admins', async () => {
    renderAt('/partner/jobs', ROLES.PARTNER_RECRUITER)
    expect(await screen.findByText('Post a New Job')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Recruiters' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Company' })).not.toBeInTheDocument()

    cleanup()
    renderAt('/partner/jobs', ROLES.PARTNER_ADMIN)
    expect(await screen.findByRole('link', { name: 'Recruiters' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Company' })).toBeInTheDocument()
  })

  it.each(['/partner/recruiters', '/partner/company'])(
    'redirects partner recruiters away from admin-only route %s',
    async (path) => {
      const router = renderAt(path, ROLES.PARTNER_RECRUITER)
      await waitFor(() => expect(router.state.location.pathname).toBe('/partner'))
    },
  )
})
