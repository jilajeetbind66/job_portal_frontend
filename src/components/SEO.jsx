import React, { useEffect } from 'react'
import {
  SITE_CONFIG,
  getCanonicalUrl,
  formatSeoTitle,
  formatMetaDescription,
} from '@/utils/seo'

/**
 * Helper to update or create a meta tag by property or name
 */
function setMetaTag(attrName, attrValue, content) {
  if (!content) return
  let tag = document.querySelector(`meta[${attrName}="${attrValue}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attrName, attrValue)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

/**
 * Helper to update or create a canonical link tag
 */
function setCanonicalTag(url) {
  if (!url) return
  let link = document.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', url)
}

/**
 * Reusable Production SEO Component for Vcreateventures
 * Supports title, description, canonical, robots, Open Graph, Twitter cards, and JSON-LD structured data.
 *
 * @param {object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Meta description
 * @param {string} props.canonical - Canonical URL or path
 * @param {string} props.robots - Robots indexing directive (default: 'index, follow')
 * @param {string} props.ogType - Open Graph type (default: 'website')
 * @param {string} props.ogImage - Open Graph image URL
 * @param {object|Array} props.schema - Schema.org JSON-LD structured data object or array
 */
export default function SEO({
  title,
  description,
  canonical,
  robots = 'index, follow',
  ogType = 'website',
  ogImage,
  schema = null,
}) {
  const fullTitle = formatSeoTitle(title)
  const fullDescription = formatMetaDescription(description)
  const canonicalUrl = getCanonicalUrl(canonical || window?.location?.pathname || '/')
  const image = ogImage || SITE_CONFIG.defaultOgImage

  // DOM Synchronizer for client-side navigation
  useEffect(() => {
    // Document Title
    document.title = fullTitle

    // Core SEO Meta
    setMetaTag('name', 'description', fullDescription)
    setMetaTag('name', 'robots', robots)
    setCanonicalTag(canonicalUrl)

    // Open Graph
    setMetaTag('property', 'og:title', fullTitle)
    setMetaTag('property', 'og:description', fullDescription)
    setMetaTag('property', 'og:url', canonicalUrl)
    setMetaTag('property', 'og:type', ogType)
    setMetaTag('property', 'og:image', image)
    setMetaTag('property', 'og:site_name', SITE_CONFIG.name)
    setMetaTag('property', 'og:locale', SITE_CONFIG.locale)

    // Twitter / X Cards
    setMetaTag('name', 'twitter:card', 'summary_large_image')
    setMetaTag('name', 'twitter:title', fullTitle)
    setMetaTag('name', 'twitter:description', fullDescription)
    setMetaTag('name', 'twitter:image', image)
    setMetaTag('name', 'twitter:site', SITE_CONFIG.twitterHandle)
  }, [fullTitle, fullDescription, canonicalUrl, robots, ogType, image])

  // Normalize schemas to array
  const schemaList = schema
    ? Array.isArray(schema)
      ? schema.filter(Boolean)
      : [schema]
    : []

  return (
    <>
      {/* React 19 Native Document Metadata Hoisting */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SITE_CONFIG.name} />
      <meta property="og:locale" content={SITE_CONFIG.locale} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Structured Data Injection */}
      {schemaList.map((s, idx) => (
        <script
          key={`schema-${idx}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
    </>
  )
}

