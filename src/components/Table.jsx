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
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className="px-4 py-3 text-left font-medium text-gray-600"
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-gray-500">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" aria-label="Loading" />
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row[rowKey]}>
                  {columns.map((c) => (
                    <td key={c.key} className={c.className ?? 'px-4 py-3 text-gray-800'}>
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
        <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
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
