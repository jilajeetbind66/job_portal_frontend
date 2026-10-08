import { http, HttpResponse } from 'msw'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

let companyProfile = {
  id: 1,
  name: 'TechCorp Solutions Pvt Ltd',
  display_name: 'TechCorp',
  tagline: 'Empowering Next-Generation Digital Transformation',
  industry: 'Software & Technology',
  company_size: '201-500',
  website: 'https://techcorp-sample.com',
  email: 'careers@techcorp-sample.com',
  phone: '+91 80 4123 4567',
  location: 'Bangalore, Karnataka, India',
  address: 'Level 4, Cyber Park, Electronic City Phase 1, Bangalore 560100',
  description:
    'TechCorp is a leading enterprise software provider specializing in cloud infrastructure, AI-powered automation, and high-performance digital workplace platforms across APAC and North America.',
  logo_url: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=160&auto=format&fit=crop&q=80',
  banner_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',
  founded_year: 2018,
  linkedin: 'https://linkedin.com/company/techcorp-sample',
  twitter: 'https://twitter.com/techcorp_sample',
  benefits: [
    'Competitive Compensation & ESOPs',
    'Comprehensive Health & Family Insurance',
    'Flexible Hybrid & Remote Work Policies',
    'Annual Learning & Certification Stipend',
    'Wellness Days & Generous Paid Time Off',
  ],
}

export const companyHandlers = [
  // Get Company Profile
  http.get(`${API}/api/v1/partner/company`, () => {
    return HttpResponse.json({
      data: companyProfile,
    })
  }),

  // Update Company Profile
  http.put(`${API}/api/v1/partner/company`, async ({ request }) => {
    const payload = await request.json()

    if (!payload.name || !payload.website) {
      return HttpResponse.json(
        {
          message: 'Validation failed',
          errors: {
            name: !payload.name ? ['Company name is required.'] : [],
            website: !payload.website ? ['Website URL is required.'] : [],
          },
        },
        { status: 422 }
      )
    }

    companyProfile = {
      ...companyProfile,
      ...payload,
      updated_at: new Date().toISOString(),
    }

    return HttpResponse.json({
      message: 'Company profile successfully updated.',
      data: companyProfile,
    })
  }),

  // Upload Logo
  http.post(`${API}/api/v1/partner/company/logo`, async () => {
    // In mock mode, we generate a persistent placeholder URL or data URI
    companyProfile.logo_url =
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80'
    return HttpResponse.json({
      message: 'Logo uploaded successfully.',
      logo_url: companyProfile.logo_url,
    })
  }),
]

