import { describe, it, expect } from 'vitest'
import { getCanonicalUrl, formatSeoTitle, formatMetaDescription } from './seo'
import {
  createJobPostingSchema,
  createOrganizationSchema,
  createWebSiteSchema,
  createBreadcrumbSchema,
} from './schema'

describe('SEO Utilities', () => {
  describe('getCanonicalUrl', () => {
    it('normalizes relative path to full https canonical url', () => {
      expect(getCanonicalUrl('/jobs')).toBe('https://vcreateventures.com/jobs')
      expect(getCanonicalUrl('jobs-in-prayagraj')).toBe('https://vcreateventures.com/jobs-in-prayagraj')
    })

    it('strips trailing slashes correctly', () => {
      expect(getCanonicalUrl('/jobs/')).toBe('https://vcreateventures.com/jobs')
      expect(getCanonicalUrl('/')).toBe('https://vcreateventures.com/')
    })

    it('strips tracking query parameters', () => {
      expect(getCanonicalUrl('/jobs?utm_source=google&utm_medium=cpc')).toBe('https://vcreateventures.com/jobs')
      expect(getCanonicalUrl('/jobs?fbclid=12345')).toBe('https://vcreateventures.com/jobs')
    })

    it('converts to lowercase', () => {
      expect(getCanonicalUrl('/Jobs/Software-Developer')).toBe('https://vcreateventures.com/jobs/software-developer')
    })
  })

  describe('formatSeoTitle', () => {
    it('appends brand name when not already present', () => {
      expect(formatSeoTitle('React Developer Jobs in Prayagraj')).toBe(
        'React Developer Jobs in Prayagraj | Vcreateventures'
      )
    })

    it('does not duplicate brand name if present', () => {
      expect(formatSeoTitle('React Developer | Vcreateventures')).toBe(
        'React Developer | Vcreateventures'
      )
    })

    it('supports subtitle location format', () => {
      expect(formatSeoTitle('Software Engineer', 'Bangalore')).toBe(
        'Software Engineer – Bangalore | Vcreateventures'
      )
    })
  })

  describe('formatMetaDescription', () => {
    it('truncates cleanly without breaking mid-word when over limit', () => {
      const longText = 'A'.repeat(50) + ' ' + 'B'.repeat(60) + ' ' + 'C'.repeat(60)
      const formatted = formatMetaDescription(longText, 100)
      expect(formatted.length).toBeLessThanOrEqual(105)
      expect(formatted.endsWith('...')).toBe(true)
    })
  })
})

describe('Structured Data (Schema.org) Generators', () => {
  it('creates valid JobPosting schema from real job data', () => {
    const job = {
      id: 'j1',
      title: 'Senior Frontend Engineer',
      description: 'Lead core frontend architecture using React.',
      company_name: 'TechFlow India',
      company_logo: 'https://vcreateventures.com/logo.png',
      location: 'Bangalore, Karnataka',
      workplace_type: 'hybrid',
      employment_type: 'full_time',
      salary_min: 2500000,
      salary_max: 3500000,
      currency: 'INR',
      created_at: '2026-10-01T10:00:00Z',
      skills: ['React', 'TypeScript'],
    }

    const schema = createJobPostingSchema(job)
    expect(schema).toBeDefined()
    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@type']).toBe('JobPosting')
    expect(schema.title).toBe('Senior Frontend Engineer')
    expect(schema.hiringOrganization.name).toBe('TechFlow India')
    expect(schema.employmentType).toBe('FULL_TIME')
    expect(schema.baseSalary.value.minValue).toBe(2500000)
    expect(schema.baseSalary.value.maxValue).toBe(3500000)
    expect(schema.jobLocation.address.addressLocality).toBe('Bangalore')
    expect(schema.skills).toContain('React')
  })

  it('correctly formats remote jobs with TELECOMMUTE type', () => {
    const remoteJob = {
      title: 'Remote React Developer',
      company_name: 'AppWorks',
      location: 'Prayagraj, Uttar Pradesh',
      workplace_type: 'remote',
    }

    const schema = createJobPostingSchema(remoteJob)
    expect(schema.jobLocationType).toBe('TELECOMMUTE')
    expect(schema.applicantLocationRequirements.name).toBe('India')
  })

  it('creates valid Organization and WebSite schema with SearchAction', () => {
    const org = createOrganizationSchema()
    expect(org['@type']).toBe('Organization')
    expect(org.name).toBe('Vcreateventures')
    expect(org.url).toBe('https://vcreateventures.com')

    const site = createWebSiteSchema()
    expect(site['@type']).toBe('WebSite')
    expect(site.potentialAction['@type']).toBe('SearchAction')
    expect(site.potentialAction.target.urlTemplate).toContain('/jobs?search=')
  })

  it('creates valid BreadcrumbList schema', () => {
    const breadcrumbs = [
      { label: 'Jobs in India', to: '/jobs-in-india' },
      { label: 'Uttar Pradesh', to: '/jobs-in-uttar-pradesh' },
      { label: 'Prayagraj', to: '/jobs-in-prayagraj' },
      { label: 'Software Developer' },
    ]

    const schema = createBreadcrumbSchema(breadcrumbs)
    expect(schema['@type']).toBe('BreadcrumbList')
    expect(schema.itemListElement).toHaveLength(4)
    expect(schema.itemListElement[0].name).toBe('Jobs in India')
    expect(schema.itemListElement[0].item).toBe('https://vcreateventures.com/jobs-in-india')
    expect(schema.itemListElement[3].item).toBeUndefined()
  })
})

