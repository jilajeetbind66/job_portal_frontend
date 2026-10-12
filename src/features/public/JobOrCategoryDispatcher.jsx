import React from 'react'
import { useParams } from 'react-router-dom'
import { CATEGORY_SLUGS } from '@/data/categories'
import CategoryJobsPage from './CategoryJobsPage'
import JobDetailPage from './JobDetailPage'

/**
 * Smart Dispatcher for /jobs/:slug
 * Seamlessly routes Category SEO Landing Pages vs Individual Job Detail Pages
 */
export default function JobOrCategoryDispatcher() {
  const { slug } = useParams()
  const isCategory = CATEGORY_SLUGS.includes(slug?.toLowerCase()?.trim())

  if (isCategory) {
    return <CategoryJobsPage />
  }

  return <JobDetailPage />
}

