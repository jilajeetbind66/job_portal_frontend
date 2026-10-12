/**
 * Automated Sitemap Generator Script for Vcreateventures
 * Run at build/deployment or via automated cron to regenerate dynamic XML sitemaps
 * using active verified jobs and company profiles.
 *
 * Usage: node scripts/generate-sitemaps.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = path.resolve(__dirname, '..')
const PUBLIC_DIR = path.join(ROOT_DIR, 'public')
const SITEMAPS_DIR = path.join(PUBLIC_DIR, 'sitemaps')

const DOMAIN = 'https://vcreateventures.com'

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function generateIndexSitemap() {
  const now = new Date().toISOString()
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${DOMAIN}/sitemaps/categories.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemaps/locations.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemaps/jobs.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemaps/companies.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>
`
}

export function runGenerator() {
  ensureDir(SITEMAPS_DIR)
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), generateIndexSitemap(), 'utf-8')
  console.log('✓ Dynamic sitemap index regenerated successfully.')
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runGenerator()
}

