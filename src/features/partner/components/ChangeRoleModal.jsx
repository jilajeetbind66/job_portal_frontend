import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { X, ShieldCheck, Loader2 } from 'lucide-react'
import { ROLES } from '@/constants'
import { updateRecruiterRole } from '../api/recruiters'

export default function ChangeRoleModal({ recruiter, open, onClose }) {
  const queryClient = useQueryClient()
  const [selectedRole, setSelectedRole] = useState(recruiter?.role || ROLES.PARTNER_RECRUITER)

  const mutation = useMutation({
    mutationFn: (newRole) => updateRecruiterRole(recruiter.id, newRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner', 'recruiters'] })
      onClose()
    },
  })

  if (!open || !recruiter) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#07151A]/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md rounded-2xl bg-[#0D2224] shadow-2xl overflow-hidden border border-[#294341] z-10 text-[#F7F8F5]">
        <div className="flex items-center justify-between border-b border-[#294341] px-6 py-4 bg-[#102A2B]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#D6A84F]" />
            <h3 className="text-base font-bold text-[#F7F8F5]">Change Role & Access</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#91A6A0] hover:bg-[#153536] hover:text-[#F7F8F5] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-[#91A6A0]">
            Update permissions for <strong className="text-[#F7F8F5]">{recruiter.name}</strong> ({recruiter.email}).
          </p>

          <div className="space-y-3">
            <label
              className="flex items-start gap-3 rounded-xl border border-[#294341] bg-[#102A2B] p-3 hover:bg-[#153536] cursor-pointer has-checked:border-[#2F7D5B] has-checked:bg-[#2F7D5B]/10 transition-colors"
            >
              <input
                type="radio"
                name="roleOption"
                value={ROLES.PARTNER_RECRUITER}
                checked={selectedRole === ROLES.PARTNER_RECRUITER}
                onChange={() => setSelectedRole(ROLES.PARTNER_RECRUITER)}
                className="mt-0.5 text-[#2F7D5B] focus:ring-[#2F7D5B]"
              />
              <div>
                <p className="text-xs font-bold text-[#F7F8F5]">Partner Recruiter</p>
                <p className="text-[11px] text-[#91A6A0]">
                  Can create and edit job postings, view candidates, manage applicants pipeline.
                </p>
              </div>
            </label>

            <label
              className="flex items-start gap-3 rounded-xl border border-[#294341] bg-[#102A2B] p-3 hover:bg-[#153536] cursor-pointer has-checked:border-[#D6A84F] has-checked:bg-[#D6A84F]/10 transition-colors"
            >
              <input
                type="radio"
                name="roleOption"
                value={ROLES.PARTNER_ADMIN}
                checked={selectedRole === ROLES.PARTNER_ADMIN}
                onChange={() => setSelectedRole(ROLES.PARTNER_ADMIN)}
                className="mt-0.5 text-[#D6A84F] focus:ring-[#D6A84F]"
              />
              <div>
                <p className="text-xs font-bold text-[#F7F8F5]">Partner Admin</p>
                <p className="text-[11px] text-[#91A6A0]">
                  Full administrative permissions: invite/manage recruiters, edit company profile, publish jobs.
                </p>
              </div>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#294341]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#294341] bg-[#102A2B] px-4 py-2 text-xs font-semibold text-[#91A6A0] hover:text-[#F7F8F5] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={mutation.isPending || selectedRole === recruiter.role}
              onClick={() => mutation.mutate(selectedRole)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#2F7D5B] px-4 py-2 text-xs font-semibold text-[#F7F8F5] hover:bg-[#25684a] shadow-lg shadow-[#2F7D5B]/20 disabled:opacity-50 transition-all"
            >
              {mutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Save Role
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
