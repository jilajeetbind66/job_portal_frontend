import { createBrowserRouter } from 'react-router-dom'
import { ROLES } from '@/constants'
import RequireRole from '@/auth/RequireRole'

import PublicLayout from '@/layouts/PublicLayout'
import CandidateLayout from '@/layouts/CandidateLayout'
import PartnerLayout from '@/layouts/PartnerLayout'
import AdminLayout from '@/layouts/AdminLayout'

import HomePage from '@/features/public/HomePage'
import JobSearchPage from '@/features/public/JobSearchPage'
import JobDetailPage from '@/features/public/JobDetailPage'
import CompanyPage from '@/features/public/CompanyPage'
import JobOrCategoryDispatcher from '@/features/public/JobOrCategoryDispatcher'
import FresherJobsPage from '@/features/public/FresherJobsPage'
import LoginPage from '@/features/public/LoginPage'
import RegisterPage from '@/features/public/RegisterPage'
import ForgotPasswordPage from '@/features/public/ForgotPasswordPage'
import ResetPasswordPage from '@/features/public/ResetPasswordPage'
import VerifyEmailNoticePage from '@/features/public/VerifyEmailNoticePage'

import JobsInIndiaPage from '@/features/public/geo/JobsInIndiaPage'
import StateJobsPage from '@/features/public/geo/StateJobsPage'
import CityJobsPage from '@/features/public/geo/CityJobsPage'
import CityCategoryJobsPage from '@/features/public/geo/CityCategoryJobsPage'
import { GeoDispatcherPage, GeoSubDispatcherPage } from '@/features/public/geo/GeoDispatcher'

import CandidateDashboardPage from '@/features/candidate/DashboardPage'
import ProfilePage from '@/features/candidate/ProfilePage'
import ApplicationsPage from '@/features/candidate/ApplicationsPage'
import SavedJobsPage from '@/features/candidate/SavedJobsPage'

import PartnerDashboardPage from '@/features/partner/DashboardPage'
import JobsPage from '@/features/partner/JobsPage'
import JobEditorPage from '@/features/partner/JobEditorPage'
import ApplicantsPage from '@/features/partner/ApplicantsPage'
import RecruitersPage from '@/features/partner/RecruitersPage'
import PartnerCompanyPage from '@/features/partner/CompanyPage'

import AdminDashboardPage from '@/features/admin/DashboardPage'
import PartnersPage from '@/features/admin/PartnersPage'
import PartnerDetailPage from '@/features/admin/PartnerDetailPage'
import PartnerFormPage from '@/features/admin/PartnerFormPage'
import ModerationPage from '@/features/admin/ModerationPage'
import JobReviewPage from '@/features/admin/JobReviewPage'
import UsersPage from '@/features/admin/UsersPage'
import AuditLogsPage from '@/features/admin/AuditLogsPage'

export const routes = [
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/jobs', element: <JobSearchPage /> },
      { path: '/jobs/:slug', element: <JobOrCategoryDispatcher /> },
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
    element: <RequireRole roles={[ROLES.CANDIDATE]} />,
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
    element: <RequireRole roles={[ROLES.PARTNER_ADMIN, ROLES.PARTNER_RECRUITER]} />,
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
          { path: 'recruiters', element: <RecruitersPage /> },
          { path: 'company', element: <PartnerCompanyPage /> },
        ],
      },
    ],
  },
  {
    path: '/admin',
    element: <RequireRole roles={[ROLES.SUPER_ADMIN]} />,
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
