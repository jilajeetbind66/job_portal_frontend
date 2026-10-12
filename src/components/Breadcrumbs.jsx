import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

/**
 * Breadcrumbs Component with JSON-LD Schema for SEO
 *
 * @param {Array<{ label: string, to?: string }>} items - Breadcrumb items list
 * @param {string} className - Optional wrapper class name
 */
export default function Breadcrumbs({ items = [], className = '' }) {
  if (!items || items.length === 0) return null

  // Generate Google Schema.org BreadcrumbList JSON-LD
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.to ? `https://vcreateventures.com${item.to}` : undefined,
    })),
  }

  return (
    <>
      {/* Inject Structured Data for Search Engine Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <nav
        aria-label="Breadcrumb"
        className={`flex items-center text-xs text-[#91A6A0] flex-wrap gap-1.5 py-3 ${className}`}
      >
        <Link
          to="/"
          className="inline-flex items-center gap-1 hover:text-[#B9D8C4] transition-colors"
          title="Vcreateventures Home"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>

        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <React.Fragment key={index}>
              <ChevronRight className="w-3 h-3 text-[#294341] shrink-0" />
              {isLast || !item.to ? (
                <span className="font-bold text-[#F7F8F5] truncate max-w-[240px]">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to}
                  className="hover:text-[#B9D8C4] transition-colors truncate max-w-[200px]"
                >
                  {item.label}
                </Link>
              )}
            </React.Fragment>
          )
        })}
      </nav>
    </>
  )
}

