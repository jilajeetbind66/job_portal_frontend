import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { ROLES } from '@/constants'
import RequireRole from '@/auth/RequireRole'

import PublicLayout from '@/layouts/PublicLayout'
import HomePage from '@/features/public/HomePage'

const CandidateLayout = lazy(() => import('@/layouts/CandidateLayout'))
const PartnerLayout = lazy(() => import('@/layouts/PartnerLayout'))
const AdminLayout = lazy(() => import('@/layouts/AdminLayout'))

const JobSearchPage = lazy(() => import('@/features/public/JobSearchPage'))
const JobDetailPage = lazy(() => import('@/features/public/JobDetailPage'))
const CompanyPage = lazy(() => import('@/features/public/CompanyPage'))
const CompaniesPage = lazy(() => import('@/features/public/CompaniesPage'))
const JobOrCategoryDispatcher = lazy(() => import('@/features/public/JobOrCategoryDispatcher'))
const FresherJobsPage = lazy(() => import('@/features/public/FresherJobsPage'))
const LoginPage = lazy(() => import('@/features/public/LoginPage'))
const RegisterPage = lazy(() => import('@/features/public/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('@/features/public/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('@/features/public/ResetPasswordPage'))
const VerifyEmailNoticePage = lazy(() => import('@/features/public/VerifyEmailNoticePage'))
const JobsInIndiaPage = lazy(() => import('@/features/public/geo/JobsInIndiaPage'))
const StateJobsPage = lazy(() => import('@/features/public/geo/StateJobsPage'))
const CityJobsPage = lazy(() => import('@/features/public/geo/CityJobsPage'))
const CityCategoryJobsPage = lazy(() => import('@/features/public/geo/CityCategoryJobsPage'))
const GeoDispatcherPage = lazy(() =>
  import('@/features/public/geo/GeoDispatcher').then((module) => ({
    default: module.GeoDispatcherPage,
  })),
)
const GeoSubDispatcherPage = lazy(() =>
  import('@/features/public/geo/GeoDispatcher').then((module) => ({
    default: module.GeoSubDispatcherPage,
  })),
)
const CandidateDashboardPage = lazy(() => import('@/features/candidate/DashboardPage'))
const ProfilePage = lazy(() => import('@/features/candidate/ProfilePage'))
const ApplicationsPage = lazy(() => import('@/features/candidate/ApplicationsPage'))
const SavedJobsPage = lazy(() => import('@/features/candidate/SavedJobsPage'))
const PartnerDashboardPage = lazy(() => import('@/features/partner/DashboardPage'))
const JobsPage = lazy(() => import('@/features/partner/JobsPage'))
const JobEditorPage = lazy(() => import('@/features/partner/JobEditorPage'))
const ApplicantsPage = lazy(() => import('@/features/partner/ApplicantsPage'))
const RecruitersPage = lazy(() => import('@/features/partner/RecruitersPage'))
const PartnerCompanyPage = lazy(() => import('@/features/partner/CompanyPage'))
const AdminDashboardPage = lazy(() => import('@/features/admin/DashboardPage'))
const PartnersPage = lazy(() => import('@/features/admin/PartnersPage'))
const PartnerDetailPage = lazy(() => import('@/features/admin/PartnerDetailPage'))
const PartnerFormPage = lazy(() => import('@/features/admin/PartnerFormPage'))
const ModerationPage = lazy(() => import('@/features/admin/ModerationPage'))
const JobReviewPage = lazy(() => import('@/features/admin/JobReviewPage'))
const UsersPage = lazy(() => import('@/features/admin/UsersPage'))
const AuditLogsPage = lazy(() => import('@/features/admin/AuditLogsPage'))

function withPageFallback(element) {
  return (
    <Suspense
      fallback={
        <div
          className="flex min-h-[40vh] items-center justify-center text-sm text-muted-text"
          role="status"
          aria-live="polite"
        >
          Loading page...
        </div>
      }
    >
      {element}
    </Suspense>
  )
}

export const routes = [
  {
    element: withPageFallback(<PublicLayout />),
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/jobs', element: <JobSearchPage /> },
      { path: '/jobs/:slug', element: <JobOrCategoryDispatcher /> },
      { path: '/companies', element: <CompaniesPage /> },
      { path: '/companies/:slug', element: <CompanyPage /> },
      { path: '/company/:slug', element: <CompanyPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
      { path: '/verify-email', element: <VerifyEmailNoticePage /> },
      // Dedicated Fresher & Internship Architecture
      { path: '/fresher-jobs', element: <FresherJobsPage /> },
      { path: '/fresher-jobs-in-prayagraj', element: <FresherJobsPage /> },
      { path: '/fresher-jobs-in-uttar-pradesh', element: <FresherJobsPage /> },
      { path: '/fresher-jobs-in-bangalore', element: <FresherJobsPage /> },
      { path: '/fresher-jobs-in-hyderabad', element: <FresherJobsPage /> },
      { path: '/software-jobs-for-freshers', element: <FresherJobsPage /> },
      { path: '/remote-jobs-for-freshers', element: <FresherJobsPage /> },
      { path: '/internships', element: <FresherJobsPage /> },
      // Geographic SEO Architecture Routes
      { path: '/jobs-in-india', element: <JobsInIndiaPage /> },
      { path: '/jobs-in-prayagraj', element: <CityJobsPage /> },
      { path: '/jobs-in-allahabad', element: <CityJobsPage /> },
      { path: '/jobs-in-prayagraj/:categorySlug', element: <CityCategoryJobsPage /> },
      { path: '/jobs-in-allahabad/:categorySlug', element: <CityCategoryJobsPage /> },
      { path: '/jobs-in-uttar-pradesh', element: <StateJobsPage /> },
      { path: '/jobs-in-uttar-pradesh/:citySlug', element: <CityJobsPage /> },
      { path: '/jobs-in-uttar-pradesh/:citySlug/:categorySlug', element: <CityCategoryJobsPage /> },
      { path: '/jobs-in-:stateSlug/:citySlug/:categorySlug', element: <CityCategoryJobsPage /> },
      { path: '/jobs-in-:geoSlug/:subSlug', element: <GeoSubDispatcherPage /> },
      { path: '/jobs-in-:geoSlug', element: <GeoDispatcherPage /> },
    ],
  },
  {
    path: '/candidate',
    element: withPageFallback(<RequireRole roles={[ROLES.CANDIDATE]} />),
    children: [
      {
        element: <CandidateLayout />,
        children: [
          { index: true, element: <CandidateDashboardPage /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'applications', element: <ApplicationsPage /> },
          { path: 'saved-jobs', element: <SavedJobsPage /> },
        ],
      },
    ],
  },
  {
    path: '/partner',
    element: withPageFallback(<RequireRole roles={[ROLES.PARTNER_ADMIN, ROLES.PARTNER_RECRUITER]} />),
    children: [
      {
        element: <PartnerLayout />,
        children: [
          { index: true, element: <PartnerDashboardPage /> },
          { path: 'jobs', element: <JobsPage /> },
          { path: 'jobs/new', element: <JobEditorPage /> },
          { path: 'jobs/:id/edit', element: <JobEditorPage /> },
          { path: 'jobs/:id/applicants', element: <ApplicantsPage /> },
          { path: 'applicants', element: <ApplicantsPage /> },
          {
            element: <RequireRole roles={[ROLES.PARTNER_ADMIN]} />,
            children: [
              { path: 'recruiters', element: <RecruitersPage /> },
              { path: 'company', element: <PartnerCompanyPage /> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/admin',
    element: withPageFallback(<RequireRole roles={[ROLES.SUPER_ADMIN]} />),
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'partners', element: <PartnersPage /> },
          { path: 'partners/new', element: <PartnerFormPage /> },
          { path: 'partners/:id', element: <PartnerDetailPage /> },
          { path: 'partners/:id/edit', element: <PartnerFormPage /> },
          { path: 'moderation', element: <ModerationPage /> },
          { path: 'moderation/:id', element: <JobReviewPage /> },
          { path: 'users', element: <UsersPage /> },
          { path: 'audit-logs', element: <AuditLogsPage /> },
        ],
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
