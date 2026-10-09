import { http, HttpResponse } from 'msw';
import { ROLES, APPLICATION_STATUS } from '@/constants';

const API = `${import.meta.env.VITE_API_URL ?? 'http://localhost:8000'}/api/v1`;

const mockJobs = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    slug: 'senior-frontend-engineer',
    company_name: 'TechFlow India',
    company_logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150',
    location: 'Bangalore, Karnataka',
    workplace_type: 'hybrid',
    employment_type: 'full_time',
    experience_level: 'senior',
    salary_min: 2500000,
    salary_max: 3500000,
    currency: 'INR',
    skills: ['React', 'TypeScript', 'Next.js'],
    status: 'published',
    created_at: '2023-10-01T10:00:00Z',
    is_saved: false,
    description: 'We are looking for a Senior Frontend Engineer to lead our core product development.',
    requirements: '5+ years experience in React and modern JavaScript. Experience with state management and performance optimization.',
    partner: {
      id: 'p1',
      name: 'TechFlow India',
      logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150',
      website: 'https://techflow.in',
      description: 'Leading tech solutions provider in India.'
    }
  },
  {
    id: '2',
    title: 'Backend Developer (Python)',
    slug: 'backend-developer-python',
    company_name: 'DataSys Solutions',
    company_logo: null,
    location: 'Pune, Maharashtra',
    workplace_type: 'remote',
    employment_type: 'full_time',
    experience_level: 'mid',
    salary_min: 1500000,
    salary_max: 2200000,
    currency: 'INR',
    skills: ['Python', 'Django', 'PostgreSQL'],
    status: 'published',
    created_at: '2023-10-02T11:00:00Z',
    is_saved: true,
    description: 'Join our data-driven team as a Backend Developer.',
    requirements: '3+ years with Python and Django. Strong SQL knowledge.',
    partner: {
      id: 'p2',
      name: 'DataSys Solutions',
      logo: null,
      website: 'https://datasys.in',
      description: 'Enterprise data solutions.'
    }
  },
  {
    id: '3',
    title: 'UI/UX Designer',
    slug: 'ui-ux-designer',
    company_name: 'CreativeMinds Studio',
    company_logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150',
    location: 'Mumbai, Maharashtra',
    workplace_type: 'on_site',
    employment_type: 'full_time',
    experience_level: 'mid',
    salary_min: 1200000,
    salary_max: 1800000,
    currency: 'INR',
    skills: ['Figma', 'Prototyping', 'User Research'],
    status: 'published',
    created_at: '2023-10-03T09:00:00Z',
    is_saved: false,
    description: 'Design beautiful interfaces for our clients.',
    requirements: 'Portfolio demonstrating strong UI/UX skills. Proficient in Figma.',
    partner: {
      id: 'p3',
      name: 'CreativeMinds Studio',
      logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150',
      website: 'https://creativeminds.in',
      description: 'Award-winning design agency.'
    }
  },
  {
    id: '4',
    title: 'React Native Developer',
    slug: 'react-native-developer',
    company_name: 'AppWorks',
    company_logo: null,
    location: 'Hyderabad, Telangana',
    workplace_type: 'hybrid',
    employment_type: 'contract',
    experience_level: 'senior',
    salary_min: 2000000,
    salary_max: 3000000,
    currency: 'INR',
    skills: ['React Native', 'Mobile Development', 'Redux'],
    status: 'published',
    created_at: '2023-10-04T14:00:00Z',
    is_saved: false,
    description: 'Build cross-platform mobile apps.',
    requirements: '4+ years building React Native apps for iOS and Android.',
    partner: {
      id: 'p4',
      name: 'AppWorks',
      logo: null,
      website: 'https://appworks.in',
      description: 'Mobile first agency.'
    }
  },
  {
    id: '5',
    title: 'Product Manager',
    slug: 'product-manager',
    company_name: 'InnovateX',
    company_logo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=150',
    location: 'Gurgaon, Haryana',
    workplace_type: 'hybrid',
    employment_type: 'full_time',
    experience_level: 'lead',
    salary_min: 3000000,
    salary_max: 4500000,
    currency: 'INR',
    skills: ['Agile', 'Product Strategy', 'Roadmapping'],
    status: 'published',
    created_at: '2023-10-05T10:30:00Z',
    is_saved: false,
    description: 'Lead the product vision and execution.',
    requirements: '6+ years in product management. Proven track record of launching successful products.',
    partner: {
      id: 'p5',
      name: 'InnovateX',
      logo: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=150',
      website: 'https://innovatex.in',
      description: 'Building next-gen SaaS.'
    }
  },
  {
    id: '6',
    title: 'DevOps Engineer',
    slug: 'devops-engineer',
    company_name: 'CloudScale',
    company_logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=150',
    location: 'Chennai, Tamil Nadu',
    workplace_type: 'remote',
    employment_type: 'full_time',
    experience_level: 'mid',
    salary_min: 1800000,
    salary_max: 2600000,
    currency: 'INR',
    skills: ['AWS', 'Kubernetes', 'CI/CD'],
    status: 'published',
    created_at: '2023-10-06T12:00:00Z',
    is_saved: false,
    description: 'Maintain and scale our cloud infrastructure.',
    requirements: 'Strong experience with AWS, Kubernetes, and Terraform.',
    partner: {
      id: 'p6',
      name: 'CloudScale',
      logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=150',
      website: 'https://cloudscale.in',
      description: 'Cloud infrastructure experts.'
    }
  }
];

