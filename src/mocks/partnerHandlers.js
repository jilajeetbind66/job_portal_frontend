import { http, HttpResponse } from 'msw';

let partners = [
  {
    id: 1,
    name: 'TechCorp Solutions',
    slug: 'techcorp-solutions',
    logo: 'https://via.placeholder.com/150',
    website: 'https://techcorp.example.com',
    description: 'Leading provider of enterprise software solutions.',
    status: 'active',
    created_at: '2023-01-15T10:00:00Z',
    jobs_count: 12,
    recruiters_count: 3,
    admins: [
      { id: 101, name: 'Alice Admin', email: 'alice@techcorp.example.com' },
    ],
  },
  {
    id: 2,
    name: 'Global Finance Inc',
    slug: 'global-finance-inc',
    logo: null,
    website: 'https://globalfinance.example.com',
    description: 'Global financial services and banking institution.',
    status: 'active',
    created_at: '2023-02-20T14:30:00Z',
    jobs_count: 8,
    recruiters_count: 2,
    admins: [
      { id: 102, name: 'Bob Banker', email: 'bob@globalfinance.example.com' },
    ],
  },
  {
    id: 3,
    name: 'Innovate AI',
    slug: 'innovate-ai',
    logo: 'https://via.placeholder.com/150/0000FF/808080',
    website: 'https://innovate.ai',
    description: 'Cutting edge artificial intelligence research.',
    status: 'active',
    created_at: '2023-03-05T09:15:00Z',
    jobs_count: 5,
    recruiters_count: 1,
    admins: [
      { id: 103, name: 'Charlie AI', email: 'charlie@innovate.ai' },
      { id: 104, name: 'Dave Data', email: 'dave@innovate.ai' },
    ],
  },
  {
    id: 4,
    name: 'Suspended Systems',
    slug: 'suspended-systems',
    logo: null,
    website: 'https://suspended.example.com',
    description: 'A company that has been suspended.',
    status: 'suspended',
    created_at: '2023-04-10T11:45:00Z',
    jobs_count: 0,
    recruiters_count: 0,
    admins: [],
  },
  {
    id: 5,
    name: 'HealthPlus Media',
    slug: 'healthplus-media',
    logo: 'https://via.placeholder.com/150/FF0000/FFFFFF',
    website: 'https://healthplus.example.com',
    description: 'Healthcare media and publishing.',
    status: 'active',
    created_at: '2023-05-12T16:20:00Z',
    jobs_count: 3,
    recruiters_count: 1,
    admins: [
      { id: 105, name: 'Eve Health', email: 'eve@healthplus.example.com' },
    ],
  },
  {
    id: 6,
    name: 'Eco Energy',
    slug: 'eco-energy',
    logo: null,
    website: 'https://ecoenergy.example.com',
    description: 'Renewable energy solutions.',
    status: 'active',
    created_at: '2023-06-18T08:00:00Z',
    jobs_count: 15,
    recruiters_count: 4,
    admins: [
      { id: 106, name: 'Frank Green', email: 'frank@ecoenergy.example.com' },
    ],
  },
  {
    id: 7,
    name: 'Retail Giants',
    slug: 'retail-giants',
    logo: 'https://via.placeholder.com/150/00FF00/000000',
    website: 'https://retailgiants.example.com',
    description: 'Worldwide retail chain.',
    status: 'active',
    created_at: '2023-07-22T13:10:00Z',
    jobs_count: 45,
    recruiters_count: 10,
    admins: [
      { id: 107, name: 'Grace Retail', email: 'grace@retailgiants.example.com' },
    ],
  },
  {
    id: 8,
    name: 'EduTech Online',
    slug: 'edutech-online',
    logo: null,
    website: 'https://edutech.example.com',
    description: 'Online education and learning platform.',
    status: 'suspended',
    created_at: '2023-08-30T10:30:00Z',
    jobs_count: 2,
    recruiters_count: 1,
    admins: [
      { id: 108, name: 'Heidi Learn', email: 'heidi@edutech.example.com' },
    ],
  },
];

