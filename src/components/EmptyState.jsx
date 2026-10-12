import { Inbox } from 'lucide-react'

export default function EmptyState({ title = 'Nothing here yet', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#294341] bg-[#0D2224]/50 px-6 py-12 text-center">
      <Inbox className="mb-3 h-10 w-10 text-[#91A6A0]" aria-hidden="true" />
      <h3 className="text-base font-semibold text-[#F7F8F5]">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-[#91A6A0]">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
