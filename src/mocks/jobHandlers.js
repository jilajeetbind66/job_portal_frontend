import { http, HttpResponse } from 'msw'
import { JOB_STATUS } from '@/constants'

// Initial seed jobs dataset
let jobs = [
  {
    id: 1,
    title: 'Senior Full Stack Engineer (React & Node)',
    partner_id: 1,
    partner_name: 'TechCorp Solutions',
    partner_logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&h=100&fit=crop&crop=faces',
    department: 'Engineering',
    employment_type: 'full_time',
    workplace_type: 'hybrid',
    location: 'Bangalore, India',
    salary_min: 1800000,
    salary_max: 2800000,
    currency: 'INR',
    experience_level: 'senior',
    description: 'We are seeking an experienced Full Stack Engineer to build high-performance web applications, architect cloud infrastructure, and mentor junior engineers.',
    requirements: '- 5+ years with React, Node.js, and TypeScript\n- Strong experience with PostgreSQL and Redis\n- Experience with Docker and AWS/GCP',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker'],
    status: JOB_STATUS.PUBLISHED,
    rejection_reason: null,
    applicants_count: 24,
    created_at: '2026-09-15T10:30:00Z',
    updated_at: '2026-09-18T14:20:00Z',
    deadline: '2026-11-30',
  },
  {
    id: 2,
    title: 'Product Marketing Manager',
    partner_id: 1,
    partner_name: 'TechCorp Solutions',
    partner_logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&h=100&fit=crop&crop=faces',
    department: 'Marketing',
    employment_type: 'full_time',
    workplace_type: 'remote',
    location: 'Remote, India',
    salary_min: 1200000,
    salary_max: 1800000,
    currency: 'INR',
    experience_level: 'mid',
    description: 'Lead go-to-market strategies for our B2B SaaS products, collaborate with sales and engineering to drive customer acquisition.',
    requirements: '- 3+ years in product marketing for B2B SaaS\n- Proven track record of successful product launches\n- Excellent analytical and copywriting skills',
    skills: ['Product Marketing', 'Go-To-Market', 'B2B SaaS', 'SEO', 'Content Strategy'],
    status: JOB_STATUS.PENDING_REVIEW,
    rejection_reason: null,
    applicants_count: 0,
    created_at: '2026-10-05T08:15:00Z',
    updated_at: '2026-10-05T08:15:00Z',
    deadline: '2026-11-15',
  },
  {
    id: 3,
    title: 'Lead DevOps & Cloud Architect',
    partner_id: 2,
    partner_name: 'Global Finance Inc',
    partner_logo: null,
    department: 'Infrastructure',
    employment_type: 'full_time',
    workplace_type: 'on_site',
    location: 'Mumbai, India',
    salary_min: 2500000,
    salary_max: 3500000,
    currency: 'INR',
    experience_level: 'lead',
    description: 'Looking for a Lead DevOps Architect to manage our core banking infrastructure, enhance CI/CD pipelines, and secure cloud operations.',
    requirements: '- 7+ years in Cloud Infrastructure & DevOps\n- Certified Kubernetes Administrator (CKA)\n- High experience with compliance and fintech security',
    skills: ['Kubernetes', 'Terraform', 'AWS', 'CI/CD', 'Security'],
    status: JOB_STATUS.PENDING_REVIEW,
    rejection_reason: null,
    applicants_count: 0,
    created_at: '2026-10-06T11:45:00Z',
    updated_at: '2026-10-06T11:45:00Z',
    deadline: '2026-12-01',
  },
  {
    id: 4,
    title: 'Frontend Developer (Vue & Nuxt)',
    partner_id: 1,
    partner_name: 'TechCorp Solutions',
    partner_logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&h=100&fit=crop&crop=faces',
    department: 'Engineering',
    employment_type: 'full_time',
    workplace_type: 'remote',
    location: 'Remote, India',
    salary_min: 800000,
    salary_max: 1300000,
    currency: 'INR',
    experience_level: 'entry',
    description: 'Fresh engineering graduate or junior developer with strong fundamentals in Vue.js and CSS animations.',
    requirements: '- 1+ years experience with Vue.js / Nuxt\n- Strong semantic HTML and modern CSS\n- Good communication skills',
    skills: ['Vue.js', 'Nuxt.js', 'TailwindCSS', 'JavaScript'],
    status: JOB_STATUS.DRAFT,
    rejection_reason: null,
    applicants_count: 0,
    created_at: '2026-10-02T16:00:00Z',
    updated_at: '2026-10-02T16:00:00Z',
    deadline: '2026-11-20',
  },
  {
    id: 5,
    title: 'Senior Data Analyst (Growth & Retention)',
    partner_id: 3,
    partner_name: 'Innovate AI',
    partner_logo: 'https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?w=100&h=100&fit=crop&crop=faces',
    department: 'Data & Analytics',
    employment_type: 'full_time',
    workplace_type: 'remote',
    location: 'Remote',
    salary_min: 1500000,
    salary_max: 2200000,
    currency: 'INR',
    experience_level: 'senior',
    description: 'Job description needs more clarity on data stack and privacy compliance.',
    requirements: '- 4+ years SQL and Python\n- Experience building dashboard metrics in Tableau or Looker',
    skills: ['SQL', 'Python', 'Tableau', 'Cohort Analysis'],
    status: JOB_STATUS.REJECTED,
    rejection_reason: 'Job description is too brief and does not mention required compliance/security standards for handling user analytics. Please detail data privacy expectations and clear experience requirements.',
    applicants_count: 0,
    created_at: '2026-09-28T09:00:00Z',
    updated_at: '2026-09-30T14:10:00Z',
    deadline: '2026-10-30',
  },
  {
    id: 6,
    title: 'UI/UX Product Designer',
    partner_id: 1,
    partner_name: 'TechCorp Solutions',
    partner_logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&h=100&fit=crop&crop=faces',
    department: 'Design',
    employment_type: 'full_time',
    workplace_type: 'hybrid',
    location: 'Bangalore, India',
    salary_min: 1400000,
    salary_max: 2000000,
    currency: 'INR',
    experience_level: 'mid',
    description: 'Design intuitive interfaces, create scalable design systems in Figma, and conduct usability research.',
    requirements: '- 3+ years product design experience\n- Portfolio showcasing web and mobile products\n- Strong Figma and design systems proficiency',
    skills: ['Figma', 'UI Design', 'Design Systems', 'User Research'],
    status: JOB_STATUS.CLOSED,
    rejection_reason: null,
    applicants_count: 42,
    created_at: '2026-08-10T12:00:00Z',
    updated_at: '2026-09-20T10:00:00Z',
    deadline: '2026-09-15',
  },
]

