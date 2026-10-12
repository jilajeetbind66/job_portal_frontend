import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import Button from './Button'
import EmptyState from './EmptyState'

// columns: [{ key, header, render?: (row) => node, className? }]
// pagination: { page, perPage, total, onPageChange }
export default function Table({
  columns,
  rows = [],
  rowKey = 'id',
  loading = false,
  emptyTitle,
  emptyDescription,
  pagination,
}) {
  if (!loading && rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  const totalPages = pagination ? Math.max(1, Math.ceil(pagination.total / pagination.perPage)) : 1

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-[#294341] bg-[#0D2224]">
        <table className="min-w-full divide-y divide-[#294341] text-sm">
          <thead className="bg-[#102A2B]">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[#91A6A0]"
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#294341]/60 bg-[#0D2224]">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-[#91A6A0]">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#2F7D5B]" aria-label="Loading" />
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row[rowKey]} className="hover:bg-[#153536]/60 transition-colors">
                  {columns.map((c) => (
                    <td key={c.key} className={c.className ?? 'px-4 py-3.5 text-[#F7F8F5]'}>
                      {c.render ? c.render(row) : row[c.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="mt-4 flex items-center justify-between text-sm text-[#91A6A0]">
          <span>
            Page {pagination.page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={pagination.page >= totalPages}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
