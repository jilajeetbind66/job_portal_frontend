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
        className="fixed inset-0 bg-[#07151A]/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0D2224] shadow-2xl overflow-hidden border border-[#294341] z-10 text-[#F7F8F5]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#294341] px-6 py-4 bg-[#102A2B]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2F7D5B]/20 border border-[#2F7D5B]/30 text-[#B9D8C4]">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F7F8F5]">Invite Team Member</h3>
              <p className="text-xs text-[#91A6A0]">Send an invitation to join your hiring organization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#91A6A0] hover:bg-[#153536] hover:text-[#F7F8F5] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {inviteMutation.isError && (
            <div className="rounded-xl border border-rose-900/50 bg-rose-950/40 p-3 text-xs text-rose-300">
              {inviteMutation.error?.response?.data?.message || 'Failed to send invite. Please try again.'}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#91A6A0] mb-1">
              Full Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              {...register('name')}
              placeholder="e.g. Priya Sharma"
              className="w-full rounded-xl border border-[#294341] bg-[#102A2B] px-3.5 py-2 text-sm text-[#F7F8F5] placeholder:text-[#91A6A0]/50 focus:border-[#2F7D5B] focus:outline-none focus:ring-1 focus:ring-[#2F7D5B]"
            />
            {errors.name && <p className="mt-1 text-xs text-rose-400">{errors.name.message}</p>}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#91A6A0] mb-1">
              Work Email Address <span className="text-rose-400">*</span>
            </label>
            <input
              type="email"
              {...register('email')}
              placeholder="priya.sharma@company.com"
              className="w-full rounded-xl border border-[#294341] bg-[#102A2B] px-3.5 py-2 text-sm text-[#F7F8F5] placeholder:text-[#91A6A0]/50 focus:border-[#2F7D5B] focus:outline-none focus:ring-1 focus:ring-[#2F7D5B]"
            />
            {errors.email && <p className="mt-1 text-xs text-rose-400">{errors.email.message}</p>}
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#91A6A0] mb-1">
              Department / Team <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              {...register('department')}
              placeholder="e.g. Engineering Hiring or Talent Acquisition"
              className="w-full rounded-xl border border-[#294341] bg-[#102A2B] px-3.5 py-2 text-sm text-[#F7F8F5] placeholder:text-[#91A6A0]/50 focus:border-[#2F7D5B] focus:outline-none focus:ring-1 focus:ring-[#2F7D5B]"
            />
            {errors.department && <p className="mt-1 text-xs text-rose-400">{errors.department.message}</p>}
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#91A6A0] mb-2">
              Select Permissions Role <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className="relative flex cursor-pointer flex-col rounded-xl border border-[#294341] bg-[#102A2B] p-3.5 hover:bg-[#153536] transition-colors has-checked:border-[#2F7D5B] has-checked:bg-[#2F7D5B]/10"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#F7F8F5]">
                    <Briefcase className="h-4 w-4 text-[#2F7D5B]" />
                    <span>Recruiter</span>
                  </div>
                  <input
                    type="radio"
                    value={ROLES.PARTNER_RECRUITER}
                    {...register('role')}
                    className="text-[#2F7D5B] focus:ring-[#2F7D5B]"
                  />
                </div>
                <p className="text-[11px] text-[#91A6A0] leading-tight">
                  Can create jobs, review candidates, move applicant pipeline stages.
                </p>
              </label>

              <label
                className="relative flex cursor-pointer flex-col rounded-xl border border-[#294341] bg-[#102A2B] p-3.5 hover:bg-[#153536] transition-colors has-checked:border-[#D6A84F] has-checked:bg-[#D6A84F]/10"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-[#F7F8F5]">
                    <ShieldCheck className="h-4 w-4 text-[#D6A84F]" />
                    <span>Partner Admin</span>
                  </div>
                  <input
                    type="radio"
                    value={ROLES.PARTNER_ADMIN}
                    {...register('role')}
                    className="text-[#D6A84F] focus:ring-[#D6A84F]"
                  />
                </div>
                <p className="text-[11px] text-[#91A6A0] leading-tight">
                  Full permissions: manage recruiters, update company profile, publish jobs.
                </p>
              </label>
            </div>
            {errors.role && <p className="mt-1 text-xs text-rose-400">{errors.role.message}</p>}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#294341]">
            <button
              type="button"
              onClick={onClose}
              disabled={inviteMutation.isPending}
              className="rounded-xl border border-[#294341] bg-[#102A2B] px-4 py-2 text-xs font-semibold text-[#91A6A0] hover:text-[#F7F8F5] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={inviteMutation.isPending}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#2F7D5B] px-4 py-2 text-xs font-semibold text-[#F7F8F5] hover:bg-[#25684a] shadow-lg shadow-[#2F7D5B]/20 transition-all disabled:opacity-50"
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