export const jobHandlers = [
  // ==========================================
  // PARTNER JOB ENDPOINTS
  // ==========================================

  // GET /partner/jobs (List partner's jobs)
  http.get('*/api/v1/partner/jobs', ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const search = url.searchParams.get('search')?.toLowerCase() || ''
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const perPage = parseInt(url.searchParams.get('per_page') || '10', 10)

    // Current logged in partner assumed partner_id = 1
    let filtered = jobs.filter((j) => j.partner_id === 1)

    if (status && status !== 'all') {
      filtered = filtered.filter((j) => j.status === status)
    }

    if (search) {
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(search) ||
          j.department.toLowerCase().includes(search) ||
          j.location.toLowerCase().includes(search)
      )
    }

    const total = filtered.length
    const lastPage = Math.ceil(total / perPage) || 1
    const start = (page - 1) * perPage
    const paginated = filtered.slice(start, start + perPage)

    return HttpResponse.json({
      data: paginated,
      meta: {
        current_page: page,
        last_page: lastPage,
        per_page: perPage,
        total,
      },
    })
  }),

  // GET /partner/jobs/:id (Detail)
  http.get('*/api/v1/partner/jobs/:id', ({ params }) => {
    const id = parseInt(params.id, 10)
    const job = jobs.find((j) => j.id === id)

    if (!job) {
      return new HttpResponse(JSON.stringify({ message: 'Job not found' }), { status: 404 })
    }

    return HttpResponse.json({ data: job })
  }),

  // POST /partner/jobs (Create)
  http.post('*/api/v1/partner/jobs', async ({ request }) => {
    const body = await request.json()
    const newJob = {
      id: Date.now(),
      partner_id: 1, // scoped server-side to partner
      partner_name: 'TechCorp Solutions',
      partner_logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&h=100&fit=crop&crop=faces',
      title: body.title,
      department: body.department || 'Engineering',
      employment_type: body.employment_type || 'full_time',
      workplace_type: body.workplace_type || 'remote',
      location: body.location || 'Remote',
      salary_min: Number(body.salary_min) || 0,
      salary_max: Number(body.salary_max) || 0,
      currency: body.currency || 'INR',
      experience_level: body.experience_level || 'mid',
      description: body.description || '',
      requirements: body.requirements || '',
      skills: Array.isArray(body.skills) ? body.skills : (body.skills ? body.skills.split(',').map((s) => s.trim()) : []),
      status: body.status || JOB_STATUS.DRAFT,
      rejection_reason: null,
      applicants_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deadline: body.deadline || '',
    }

    jobs.unshift(newJob)
    return HttpResponse.json({ data: newJob }, { status: 201 })
  }),

  // PUT /partner/jobs/:id (Update)
  http.put('*/api/v1/partner/jobs/:id', async ({ params, request }) => {
    const id = parseInt(params.id, 10)
    const body = await request.json()
    const index = jobs.findIndex((j) => j.id === id)

    if (index === -1) {
      return new HttpResponse(JSON.stringify({ message: 'Job not found' }), { status: 404 })
    }

    const current = jobs[index]
    const updated = {
      ...current,
      ...body,
      salary_min: body.salary_min !== undefined ? Number(body.salary_min) : current.salary_min,
      salary_max: body.salary_max !== undefined ? Number(body.salary_max) : current.salary_max,
      skills: Array.isArray(body.skills) ? body.skills : (body.skills ? body.skills.split(',').map((s) => s.trim()) : current.skills),
      // If submitting again after rejection, clear the old reason
      rejection_reason: body.status === JOB_STATUS.PENDING_REVIEW ? null : current.rejection_reason,
      updated_at: new Date().toISOString(),
    }

    jobs[index] = updated
    return HttpResponse.json({ data: updated })
  }),

  // PATCH /partner/jobs/:id/status (Change status: close, submit, etc.)
  http.patch('*/api/v1/partner/jobs/:id/status', async ({ params, request }) => {
    const id = parseInt(params.id, 10)
    const { status } = await request.json()
    const job = jobs.find((j) => j.id === id)

    if (!job) {
      return new HttpResponse(JSON.stringify({ message: 'Job not found' }), { status: 404 })
    }

    job.status = status
    if (status === JOB_STATUS.PENDING_REVIEW) {
      job.rejection_reason = null
    }
    job.updated_at = new Date().toISOString()

    return HttpResponse.json({ data: job })
  }),

  // DELETE /partner/jobs/:id
  http.delete('*/api/v1/partner/jobs/:id', ({ params }) => {
    const id = parseInt(params.id, 10)
    jobs = jobs.filter((j) => j.id !== id)
    return HttpResponse.json({ message: 'Job deleted successfully' })
  }),

  // ==========================================
  // ADMIN MODERATION ENDPOINTS
  // ==========================================

  // GET /admin/jobs (List queue)
  http.get('*/api/v1/admin/jobs', ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const search = url.searchParams.get('search')?.toLowerCase() || ''
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const perPage = parseInt(url.searchParams.get('per_page') || '10', 10)

    let filtered = jobs

    if (status && status !== 'all') {
      filtered = filtered.filter((j) => j.status === status)
    }

    if (search) {
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(search) ||
          j.partner_name.toLowerCase().includes(search) ||
          j.department.toLowerCase().includes(search)
      )
    }

    const total = filtered.length
    const lastPage = Math.ceil(total / perPage) || 1
    const start = (page - 1) * perPage
    const paginated = filtered.slice(start, start + perPage)

    // Calculate quick counts for moderation tabs
    const counts = {
      pending_review: jobs.filter((j) => j.status === JOB_STATUS.PENDING_REVIEW).length,
      published: jobs.filter((j) => j.status === JOB_STATUS.PUBLISHED).length,
      rejected: jobs.filter((j) => j.status === JOB_STATUS.REJECTED).length,
      all: jobs.length,
    }

    return HttpResponse.json({
      data: paginated,
      meta: {
        current_page: page,
        last_page: lastPage,
        per_page: perPage,
        total,
        counts,
      },
    })
  }),

  // GET /admin/jobs/:id (Detail for review)
  http.get('*/api/v1/admin/jobs/:id', ({ params }) => {
    const id = parseInt(params.id, 10)
    const job = jobs.find((j) => j.id === id)

    if (!job) {
      return new HttpResponse(JSON.stringify({ message: 'Job not found' }), { status: 404 })
    }

    return HttpResponse.json({ data: job })
  }),

  // PATCH /admin/jobs/:id/approve
  http.patch('*/api/v1/admin/jobs/:id/approve', ({ params }) => {
    const id = parseInt(params.id, 10)
    const job = jobs.find((j) => j.id === id)

    if (!job) {
      return new HttpResponse(JSON.stringify({ message: 'Job not found' }), { status: 404 })
    }

    job.status = JOB_STATUS.PUBLISHED
    job.rejection_reason = null
    job.updated_at = new Date().toISOString()

    return HttpResponse.json({
      data: job,
      message: 'Job approved and published successfully!',
    })
  }),

  // PATCH /admin/jobs/:id/reject
  http.patch('*/api/v1/admin/jobs/:id/reject', async ({ params, request }) => {
    const id = parseInt(params.id, 10)
    const body = await request.json()
    const job = jobs.find((j) => j.id === id)

    if (!job) {
      return new HttpResponse(JSON.stringify({ message: 'Job not found' }), { status: 404 })
    }

    if (!body.reason || !body.reason.trim()) {
      return new HttpResponse(
        JSON.stringify({ message: 'Rejection reason is required' }),
        { status: 422 }
      )
    }

    job.status = JOB_STATUS.REJECTED
    job.rejection_reason = body.reason.trim()
    job.updated_at = new Date().toISOString()

    return HttpResponse.json({
      data: job,
      message: 'Job rejected with feedback.',
    })
  }),
]

