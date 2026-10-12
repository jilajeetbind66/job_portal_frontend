/**
 * Production SEO Configuration & Utilities for Vcreateventures
 */

export const SITE_CONFIG = {
  name: 'Vcreateventures',
  domain: 'vcreateventures.com',
  siteUrl: 'https://vcreateventures.com',
  defaultTitle: 'Vcreateventures – Find Jobs in India | Fresher, IT & Remote Jobs',
  defaultDescription:
    'Search verified jobs in India across 28 states and UTs. Explore software, IT, fresher jobs, internships, and remote opportunities with top hiring companies on Vcreateventures.',
  defaultKeywords: [
    'jobs in India',
    'fresher jobs',
    'IT jobs',
    'software jobs',
    'remote jobs',
    'internships',
    'Prayagraj jobs',
    'tech jobs',
  ],
  defaultOgImage: 'https://vcreateventures.com/logo.png',
  twitterHandle: '@vcreateventures',
  locale: 'en_IN',
  themeColor: '#6A8E7F',
}

/**
 * Normalizes any relative or absolute path into a clean, canonical URL:
 * - Ensures https://vcreateventures.com prefix
 * - Strips trailing slashes (except root)
 * - Converts to lowercase
 * - Strips tracking query parameters (utm_*, fbclid, gclid, etc.)
 *
 * @param {string} path - URL path or full URL
 * @param {boolean} preserveSearch - Whether to keep clean search params (default false)
 * @returns {string} Fully qualified canonical URL
 */
export function getCanonicalUrl(path = '/', preserveSearch = false) {
  if (!path) return SITE_CONFIG.siteUrl

  try {
    const isFullUrl = path.startsWith('http://') || path.startsWith('https://')
    const url = isFullUrl ? new URL(path) : new URL(path, SITE_CONFIG.siteUrl)

    // Force canonical domain and HTTPS
    url.protocol = 'https:'
    url.host = SITE_CONFIG.domain

    // Remove tracking parameters
    const paramsToDelete = []
    url.searchParams.forEach((_, key) => {
      if (
        key.startsWith('utm_') ||
        ['fbclid', 'gclid', 'ref', 'source', 'trk'].includes(key.toLowerCase())
      ) {
        paramsToDelete.push(key)
      }
    })
    paramsToDelete.forEach((key) => url.searchParams.delete(key))

    let pathname = url.pathname.toLowerCase()
    // Strip trailing slash unless it is just root '/'
    if (pathname.length > 1 && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1)
    }

    if (preserveSearch && url.search) {
      return `${url.origin}${pathname}${url.search}`
    }

    return `${url.origin}${pathname}`
  } catch {
    const cleanPath = path.replace(/\/+$/, '') || '/'
    return `${SITE_CONFIG.siteUrl}${cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath}`.toLowerCase()
  }
}

/**
 * Generates an optimized, unique page title conforming to Google SERP pixel limits (~60 chars)
 *
 * @param {string} title - Page specific title or topic
 * @param {string} subtitle - Optional secondary keyword or location
 * @returns {string} Formatted title string
 */
export function formatSeoTitle(title, subtitle = null) {
  if (!title) return SITE_CONFIG.defaultTitle

  if (title.includes(SITE_CONFIG.name)) return title

  if (subtitle) {
    return `${title} – ${subtitle} | ${SITE_CONFIG.name}`
  }

  return `${title} | ${SITE_CONFIG.name}`
}

/**
 * Truncates meta description to ideal length (140-160 characters) without cutting mid-word
 *
 * @param {string} text - Raw description text
 * @param {number} maxLen - Maximum character length (default 155)
 * @returns {string} Clean truncated string
 */
export function formatMetaDescription(text, maxLen = 155) {
  if (!text) return SITE_CONFIG.defaultDescription

  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= maxLen) return clean

  const truncated = clean.substring(0, maxLen)
  const lastSpace = truncated.lastIndexOf(' ')
  return (lastSpace > 100 ? truncated.substring(0, lastSpace) : truncated) + '...'
}

/**
 * Standard Fresher Job Landing Pages
 */
export const FRESHER_LANDING_PAGES = [
  {
    slug: 'fresher-jobs',
    title: 'Fresher Jobs in India – Entry Level & Graduate Roles',
    h1: 'Fresher Jobs Across India',
    location: 'All India',
    description:
      'Find entry-level fresher jobs across India. Verified vacancies for recent graduates, junior software developers, and entry-level IT professionals.',
  },
  {
    slug: 'fresher-jobs-in-prayagraj',
    title: 'Fresher Jobs in Prayagraj – Entry-Level Openings (Allahabad)',
    h1: 'Fresher Jobs in Prayagraj (Allahabad)',
    location: 'Prayagraj',
    description:
      'Explore verified fresher jobs in Prayagraj for college graduates and junior software engineers in Civil Lines, Naini, Jhalwa, and surrounding areas.',
  },
  {
    slug: 'fresher-jobs-in-uttar-pradesh',
    title: 'Fresher Jobs in Uttar Pradesh – Graduate & Junior Roles',
    h1: 'Fresher Jobs Across Uttar Pradesh',
    location: 'Uttar Pradesh',
    description:
      'Discover entry-level fresher job vacancies in Uttar Pradesh across Lucknow, Noida, Prayagraj, Kanpur, Varanasi, and Agra verified by Vcreateventures.',
  },
  {
    slug: 'fresher-jobs-in-bangalore',
    title: 'Fresher Jobs in Bangalore – Junior Tech & Software Roles',
    h1: 'Fresher Jobs in Bangalore',
    location: 'Bangalore',
    description:
      'Explore junior developer and fresher openings in Bangalore tech companies, startups, and software enterprises verified on Vcreateventures.',
  },
  {
    slug: 'fresher-jobs-in-hyderabad',
    title: 'Fresher Jobs in Hyderabad – Entry Level IT Opportunities',
    h1: 'Fresher Jobs in Hyderabad',
    location: 'Hyderabad',
    description:
      'Find entry-level IT, cloud, and engineering fresher vacancies in HITEC City and Hyderabad with verified hiring partners.',
  },
  {
    slug: 'software-jobs-for-freshers',
    title: 'Software Jobs for Freshers – Junior Developer Positions',
    h1: 'Software Jobs for Freshers',
    role: 'Software Developer',
    description:
      'Start your tech career with verified software engineering roles for freshers. Opportunities in React, Python, Java, Node.js, and Full-Stack.',
  },
  {
    slug: 'remote-jobs-for-freshers',
    title: 'Remote Jobs for Freshers – Work from Home Entry Roles',
    h1: 'Remote Jobs for Freshers',
    workMode: 'remote',
    description:
      'Apply to remote entry-level jobs and work-from-home positions for freshers in India across software development, data, and digital operations.',
  },
  {
    slug: 'internships',
    title: 'Internships in India – College, Tech & Remote Internships',
    h1: 'Internships & Trainee Openings in India',
    employmentType: 'internship',
    description:
      'Apply for paid software, design, marketing, and business internships across top Indian companies and fast-growing tech startups on Vcreateventures.',
  },
]

