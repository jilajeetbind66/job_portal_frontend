import { http, HttpResponse } from 'msw'
import { APPLICATION_STATUS } from '@/constants'

let applications = [
  {
    id: 101,
    job_id: 1,
    job_title: 'Senior Full Stack Engineer (React & Node)',
    candidate: {
      id: 201,
      name: 'Aditya Sharma',
      email: 'aditya.sharma@example.com',
      phone: '+91 98765 43210',
      location: 'Bangalore, India',
      current_title: 'Full Stack Developer at TechVentures',
      experience_years: 5.5,
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'GraphQL'],
      resume_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      linkedin: 'https://linkedin.com/in/aditya-sharma-sample',
      github: 'https://github.com/aditya-sample',
    },
    cover_letter: 'I have 5+ years building distributed React/Node applications with TypeScript and Postgres. Excited about TechCorp scale and products.',
    status: APPLICATION_STATUS.INTERVIEW,
    applied_at: '2026-09-20T10:15:00Z',
    updated_at: '2026-10-02T14:30:00Z',
    history_timeline: [
      {
        id: 1,
        from_status: null,
        to_status: APPLICATION_STATUS.APPLIED,
        changed_by: 'Candidate',
        note: 'Application submitted through job portal.',
        timestamp: '2026-09-20T10:15:00Z',
      },
      {
        id: 2,
        from_status: APPLICATION_STATUS.APPLIED,
        to_status: APPLICATION_STATUS.SHORTLISTED,
        changed_by: 'Tanzeem (Recruiter)',
        note: 'Resume matches full stack technical requirements. Strong TypeScript and Docker experience.',
        timestamp: '2026-09-25T11:00:00Z',
      },
      {
        id: 3,
        from_status: APPLICATION_STATUS.SHORTLISTED,
        to_status: APPLICATION_STATUS.INTERVIEW,
        changed_by: 'Tanzeem (Recruiter)',
        note: 'Round 1 Technical Architecture interview scheduled for Oct 5th at 3 PM.',
        timestamp: '2026-10-02T14:30:00Z',
      },
    ],
  },
  {
    id: 102,
    job_id: 1,
    job_title: 'Senior Full Stack Engineer (React & Node)',
    candidate: {
      id: 202,
      name: 'Pooja Verma',
      email: 'pooja.verma@example.com',
      phone: '+91 99887 76655',
      location: 'Hyderabad, India',
      current_title: 'Senior Software Engineer at CloudSoft',
      experience_years: 6,
      skills: ['React', 'Node.js', 'Redux', 'AWS', 'Microservices'],
      resume_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      linkedin: 'https://linkedin.com/in/pooja-verma-sample',
      github: 'https://github.com/pooja-sample',
    },
    cover_letter: 'Proven background in optimizing React client apps and maintaining serverless Node.js APIs on AWS.',
    status: APPLICATION_STATUS.OFFERED,
    applied_at: '2026-09-18T14:00:00Z',
    updated_at: '2026-10-06T16:00:00Z',
    history_timeline: [
      {
        id: 1,
        from_status: null,
        to_status: APPLICATION_STATUS.APPLIED,
        changed_by: 'Candidate',
        note: 'Applied online.',
        timestamp: '2026-09-18T14:00:00Z',
      },
      {
        id: 2,
        from_status: APPLICATION_STATUS.APPLIED,
        to_status: APPLICATION_STATUS.SHORTLISTED,
        changed_by: 'Tanzeem (Recruiter)',
        note: 'Strong portfolio and AWS certification.',
        timestamp: '2026-09-22T09:30:00Z',
      },
      {
        id: 3,
        from_status: APPLICATION_STATUS.SHORTLISTED,
        to_status: APPLICATION_STATUS.INTERVIEW,
        changed_by: 'Tanzeem (Recruiter)',
        note: 'Completed 2 rounds with Engineering Lead. Positive feedback on problem solving.',
        timestamp: '2026-09-29T11:00:00Z',
      },
      {
        id: 4,
        from_status: APPLICATION_STATUS.INTERVIEW,
        to_status: APPLICATION_STATUS.OFFERED,
        changed_by: 'Partner Admin',
        note: 'Formal offer package extended for Senior Full Stack Engineer role (24 LPA).',
        timestamp: '2026-10-06T16:00:00Z',
      },
    ],
  },
  {
    id: 103,
    job_id: 1,
    job_title: 'Senior Full Stack Engineer (React & Node)',
    candidate: {
      id: 203,
      name: 'Rohan Mehra',
      email: 'rohan.mehra@example.com',
      phone: '+91 97654 32109',
      location: 'Pune, India',
      current_title: 'Frontend Engineer at FinTech Labs',
      experience_years: 3,
      skills: ['React', 'JavaScript', 'HTML/CSS', 'Tailwind'],
      resume_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      linkedin: 'https://linkedin.com/in/rohan-sample',
      github: 'https://github.com/rohan-sample',
    },
    cover_letter: 'Looking to transition from frontend to full stack engineering.',
    status: APPLICATION_STATUS.REJECTED,
    applied_at: '2026-09-21T09:00:00Z',
    updated_at: '2026-09-26T15:00:00Z',
    history_timeline: [
      {
        id: 1,
        from_status: null,
        to_status: APPLICATION_STATUS.APPLIED,
        changed_by: 'Candidate',
        note: 'Application received.',
        timestamp: '2026-09-21T09:00:00Z',
      },
      {
        id: 2,
        from_status: APPLICATION_STATUS.APPLIED,
        to_status: APPLICATION_STATUS.REJECTED,
        changed_by: 'Tanzeem (Recruiter)',
        note: 'Role requires 5+ years backend/distributed systems experience. Candidate currently has 3 years purely frontend.',
        timestamp: '2026-09-26T15:00:00Z',
      },
    ],
  },
  {
    id: 104,
    job_id: 1,
    job_title: 'Senior Full Stack Engineer (React & Node)',
    candidate: {
      id: 204,
      name: 'Sneha Kulkarni',
      email: 'sneha.k@example.com',
      phone: '+91 91234 56789',
      location: 'Bangalore, India',
      current_title: 'Full Stack Lead at Nexus Systems',
      experience_years: 7,
      skills: ['React', 'Node.js', 'PostgreSQL', 'Kubernetes', 'Redis', 'GCP'],
      resume_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      linkedin: 'https://linkedin.com/in/sneha-sample',
      github: 'https://github.com/sneha-sample',
    },
    cover_letter: '7 years architecting web applications, managing teams of 6 engineers. Immediate joiner.',
    status: APPLICATION_STATUS.APPLIED,
    applied_at: '2026-10-07T08:20:00Z',
    updated_at: '2026-10-07T08:20:00Z',
    history_timeline: [
      {
        id: 1,
        from_status: null,
        to_status: APPLICATION_STATUS.APPLIED,
        changed_by: 'Candidate',
        note: 'Application submitted through direct portal link.',
        timestamp: '2026-10-07T08:20:00Z',
      },
    ],
  },
  {
    id: 105,
    job_id: 1,
    job_title: 'Senior Full Stack Engineer (React & Node)',
    candidate: {
      id: 205,
      name: 'Vikas Deshmukh',
      email: 'vikas.deshmukh@example.com',
      phone: '+91 98112 23344',
      location: 'Mumbai, India',
      current_title: 'Principal Engineer at StartupHub',
      experience_years: 8,
      skills: ['React', 'Node.js', 'System Design', 'PostgreSQL', 'Microservices'],
      resume_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      linkedin: 'https://linkedin.com/in/vikas-sample',
      github: 'https://github.com/vikas-sample',
    },
    cover_letter: 'Extensive background in scalable real-time architectures and fintech apps.',
    status: APPLICATION_STATUS.HIRED,
    applied_at: '2026-09-10T11:00:00Z',
    updated_at: '2026-10-04T12:00:00Z',
    history_timeline: [
      {
        id: 1,
        from_status: null,
        to_status: APPLICATION_STATUS.APPLIED,
        changed_by: 'Candidate',
        note: 'Applied online.',
        timestamp: '2026-09-10T11:00:00Z',
      },
      {
        id: 2,
        from_status: APPLICATION_STATUS.APPLIED,
        to_status: APPLICATION_STATUS.SHORTLISTED,
        changed_by: 'Tanzeem (Recruiter)',
        note: 'Shortlisted for executive review.',
        timestamp: '2026-09-12T14:00:00Z',
      },
      {
        id: 3,
        from_status: APPLICATION_STATUS.SHORTLISTED,
        to_status: APPLICATION_STATUS.INTERVIEW,
        changed_by: 'Tanzeem (Recruiter)',
        note: 'Passed Technical & Leadership rounds.',
        timestamp: '2026-09-20T16:00:00Z',
      },
      {
        id: 4,
        from_status: APPLICATION_STATUS.INTERVIEW,
        to_status: APPLICATION_STATUS.OFFERED,
        changed_by: 'Partner Admin',
        note: 'Offer accepted by candidate.',
        timestamp: '2026-09-28T10:00:00Z',
      },
      {
        id: 5,
        from_status: APPLICATION_STATUS.OFFERED,
        to_status: APPLICATION_STATUS.HIRED,
        changed_by: 'Tanzeem (Recruiter)',
        note: 'Onboarding completed. Welcome to TechCorp!',
        timestamp: '2026-10-04T12:00:00Z',
      },
    ],
  },
]

