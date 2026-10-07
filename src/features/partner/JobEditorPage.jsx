import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  Save,
  Send,
  AlertTriangle,
  Loader2,
  Briefcase,
  DollarSign,
  FileText,
  Calendar,
} from 'lucide-react'
import { clsx } from 'clsx'
import { JOB_STATUS } from '@/constants'
import {
  fetchPartnerJob,
  createPartnerJob,
  updatePartnerJob,
} from './api/jobs'
import JobStatusBadge from './components/JobStatusBadge'

const jobSchema = z.object({
  title: z.string().min(3, 'Job title must be at least 3 characters').max(100, 'Title is too long'),
  department: z.string().min(2, 'Department is required'),
  employment_type: z.enum(['full_time', 'part_time', 'contract', 'internship']),
  workplace_type: z.enum(['remote', 'on_site', 'hybrid']),
  location: z.string().min(2, 'Location is required (e.g. Bangalore or Remote)'),
  salary_min: z.coerce.number().min(0, 'Minimum salary must be 0 or higher'),
  salary_max: z.coerce.number().min(0, 'Maximum salary must be 0 or higher'),
  currency: z.string().default('INR'),
  experience_level: z.enum(['entry', 'mid', 'senior', 'lead', 'executive']),
  description: z.string().min(20, 'Please write at least 20 characters for the job description'),
  requirements: z.string().min(10, 'Please provide key requirements/qualifications'),
  skills: z.string().min(2, 'Add at least one skill or tag (comma-separated)'),
  deadline: z.string().optional(),
})

