import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { X, UserPlus, Loader2, ShieldCheck, Briefcase } from 'lucide-react'
import { ROLES } from '@/constants'
import { inviteRecruiter } from '../api/recruiters'

const inviteSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  role: z.enum([ROLES.PARTNER_RECRUITER, ROLES.PARTNER_ADMIN]),
  department: z.string().min(2, 'Department is required'),
})

export default function InviteRecruiterModal({ open, onClose }) {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      name: '',
      email: '',
      role: ROLES.PARTNER_RECRUITER,
      department: 'Talent Acquisition',
    },
  })

  const inviteMutation = useMutation({
    mutationFn: (data) => inviteRecruiter(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner', 'recruiters'] })
      reset()
      onClose()
    },
  })

  if (!open) return null

  const onSubmit = (formData) => {
    inviteMutation.mutate(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-100 z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Invite Team Member</h3>
              <p className="text-xs text-slate-500">Send an invitation to join your hiring organization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {inviteMutation.isError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              {inviteMutation.error?.response?.data?.message || 'Failed to send invite. Please try again.'}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              {...register('name')}
              placeholder="e.g. Priya Sharma"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p>}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Work Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              {...register('email')}
              placeholder="priya.sharma@company.com"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>}
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Department / Team <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              {...register('department')}
              placeholder="e.g. Engineering Hiring or Talent Acquisition"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            {errors.department && <p className="mt-1 text-xs text-rose-600">{errors.department.message}</p>}
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Select Permissions Role <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className="relative flex cursor-pointer flex-col rounded-xl border border-slate-200 p-3.5 hover:bg-slate-50 transition-colors has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50/50 has-[:checked]:ring-1 has-[:checked]:ring-indigo-600"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <Briefcase className="h-4 w-4 text-indigo-600" />
                    <span>Recruiter</span>
                  </div>
                  <input
                    type="radio"
                    value={ROLES.PARTNER_RECRUITER}
                    {...register('role')}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Can create jobs, review candidates, move applicant pipeline stages.
                </p>
              </label>

              <label
                className="relative flex cursor-pointer flex-col rounded-xl border border-slate-200 p-3.5 hover:bg-slate-50 transition-colors has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50/50 has-[:checked]:ring-1 has-[:checked]:ring-indigo-600"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <ShieldCheck className="h-4 w-4 text-purple-600" />
                    <span>Partner Admin</span>
                  </div>
                  <input
                    type="radio"
                    value={ROLES.PARTNER_ADMIN}
                    {...register('role')}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Full permissions: manage recruiters, update company profile, publish jobs.
                </p>
              </label>
            </div>
            {errors.role && <p className="mt-1 text-xs text-rose-600">{errors.role.message}</p>}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={inviteMutation.isPending}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={inviteMutation.isPending}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-sm transition-colors disabled:opacity-50"
            >
              {inviteMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Send Invitation
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

