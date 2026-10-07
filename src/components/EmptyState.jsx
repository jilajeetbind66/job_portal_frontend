import { Inbox } from 'lucide-react'

export default function EmptyState({ title = 'Nothing here yet', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 px-6 py-12 text-center">
      <Inbox className="mb-3 h-10 w-10 text-gray-400" aria-hidden="true" />
      <h3 className="text-base font-medium text-gray-900">{title}</h3>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