export const applicantHandlers = [
  // GET /partner/applications (List with filters)
  http.get('*/api/v1/partner/applications', ({ request }) => {
    const url = new URL(request.url)
    const jobId = url.searchParams.get('job_id')
    const status = url.searchParams.get('status')
    const search = url.searchParams.get('search')?.toLowerCase() || ''
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const perPage = parseInt(url.searchParams.get('per_page') || '10', 10)

    let filtered = applications

    if (jobId) {
      filtered = filtered.filter((a) => a.job_id === parseInt(jobId, 10))
    }

    if (status && status !== 'all') {
      filtered = filtered.filter((a) => a.status === status)
    }

    if (search) {
      filtered = filtered.filter(
        (a) =>
          a.candidate.name.toLowerCase().includes(search) ||
          a.candidate.email.toLowerCase().includes(search) ||
          a.candidate.skills.some((s) => s.toLowerCase().includes(search))
      )
    }

    const total = filtered.length
    const lastPage = Math.ceil(total / perPage) || 1
    const start = (page - 1) * perPage
    const paginated = filtered.slice(start, start + perPage)

    // Stage counts for quick overview
    const baseList = jobId ? applications.filter((a) => a.job_id === parseInt(jobId, 10)) : applications
    const counts = {
      all: baseList.length,
      [APPLICATION_STATUS.APPLIED]: baseList.filter((a) => a.status === APPLICATION_STATUS.APPLIED).length,
      [APPLICATION_STATUS.SHORTLISTED]: baseList.filter((a) => a.status === APPLICATION_STATUS.SHORTLISTED).length,
      [APPLICATION_STATUS.INTERVIEW]: baseList.filter((a) => a.status === APPLICATION_STATUS.INTERVIEW).length,
      [APPLICATION_STATUS.OFFERED]: baseList.filter((a) => a.status === APPLICATION_STATUS.OFFERED).length,
      [APPLICATION_STATUS.HIRED]: baseList.filter((a) => a.status === APPLICATION_STATUS.HIRED).length,
      [APPLICATION_STATUS.REJECTED]: baseList.filter((a) => a.status === APPLICATION_STATUS.REJECTED).length,
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

  // GET /partner/applications/:id
  http.get('*/api/v1/partner/applications/:id', ({ params }) => {
    const id = parseInt(params.id, 10)
    const application = applications.find((a) => a.id === id)

    if (!application) {
      return new HttpResponse(JSON.stringify({ message: 'Application not found' }), { status: 404 })
    }

    return HttpResponse.json({ data: application })
  }),

  // PATCH /partner/applications/:id/status
  http.patch('*/api/v1/partner/applications/:id/status', async ({ params, request }) => {
    const id = parseInt(params.id, 10)
    const { status, note } = await request.json()
    const app = applications.find((a) => a.id === id)

    if (!app) {
      return new HttpResponse(JSON.stringify({ message: 'Application not found' }), { status: 404 })
    }

    const prevStatus = app.status
    app.status = status
    app.updated_at = new Date().toISOString()

    // Append to audit timeline
    app.history_timeline.push({
      id: Date.now(),
      from_status: prevStatus,
      to_status: status,
      changed_by: 'Tanzeem (Recruiter)',
      note: note || `Application advanced to ${status}.`,
      timestamp: new Date().toISOString(),
    })

    return HttpResponse.json({
      data: app,
      message: `Applicant status successfully changed to ${status}.`,
    })
  }),
]

