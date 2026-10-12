import React from 'react'
import { useParams } from 'react-router-dom'
import { getRegionBySlug, STANDARD_JOB_CATEGORIES } from '@/data/geoIndia'
import StateJobsPage from './StateJobsPage'
import CityJobsPage from './CityJobsPage'
import CityCategoryJobsPage from './CityCategoryJobsPage'

/**
 * Smart Dispatcher for Single Segment Geo URLs: /jobs-in-:slug
 * Resolves whether :slug is an Indian State/UT or an Indian City
 */
export function GeoDispatcherPage() {
  const { geoSlug, stateSlug } = useParams()
  const slug = geoSlug || stateSlug || ''
  const isState = Boolean(getRegionBySlug(slug))

  if (isState) {
    return <StateJobsPage />
  }
  return <CityJobsPage />
}

/**
 * Smart Dispatcher for Two Segment Geo URLs: /jobs-in-:param1/:param2
 * Resolves whether it is /state/city or /city/category
 */
export function GeoSubDispatcherPage() {
  const { stateSlug, citySlug, categorySlug, geoSlug, subSlug } = useParams()
  const first = stateSlug || geoSlug || ''
  const second = citySlug || categorySlug || subSlug || ''

  const isFirstAState = Boolean(getRegionBySlug(first))
  const isSecondACategory = STANDARD_JOB_CATEGORIES.some((c) => c.slug === second)

  if (isFirstAState && !isSecondACategory) {
    // /jobs-in-uttar-pradesh/kanpur -> State + City
    return <CityJobsPage />
  }

  // /jobs-in-prayagraj/software-developer -> City + Category
  return <CityCategoryJobsPage />
}