export default function JobEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const isEditMode = Boolean(id)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      department: 'Engineering',
      employment_type: 'full_time',
      workplace_type: 'hybrid',
      location: '',
      salary_min: 600000,
      salary_max: 1200000,
      currency: 'INR',
      experience_level: 'mid',
      description: '',
      requirements: '',
      skills: '',
      deadline: '',
    },
  })

  // Fetch job in edit mode
  const { data: jobResponse, isLoading: isFetching } = useQuery({
    queryKey: ['partner', 'jobs', id],
    queryFn: () => fetchPartnerJob(id),
    enabled: isEditMode,
  })

  const job = jobResponse?.data

  useEffect(() => {
    if (isEditMode && job) {
      reset({
        title: job.title || '',
        department: job.department || 'Engineering',
        employment_type: job.employment_type || 'full_time',
        workplace_type: job.workplace_type || 'hybrid',
        location: job.location || '',
        salary_min: job.salary_min || 0,
        salary_max: job.salary_max || 0,
        currency: job.currency || 'INR',
        experience_level: job.experience_level || 'mid',
        description: job.description || '',
        requirements: job.requirements || '',
        skills: Array.isArray(job.skills) ? job.skills.join(', ') : job.skills || '',
        deadline: job.deadline ? job.deadline.split('T')[0] : '',
      })
    }
  }, [isEditMode, job, reset])

  // Save Mutation
  const saveMutation = useMutation({
    mutationFn: ({ payload, targetStatus }) => {
      const formattedSkills = payload.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      const body = {
        ...payload,
        skills: formattedSkills,
        status: targetStatus,
      }

      if (isEditMode) {
        return updatePartnerJob(id, body)
      }
      return createPartnerJob(body)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner', 'jobs'] })
      navigate('/partner/jobs')
    },
  })

  const onSubmit = (formData, targetStatus) => {
    saveMutation.mutate({ payload: formData, targetStatus })
  }

  const isSaving = saveMutation.isPending

  if (isEditMode && isFetching) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 animate-pulse">
        <div className="h-6 w-36 bg-slate-200 rounded" />
        <div className="h-96 rounded-2xl bg-white border border-slate-200 p-6" />
      </div>
    )
  }

  const isRejected = job?.status === JOB_STATUS.REJECTED

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      {/* Top Breadcrumb & Header */}
      <div>
        <Link
          to="/partner/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Jobs
        </Link>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {isEditMode ? 'Edit Job Posting' : 'Create New Job Posting'}
            </h1>
            {job?.status && <JobStatusBadge status={job.status} />}
          </div>
        </div>
      </div>

      {/* Reviewer Feedback Banner (If Rejected) */}
      {isRejected && job?.rejection_reason && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/90 p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-900">
                Action Required: Job Rejected by Moderation Team
              </h3>
              <p className="mt-1 text-sm text-rose-800 leading-relaxed">
                {job.rejection_reason}
              </p>
              <p className="mt-2 text-xs font-medium text-rose-700">
                Please revise the details below and click <strong>"Submit for Review"</strong> to send it back to the moderation queue.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Form */}
      <form className="space-y-6">
        {/* SECTION 1: Basic Information */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-slate-900">
            <Briefcase className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-semibold">1. Basic Position Details</h2>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700">
                Job Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                {...register('title')}
                placeholder="e.g. Senior Full Stack Engineer"
                className="mt-1.5 block w-full rounded-xl border border-slate-300 p-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              {errors.title && <p className="mt-1 text-xs text-rose-600">{errors.title.message}</p>}
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Department / Category <span className="text-rose-500">*</span>
              </label>
              <select
                {...register('department')}
                className="mt-1.5 block w-full rounded-xl border border-slate-300 p-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
              >
                <option value="Engineering">Engineering</option>
                <option value="Product">Product</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Finance">Finance</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Operations">Operations</option>
              </select>
              {errors.department && <p className="mt-1 text-xs text-rose-600">{errors.department.message}</p>}
            </div>

            {/* Employment Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Employment Type <span className="text-rose-500">*</span>
              </label>
              <select
                {...register('employment_type')}
                className="mt-1.5 block w-full rounded-xl border border-slate-300 p-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
              >
                <option value="full_time">Full-time</option>
                <option value="part_time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            {/* Workplace Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Workplace Policy <span className="text-rose-500">*</span>
              </label>
              <select
                {...register('workplace_type')}
                className="mt-1.5 block w-full rounded-xl border border-slate-300 p-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
              >
                <option value="remote">Remote (Work from Anywhere)</option>
                <option value="hybrid">Hybrid</option>
                <option value="on_site">On-site / In Office</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Location <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                {...register('location')}
                placeholder="e.g. Bangalore, India or Remote"
                className="mt-1.5 block w-full rounded-xl border border-slate-300 p-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              {errors.location && <p className="mt-1 text-xs text-rose-600">{errors.location.message}</p>}
            </div>
          </div>
        </div>

        {/* SECTION 2: Compensation & Experience */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-slate-900">
            <DollarSign className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-semibold">2. Compensation & Seniority</h2>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {/* Currency */}
            <div>
              <label className="block text-sm font-medium text-slate-700">Currency</label>
              <select
                {...register('currency')}
                className="mt-1.5 block w-full rounded-xl border border-slate-300 p-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>

            {/* Min Salary */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Annual Minimum <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="50000"
                {...register('salary_min')}
                className="mt-1.5 block w-full rounded-xl border border-slate-300 p-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              {errors.salary_min && <p className="mt-1 text-xs text-rose-600">{errors.salary_min.message}</p>}
            </div>

            {/* Max Salary */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Annual Maximum <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="50000"
                {...register('salary_max')}
                className="mt-1.5 block w-full rounded-xl border border-slate-300 p-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              {errors.salary_max && <p className="mt-1 text-xs text-rose-600">{errors.salary_max.message}</p>}
            </div>

            {/* Experience Level */}
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-slate-700">
                Experience Level <span className="text-rose-500">*</span>
              </label>
              <select
                {...register('experience_level')}
                className="mt-1.5 block w-full rounded-xl border border-slate-300 p-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white sm:w-1/2"
              >
                <option value="entry">Entry Level (0 - 2 years)</option>
                <option value="mid">Mid Level (2 - 5 years)</option>
                <option value="senior">Senior (5 - 8 years)</option>
                <option value="lead">Lead / Staff (8+ years)</option>
                <option value="executive">Director / Executive</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 3: Description & Requirements */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-slate-900">
            <FileText className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-semibold">3. Role Description & Key Skills</h2>
          </div>

          <div className="mt-5 space-y-5">
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Job Overview & Responsibilities <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={5}
                {...register('description')}
                placeholder="Describe the mission of this role, day-to-day duties, and team context..."
                className="mt-1.5 block w-full rounded-xl border border-slate-300 p-3 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              {errors.description && <p className="mt-1 text-xs text-rose-600">{errors.description.message}</p>}
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Qualifications & Requirements <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                {...register('requirements')}
                placeholder="- 4+ years of hands-on experience with...&#10;- Bachelor's degree in Computer Science or equivalent..."
                className="mt-1.5 block w-full rounded-xl border border-slate-300 p-3 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              {errors.requirements && <p className="mt-1 text-xs text-rose-600">{errors.requirements.message}</p>}
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Key Skills / Keywords <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                {...register('skills')}
                placeholder="e.g. React, TypeScript, Node.js, AWS, PostgreSQL (comma-separated)"
                className="mt-1.5 block w-full rounded-xl border border-slate-300 p-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <p className="mt-1 text-xs text-slate-500">Separate multiple skills with commas.</p>
              {errors.skills && <p className="mt-1 text-xs text-rose-600">{errors.skills.message}</p>}
            </div>
          </div>
        </div>

        {/* SECTION 4: Application Timeline */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-slate-900">
            <Calendar className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-semibold">4. Application Timeline</h2>
          </div>

          <div className="mt-5 max-w-xs">
            <label className="block text-sm font-medium text-slate-700">Application Deadline</label>
            <input
              type="date"
              {...register('deadline')}
              className="mt-1.5 block w-full rounded-xl border border-slate-300 p-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="flex flex-col-reverse gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={() => navigate('/partner/jobs')}
            disabled={isSaving}
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSubmit((data) => onSubmit(data, JOB_STATUS.DRAFT))}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin text-slate-500" />}
            <Save className="h-4 w-4" />
            Save as Draft
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSubmit((data) => onSubmit(data, JOB_STATUS.PENDING_REVIEW))}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            <Send className="h-4 w-4" />
            Submit for Review
          </button>
        </div>
      </form>
    </div>
  )
}
