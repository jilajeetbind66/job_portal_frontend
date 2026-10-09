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
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-100 z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Change Role & Access</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600">
            Update permissions for <strong className="text-slate-900">{recruiter.name}</strong> ({recruiter.email}).
          </p>

          <div className="space-y-3">
            <label
              className="flex items-start gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50 cursor-pointer has-checked:border-indigo-600 has-checked:bg-indigo-50/40"
            >
              <input
                type="radio"
                name="roleOption"
                value={ROLES.PARTNER_RECRUITER}
                checked={selectedRole === ROLES.PARTNER_RECRUITER}
                onChange={() => setSelectedRole(ROLES.PARTNER_RECRUITER)}
                className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Partner Recruiter</p>
                <p className="text-[11px] text-slate-500">
                  Can create and edit job postings, view candidates, manage applicants pipeline.
                </p>
              </div>
            </label>

            <label
              className="flex items-start gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50 cursor-pointer has-checked:border-indigo-600 has-checked:bg-indigo-50/40"
            >
              <input
                type="radio"
                name="roleOption"
                value={ROLES.PARTNER_ADMIN}
                checked={selectedRole === ROLES.PARTNER_ADMIN}
                onChange={() => setSelectedRole(ROLES.PARTNER_ADMIN)}
                className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Partner Admin</p>
                <p className="text-[11px] text-slate-500">
                  Full administrative permissions: invite/manage recruiters, edit company profile, publish jobs.
                </p>
              </div>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={mutation.isPending || selectedRole === recruiter.role}
              onClick={() => mutation.mutate(selectedRole)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-sm disabled:opacity-50"
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

