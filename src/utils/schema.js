import { SITE_CONFIG, getCanonicalUrl } from './seo'

/**
 * Maps application employment types to Schema.org standard identifiers
 */
const EMPLOYMENT_TYPE_MAP = {
  full_time: 'FULL_TIME',
  'full-time': 'FULL_TIME',
  part_time: 'PART_TIME',
  'part-time': 'PART_TIME',
  contract: 'CONTRACTOR',
  internship: 'INTERN',
  temporary: 'TEMPORARY',
}

/**
 * Creates a valid Schema.org JobPosting JSON-LD object using REAL job inventory.
 * Never invents fake salaries, companies, or addresses.
 *
 * @param {object} job - Raw job entity from API
 * @returns {object|null} Structured JobPosting object or null if invalid
 */
export function createJobPostingSchema(job) {
  if (!job || !job.title) return null

  // Calculate validThrough (standard 60 days from posting if not specified)
  let datePosted = new Date().toISOString()
  if (job.created_at) {
    try {
      datePosted = new Date(job.created_at).toISOString()
    } catch {
      datePosted = new Date().toISOString()
    }
  }

  const validThroughDate = new Date(new Date(datePosted).getTime() + 60 * 24 * 60 * 60 * 1000)
  const validThrough = validThroughDate.toISOString()

  // Base schema
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description || job.requirements || `${job.title} role at ${job.company_name || 'verified hiring partner'}.`,
    datePosted,
    validThrough,
    directApply: true,
  }

  // Employment Type
  if (job.employment_type) {
    const mappedType = EMPLOYMENT_TYPE_MAP[job.employment_type.toLowerCase()]
    if (mappedType) schema.employmentType = mappedType
  }

  // Hiring Organization
  const companyName = job.company_name || job.partner?.name
  if (companyName) {
    schema.hiringOrganization = {
      '@type': 'Organization',
      name: companyName,
    }
    if (job.partner?.website) {
      schema.hiringOrganization.sameAs = job.partner.website
    }
    if (job.company_logo || job.partner?.logo) {
      schema.hiringOrganization.logo = job.company_logo || job.partner?.logo
    }
  }

  // Work Mode & Location
  const isRemote = job.workplace_type === 'remote'
  if (isRemote) {
    schema.jobLocationType = 'TELECOMMUTE'
    schema.applicantLocationRequirements = {
      '@type': 'Country',
      name: 'India',
    }
  }

  if (job.location) {
    const parts = job.location.split(',').map((p) => p.trim())
    const locality = parts[0] || 'India'
    const region = parts[1] || ''

    schema.jobLocation = {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: locality,
        addressCountry: 'IN',
        ...(region ? { addressRegion: region } : {}),
      },
    }
  }

  // Base Salary (Only when verified numbers exist in data)
  if (job.salary_min || job.salary_max) {
    schema.baseSalary = {
      '@type': 'MonetaryAmount',
      currency: job.currency || 'INR',
      value: {
        '@type': 'QuantitativeValue',
        unitText: 'YEAR',
        ...(job.salary_min ? { minValue: Number(job.salary_min) } : {}),
        ...(job.salary_max ? { maxValue: Number(job.salary_max) } : {}),
      },
    }
  }

  // Skills
  if (Array.isArray(job.skills) && job.skills.length > 0) {
    schema.skills = job.skills.join(', ')
  }

  return schema
}

/**
 * Creates Schema.org Organization structured data for Vcreateventures
 */
export function createOrganizationSchema(customCompany = null) {
  if (customCompany) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: customCompany.name,
      url: customCompany.website || getCanonicalUrl(`/company/${customCompany.slug}`),
      ...(customCompany.logo ? { logo: customCompany.logo } : {}),
      ...(customCompany.description ? { description: customCompany.description } : {}),
    }
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.siteUrl,
    logo: `${SITE_CONFIG.siteUrl}/logo.png`,
    sameAs: [
      'https://twitter.com/vcreateventures',
      'https://www.linkedin.com/company/vcreateventures',
    ],
    description: SITE_CONFIG.defaultDescription,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      areaServed: 'IN',
      availableLanguage: ['en', 'hi'],
    },
  }
}

/**
 * Creates Schema.org WebSite structured data with SearchAction
 */
export function createWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.siteUrl}/jobs?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * Creates Schema.org BreadcrumbList structured data
 *
 * @param {Array<{ label: string, to?: string }>} items - Breadcrumb items list
 */
export function createBreadcrumbSchema(items = []) {
  if (!items || items.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.to ? getCanonicalUrl(item.to) : undefined,
    })),
  }
}

