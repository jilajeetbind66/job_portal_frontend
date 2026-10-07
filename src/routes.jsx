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
import LoginPage from '@/features/public/LoginPage'
import RegisterPage from '@/features/public/RegisterPage'

import CandidateDashboardPage from '@/features/candidate/DashboardPage'
import ProfilePage from '@/features/candidate/ProfilePage'
import ApplicationsPage from '@/features/candidate/ApplicationsPage'
import SavedJobsPage from '@/features/candidate/SavedJobsPage'

import PartnerDashboardPage from '@/features/partner/DashboardPage'
import JobsPage from '@/features/partner/JobsPage'
import JobEditorPage from '@/features/partner/JobEditorPage'
import ApplicantsPage from '@/features/partner/ApplicantsPage'
import RecruitersPage from '@/features/partner/RecruitersPage'

import AdminDashboardPage from '@/features/admin/DashboardPage'
import PartnersPage from '@/features/admin/PartnersPage'
import ModerationPage from '@/features/admin/ModerationPage'
import UsersPage from '@/features/admin/UsersPage'
import AuditLogsPage from '@/features/admin/AuditLogsPage'

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/jobs', element: <JobSearchPage /> },
      { path: '/jobs/:slug', element: <JobDetailPage /> },
      { path: '/companies/:slug', element: <CompanyPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
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
          { path: 'recruiters', element: <RecruitersPage /> },
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
          { path: 'moderation', element: <ModerationPage /> },
          { path: 'users', element: <UsersPage /> },
          { path: 'audit-logs', element: <AuditLogsPage /> },
        ],
      },
    ],
  },
])