export const partnerHandlers = [
  // List Partners
  http.get('*/api/v1/admin/partners', ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const status = url.searchParams.get('status');
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const perPage = parseInt(url.searchParams.get('per_page') || '15', 10);

    let filtered = partners;

    if (search) {
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(search));
    }

    if (status) {
      filtered = filtered.filter((p) => p.status === status);
    }

    const total = filtered.length;
    const lastPage = Math.ceil(total / perPage) || 1;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginatedItems = filtered.slice(start, end).map(({ admins, ...partner }) => partner);

    return HttpResponse.json({
      data: paginatedItems,
      meta: {
        current_page: page,
        last_page: lastPage,
        per_page: perPage,
        total,
      },
    });
  }),

  // Get Partner Detail
  http.get('*/api/v1/admin/partners/:id', ({ params }) => {
    const { id } = params;
    const partner = partners.find((p) => p.id === parseInt(id, 10));

    if (!partner) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(partner);
  }),

  // Create Partner
  http.post('*/api/v1/admin/partners', async ({ request }) => {
    let data;
    const contentType = request.headers.get('Content-Type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
    } else {
      data = await request.json();
    }

    const newId = Math.max(0, ...partners.map((p) => p.id)) + 1;
    const newPartner = {
      id: newId,
      name: data.name || `Partner ${newId}`,
      slug: data.name ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `partner-${newId}`,
      logo: data.logo && typeof data.logo !== 'string' ? 'https://via.placeholder.com/150' : null,
      website: data.website || '',
      description: data.description || '',
      status: 'active',
      created_at: new Date().toISOString(),
      jobs_count: 0,
      recruiters_count: 0,
      admins: [],
    };

    partners.push(newPartner);
    return HttpResponse.json(newPartner, { status: 201 });
  }),

  // Update Partner
  http.put('*/api/v1/admin/partners/:id', async ({ request, params }) => {
    const { id } = params;
    const partnerIndex = partners.findIndex((p) => p.id === parseInt(id, 10));

    if (partnerIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    let data;
    const contentType = request.headers.get('Content-Type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
    } else {
      data = await request.json();
    }

    partners[partnerIndex] = {
      ...partners[partnerIndex],
      ...data,
      id: parseInt(id, 10), // Ensure ID doesn't change
      admins: partners[partnerIndex].admins, // Ensure admins don't get overwritten
    };

    return HttpResponse.json(partners[partnerIndex]);
  }),
  
  // Update Partner with POST (for FormData with _method=PUT)
  http.post('*/api/v1/admin/partners/:id', async ({ request, params }) => {
    const { id } = params;
    const partnerIndex = partners.findIndex((p) => p.id === parseInt(id, 10));

    if (partnerIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    let data;
    const contentType = request.headers.get('Content-Type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      data = Object.fromEntries(formData.entries());
      if (data._method !== 'PUT') {
         // Not a PUT override, might be wrong route, but let's handle it here anyway
      }
    } else {
      data = await request.json();
    }

    partners[partnerIndex] = {
      ...partners[partnerIndex],
      ...data,
      id: parseInt(id, 10), 
      admins: partners[partnerIndex].admins, 
    };

    return HttpResponse.json(partners[partnerIndex]);
  }),

  // Toggle Suspend Partner
  http.patch('*/api/v1/admin/partners/:id/suspend', ({ params }) => {
    const { id } = params;
    const partnerIndex = partners.findIndex((p) => p.id === parseInt(id, 10));

    if (partnerIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    partners[partnerIndex].status = partners[partnerIndex].status === 'active' ? 'suspended' : 'active';

    return HttpResponse.json({
      message: 'Partner status updated successfully',
      status: partners[partnerIndex].status,
    });
  }),

  // Create Partner Admin
  http.post('*/api/v1/admin/partners/:id/admins', async ({ request, params }) => {
    const { id } = params;
    const partnerIndex = partners.findIndex((p) => p.id === parseInt(id, 10));

    if (partnerIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    const data = await request.json();
    
    // Find highest admin ID
    let maxAdminId = 0;
    partners.forEach((p) => {
      p.admins.forEach((a) => {
        if (a.id > maxAdminId) maxAdminId = a.id;
      });
    });

    const newAdmin = {
      id: maxAdminId + 1,
      name: data.name,
      email: data.email,
    };

    partners[partnerIndex].admins.push(newAdmin);

    return HttpResponse.json(newAdmin, { status: 201 });
  }),
];
