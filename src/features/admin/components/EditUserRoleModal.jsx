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
      color: 'text-[#8FAF9A] bg-[#102A2B] border-[#294341]',
    },
    {
      id: ROLES.PARTNER_RECRUITER,
      label: 'Partner Recruiter',
      desc: 'Can create and edit job postings, evaluate applicants for their organization.',
      icon: Briefcase,
      color: 'text-[#B9D8C4] bg-[#2F7D5B]/20 border-[#2F7D5B]/30',
    },
    {
      id: ROLES.PARTNER_ADMIN,
      label: 'Partner Administrator',
      desc: 'Full company administrator: manage recruiters team, edit company profile, publish jobs.',
      icon: ShieldCheck,
      color: 'text-[#E5B866] bg-[#D6A84F]/15 border-[#D6A84F]/30',
    },
    {
      id: ROLES.SUPER_ADMIN,
      label: 'Platform Super Admin',
      desc: 'Full platform-wide administrative privileges: moderate jobs, manage partners, view analytics.',
      icon: Shield,
      color: 'text-rose-400 bg-rose-950/40 border-rose-800/40',
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#07151A]/85 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0D2224] border border-[#294341] shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#294341] px-6 py-4 bg-[#102A2B]/40">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2F7D5B]/20 border border-[#2F7D5B]/30 text-[#B9D8C4]">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F7F8F5]">Modify Platform Role</h3>
              <p className="text-xs text-[#91A6A0]">Assign system permissions level</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-[#91A6A0] hover:bg-[#102A2B] hover:text-[#F7F8F5] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-[#91A6A0]">
            Updating role for <strong className="text-[#F7F8F5]">{user.name}</strong> ({user.email}).
          </p>

          {user.is_protected ? (
            <div className="rounded-xl border border-[#D6A84F]/30 bg-[#D6A84F]/10 p-4 text-xs text-[#E5B866] flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-[#D6A84F] mt-0.5" />
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
                        ? 'border-[#2F7D5B] bg-[#102A2B] shadow-inner ring-1 ring-[#2F7D5B]'
                        : 'border-[#294341] bg-[#0D2224] hover:bg-[#102A2B]/60'
                    )}
                  >
                    <input
                      type="radio"
                      name="roleOption"
                      value={opt.id}
                      checked={isSelected}
                      onChange={() => setSelectedRole(opt.id)}
                      className="mt-1 text-[#2F7D5B] focus:ring-[#2F7D5B] bg-[#102A2B] border-[#294341]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={clsx('flex h-5 w-5 items-center justify-center rounded-md border', opt.color)}>
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-xs font-bold text-[#F7F8F5]">{opt.label}</span>
                      </div>
                      <p className="mt-1 text-[11px] text-[#91A6A0] leading-normal">{opt.desc}</p>
                    </div>
                  </label>
                )
              })}
            </div>
          )}

          {/* Warning notice when changing to/from Partner role */}
          {selectedRole !== user.role && (selectedRole === ROLES.CANDIDATE || user.role === ROLES.CANDIDATE) && (
            <div className="rounded-xl border border-[#294341] bg-[#102A2B] p-3 text-xs text-[#8FAF9A]">
              Note: Changing between Candidate and Partner staff will adjust tenant affiliation.
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#294341]">
            <button
              type="button"
              onClick={onClose}
              disabled={mutation.isPending}
              className="rounded-xl border border-[#294341] bg-[#102A2B] px-4 py-2 text-xs font-semibold text-[#8FAF9A] hover:bg-[#153536] hover:text-[#F7F8F5] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={mutation.isPending || selectedRole === user.role || user.is_protected}
              onClick={() => mutation.mutate(selectedRole)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#2F7D5B] hover:bg-[#246347] border border-[#2F7D5B]/50 px-4 py-2 text-xs font-semibold text-white shadow-md transition-colors disabled:opacity-50"
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