const mockCompany = {
  id: 'p1',
  name: 'TechFlow India',
  slug: 'techflow-india',
  logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150',
  website: 'https://techflow.in',
  description: 'Leading tech solutions provider in India.',
  industry: 'Information Technology',
  size: '100-500 employees',
  founded_year: 2015,
  jobs: [mockJobs[0]]
};

const mockApplications = [
  {
    id: 'app1',
    job: {
      title: 'Backend Developer (Python)',
      company_name: 'DataSys Solutions',
      company_logo: null,
      location: 'Pune, Maharashtra',
      workplace_type: 'remote',
    },
    applied_at: '2023-10-05T09:00:00Z',
    status: APPLICATION_STATUS ? APPLICATION_STATUS.APPLIED : 'applied',
    timeline: [
      { status: 'applied', changed_at: '2023-10-05T09:00:00Z', note: 'Application submitted successfully.' }
    ]
  },
  {
    id: 'app2',
    job: {
      title: 'DevOps Engineer',
      company_name: 'CloudScale',
      company_logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=150',
      location: 'Chennai, Tamil Nadu',
      workplace_type: 'remote',
    },
    applied_at: '2023-09-20T10:00:00Z',
    status: APPLICATION_STATUS ? APPLICATION_STATUS.SHORTLISTED : 'shortlisted',
    timeline: [
      { status: 'applied', changed_at: '2023-09-20T10:00:00Z', note: 'Application submitted.' },
      { status: 'shortlisted', changed_at: '2023-09-25T14:00:00Z', note: 'Your profile has been shortlisted.' }
    ]
  }
];

let mockCandidateProfile = {
  name: 'Rahul Sharma',
  email: 'rahul.sharma@example.com',
  phone: '+91 9876543210',
  headline: 'Full Stack Developer',
  location: 'Bangalore, India',
  bio: 'Passionate developer with experience in React and Node.js.',
  skills: ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB'],
  experience: [
    {
      company: 'Tech Innovators',
      title: 'Software Engineer',
      from: '2020-06-01',
      to: null,
      current: true,
      description: 'Working on core products using MERN stack.'
    }
  ],
  education: [
    {
      school: 'NIT Trichy',
      degree: 'B.Tech',
      field: 'Computer Science',
      from: '2016-08-01',
      to: '2020-05-01'
    }
  ],
  resume_url: null,
  profile_completion: 80
};

