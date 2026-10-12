import { render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AuthProvider from '@/auth/AuthProvider'
import { ToastProvider } from '@/components'
import { routes } from '@/routes'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
}

function renderGeoRoute(path) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(
    <QueryClientProvider client={makeQueryClient()}>
      <ToastProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  )
  return router
}

describe('Geographic SEO Architecture Routes', () => {
  it('renders Jobs in India hub (/jobs-in-india)', async () => {
    renderGeoRoute('/jobs-in-india')
    expect(await screen.findByText(/All 28 States & 8 UTs/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /All 28 Indian States/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /Union Territories/i })).toBeInTheDocument()
  })

  it('renders Uttar Pradesh priority state page (/jobs-in-uttar-pradesh)', async () => {
    renderGeoRoute('/jobs-in-uttar-pradesh')
    expect(await screen.findByRole('heading', { level: 1, name: /Jobs in Uttar Pradesh/i })).toBeInTheDocument()
    expect(screen.getByText(/Explore Verified Jobs in Prayagraj/i)).toBeInTheDocument()
  })

  it('renders Prayagraj priority local SEO page (/jobs-in-prayagraj)', async () => {
    renderGeoRoute('/jobs-in-prayagraj')
    expect(await screen.findByRole('heading', { level: 1, name: /Jobs in Prayagraj/i })).toBeInTheDocument()
    expect(screen.getByText(/Major Hiring Hubs in Prayagraj/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Civil Lines' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Naini Industrial Area' })).toBeInTheDocument()
  })

  it('renders Prayagraj via historical Allahabad alias (/jobs-in-allahabad)', async () => {
    renderGeoRoute('/jobs-in-allahabad')
    expect(await screen.findByText(/Historical & Geographic Alias/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: /Jobs in Prayagraj/i })).toBeInTheDocument()
  })

  it('renders Prayagraj category page (/jobs-in-prayagraj/software-developer)', async () => {
    renderGeoRoute('/jobs-in-prayagraj/software-developer')
    expect(await screen.findByRole('heading', { level: 1, name: /Software Developer Jobs in Prayagraj/i })).toBeInTheDocument()
    expect(screen.getByText(/Hiring & Salary Insights for Software Developer in Prayagraj/i)).toBeInTheDocument()
  })

  it('renders hierarchical state-to-city page (/jobs-in-uttar-pradesh/lucknow)', async () => {
    renderGeoRoute('/jobs-in-uttar-pradesh/lucknow')
    expect(await screen.findByRole('heading', { level: 1, name: /Jobs in Lucknow/i })).toBeInTheDocument()
  })

  it('renders category SEO landing page (/jobs/software-development)', async () => {
    renderGeoRoute('/jobs/software-development')
    expect(await screen.findByRole('heading', { level: 1, name: /Software Development Jobs in India/i })).toBeInTheDocument()
    expect(screen.getByText(/Top Cities Hiring for Software Development/i)).toBeInTheDocument()
  })

  it('renders dedicated fresher jobs landing page (/fresher-jobs)', async () => {
    renderGeoRoute('/fresher-jobs')
    expect(await screen.findByRole('heading', { level: 1, name: /Fresher Jobs Across India/i })).toBeInTheDocument()
    expect(screen.getByText(/0-1 Years Experience Welcomed/i)).toBeInTheDocument()
  })

  it('renders dedicated fresher in Prayagraj landing page (/fresher-jobs-in-prayagraj)', async () => {
    renderGeoRoute('/fresher-jobs-in-prayagraj')
    expect(await screen.findByRole('heading', { level: 1, name: /Fresher Jobs in Prayagraj \(Allahabad\)/i })).toBeInTheDocument()
  })

  it('renders company profile via /company/:slug alias', async () => {
    renderGeoRoute('/company/techflow-india')
    expect(await screen.findByText(/Company/i, {}, { timeout: 4000 })).toBeInTheDocument()
  })
})

