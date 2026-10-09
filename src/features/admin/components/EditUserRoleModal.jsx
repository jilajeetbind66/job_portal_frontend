import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { X, Shield, ShieldCheck, Briefcase, User, Loader2, AlertTriangle } from 'lucide-react'
import { clsx } from 'clsx'
import { ROLES } from '@/constants'
import { updateUserRole } from '../api/users'

export default function EditUserRoleModal({ user, open, onClose }) {
  const queryClient = useQueryClient()
  const [selectedRole, setSelectedRole] = useState(user?.role || ROLES.CANDIDATE)

  useEffect(() => {
    if (user) {
      setSelectedRole(user.role)
    }
  }, [user])

  const mutation = useMutation({
    mutationFn: (newRole) => updateUserRole(user.id, newRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'user', user?.id] })
      onClose()
    },
  })

  if (!open || !user) return null

  const roleOptions = [
    {
      id: ROLES.CANDIDATE,
      label: 'Candidate / Job Seeker',
      desc: 'Can search and apply to jobs, manage profile, track applications.',
      icon: User,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      id: ROLES.PARTNER_RECRUITER,
      label: 'Partner Recruiter',
      desc: 'Can create and edit job postings, evaluate applicants for their organization.',
      icon: Briefcase,
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      id: ROLES.PARTNER_ADMIN,
      label: 'Partner Administrator',
      desc: 'Full company administrator: manage recruiters team, edit company profile, publish jobs.',
      icon: ShieldCheck,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      id: ROLES.SUPER_ADMIN,
      label: 'Platform Super Admin',
      desc: 'Full platform-wide administrative privileges: moderate jobs, manage partners, view analytics.',
      icon: Shield,
      color: 'text-rose-600 bg-rose-50',
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden border border-slate-100 z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Modify Platform Role</h3>
              <p className="text-xs text-slate-500">Assign system permissions level</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600">
            Updating role for <strong className="text-slate-900">{user.name}</strong> ({user.email}).
          </p>

          {user.is_protected ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <span>
                This account is a protected root administrator and its platform permissions role cannot be changed.
              </span>
            </div>
          ) : (
            <div className="space-y-2.5">
              {roleOptions.map((opt) => {
                const Icon = opt.icon
                const isSelected = selectedRole === opt.id

                return (
                  <label
                    key={opt.id}
                    className={clsx(
                      'flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer transition-all',
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600'
                        : 'border-slate-200 hover:bg-slate-50'
                    )}
                  >
                    <input
                      type="radio"
                      name="roleOption"
                      value={opt.id}
                      checked={isSelected}
                      onChange={() => setSelectedRole(opt.id)}
                      className="mt-1 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={clsx('flex h-5 w-5 items-center justify-center rounded-md', opt.color)}>
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-xs font-bold text-slate-900">{opt.label}</span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-500 leading-normal">{opt.desc}</p>
                    </div>
                  </label>
                )
              })}
            </div>
          )}

          {/* Warning notice when changing to/from Partner role */}
          {selectedRole !== user.role && (selectedRole === ROLES.CANDIDATE || user.role === ROLES.CANDIDATE) && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              Note: Changing between Candidate and Partner staff will adjust tenant affiliation.
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={mutation.isPending}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={mutation.isPending || selectedRole === user.role || user.is_protected}
              onClick={() => mutation.mutate(selectedRole)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-sm transition-colors disabled:opacity-50"
            >
              {mutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Save Role Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