export const publicHandlers = [
  http.get(`${API}/public/jobs`, ({ request }) => {
    const url = new URL(request.url);
    const search = (url.searchParams.get('search') || '').toLowerCase().trim();
    const location = (url.searchParams.get('location') || '').toLowerCase().trim();
    const experience_level = (url.searchParams.get('experience_level') || '').toLowerCase();
    const workplace_type = (url.searchParams.get('workplace_type') || url.searchParams.get('work_mode') || '').toLowerCase().replace('-', '_');
    const employment_type = (url.searchParams.get('employment_type') || '').toLowerCase().replace('-', '_');
    const category = (url.searchParams.get('category') || '').toLowerCase();
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const perPage = parseInt(url.searchParams.get('perPage') || url.searchParams.get('per_page') || '10', 10);

    let filteredJobs = [...mockJobs];

    if (search) {
      filteredJobs = filteredJobs.filter(
        (j) =>
          j.title.toLowerCase().includes(search) ||
          j.company_name.toLowerCase().includes(search) ||
          (j.skills && j.skills.some((s) => s.toLowerCase().includes(search))) ||
          (j.description && j.description.toLowerCase().includes(search))
      );
    }
    if (location) {
      filteredJobs = filteredJobs.filter((j) =>
        j.location.toLowerCase().includes(location)
      );
    }
    if (experience_level && experience_level !== 'all') {
      filteredJobs = filteredJobs.filter(
        (j) => j.experience_level.toLowerCase() === experience_level
      );
    }
    if (workplace_type && workplace_type !== 'all') {
      filteredJobs = filteredJobs.filter(
        (j) => j.workplace_type.toLowerCase() === workplace_type
      );
    }
    if (employment_type && employment_type !== 'all') {
      filteredJobs = filteredJobs.filter(
        (j) => j.employment_type.toLowerCase() === employment_type
      );
    }
    if (category && category !== 'all') {
      filteredJobs = filteredJobs.filter(
        (j) =>
          j.title.toLowerCase().includes(category) ||
          (j.skills && j.skills.some((s) => s.toLowerCase().includes(category)))
      );
    }

    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginated = filteredJobs.slice(start, end);

    return HttpResponse.json({
      data: paginated,
      meta: {
        current_page: page,
        last_page: Math.max(1, Math.ceil(filteredJobs.length / perPage)),
        total: filteredJobs.length,
        per_page: perPage,
      },
    });
  }),

  http.get(`${API}/public/jobs/:slug`, ({ params }) => {
    const job = mockJobs.find((j) => j.slug === params.slug);
    if (!job) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json({ data: job });
  }),

  http.get(`${API}/public/companies/:slug`, ({ params }) => {
    if (params.slug === mockCompany.slug) {
      return HttpResponse.json({ data: mockCompany });
    }
    const companyJobs = mockJobs.filter((j) => {
      const pSlug = j.partner?.name?.toLowerCase().replace(/\s+/g, '-');
      const cSlug = j.company_name?.toLowerCase().replace(/\s+/g, '-');
      return pSlug === params.slug || cSlug === params.slug;
    });

    if (companyJobs.length > 0) {
      const firstJob = companyJobs[0];
      return HttpResponse.json({
        data: {
          id: firstJob.partner?.id || 'comp_' + params.slug,
          name: firstJob.company_name,
          slug: params.slug,
          logo: firstJob.company_logo,
          website: firstJob.partner?.website || `https://${params.slug}.in`,
          description:
            firstJob.partner?.description ||
            `${firstJob.company_name} is an enterprise technology organization delivering digital solutions and top-tier career opportunities.`,
          industry: 'Software & Technology Services',
          size: '100-500 employees',
          founded_year: 2017,
          jobs: companyJobs,
        },
      });
    }

    return new HttpResponse(null, { status: 404 });
  }),

  http.post(`${API}/candidate/saved-jobs`, async ({ request }) => {
    const { job_id } = await request.json();
    const job = mockJobs.find((j) => j.id === String(job_id));
    if (job) job.is_saved = true;
    return HttpResponse.json({ message: 'Job saved successfully' }, { status: 201 });
  }),

  http.delete(`${API}/candidate/saved-jobs/:jobId`, ({ params }) => {
    const job = mockJobs.find((j) => j.id === String(params.jobId));
    if (job) job.is_saved = false;
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${API}/candidate/saved-jobs`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const perPage = 10;
    const saved = mockJobs.filter((j) => j.is_saved);
    const start = (page - 1) * perPage;
    const end = start + perPage;

    return HttpResponse.json({
      data: saved.slice(start, end),
      meta: {
        current_page: page,
        last_page: Math.ceil(saved.length / perPage) || 1,
        total: saved.length,
        per_page: perPage,
      },
    });
  }),

  http.post(`${API}/candidate/jobs/:jobId/apply`, async ({ params, request }) => {
    if (params.jobId === '2') {
      return HttpResponse.json({ message: 'You have already applied for this position.' }, { status: 422 });
    }
    const targetJob = mockJobs.find((j) => j.id === String(params.jobId));
    if (targetJob) {
      targetJob.has_applied = true;
      const alreadyApplied = mockApplications.some((a) => a.job?.title === targetJob.title);
      if (!alreadyApplied) {
        mockApplications.unshift({
          id: `app_${Date.now()}`,
          job: {
            title: targetJob.title,
            company_name: targetJob.company_name,
            company_logo: targetJob.company_logo,
            location: targetJob.location,
            workplace_type: targetJob.workplace_type,
            slug: targetJob.slug,
          },
          applied_at: new Date().toISOString(),
          status: APPLICATION_STATUS ? APPLICATION_STATUS.APPLIED : 'applied',
          timeline: [
            {
              status: 'applied',
              changed_at: new Date().toISOString(),
              note: 'Application submitted successfully with attached resume.',
            },
          ],
        });
      }
    }
    return HttpResponse.json({ message: 'Application submitted successfully!' }, { status: 201 });
  }),

  http.get(`${API}/candidate/applications`, ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const perPage = 10;

    let filtered = [...mockApplications];
    if (status && status !== 'all') {
      filtered = filtered.filter((a) => a.status === status);
    }

    const start = (page - 1) * perPage;
    const end = start + perPage;

    return HttpResponse.json({
      data: filtered.slice(start, end),
      meta: {
        current_page: page,
        last_page: Math.ceil(filtered.length / perPage) || 1,
        total: filtered.length,
        per_page: perPage,
      },
    });
  }),

  http.patch(`${API}/candidate/applications/:id/withdraw`, ({ params }) => {
    const app = mockApplications.find((a) => a.id === params.id);
    if (app) {
      app.status = APPLICATION_STATUS ? APPLICATION_STATUS.WITHDRAWN : 'withdrawn';
      app.timeline.push({
        status: 'withdrawn',
        changed_at: new Date().toISOString(),
        note: 'Candidate withdrew the application.',
      });
    }
    return HttpResponse.json({ message: 'Application withdrawn successfully.' });
  }),

  http.get(`${API}/candidate/profile`, () => {
    return HttpResponse.json({ data: mockCandidateProfile });
  }),

  http.put(`${API}/candidate/profile`, async ({ request }) => {
    const data = await request.json();
    mockCandidateProfile = { ...mockCandidateProfile, ...data };
    return HttpResponse.json({ data: mockCandidateProfile });
  }),

  http.post(`${API}/candidate/profile/resume`, async () => {
    mockCandidateProfile.resume_url = 'https://example.com/rahul_sharma_resume.pdf';
    mockCandidateProfile.resume_name = 'Rahul_Sharma_Resume.pdf';
    return HttpResponse.json({
      resume_url: 'https://example.com/rahul_sharma_resume.pdf',
      resume_name: 'Rahul_Sharma_Resume.pdf',
      parsed_data: {
        suggested_skills: ['TypeScript', 'GraphQL', 'Docker', 'Next.js', 'Tailwind CSS'],
        suggested_headline: 'Full Stack Engineer (React, Node, Cloud)',
        confidence_score: 94,
      },
    });
  }),

  http.get(`${API}/candidate/dashboard`, () => {
    return HttpResponse.json({
      data: {
        stats: {
          total_applications: mockApplications.length,
          shortlisted: mockApplications.filter((a) => a.status === 'shortlisted').length,
          interviews: mockApplications.filter((a) => a.status === 'interview').length,
          saved_jobs: mockJobs.filter((j) => j.is_saved).length,
        },
        recent_applications: mockApplications.slice(0, 5),
        profile_completion: mockCandidateProfile.profile_completion || 85,
        recommended_jobs: mockJobs.slice(0, 3),
      },
    });
  }),
];
