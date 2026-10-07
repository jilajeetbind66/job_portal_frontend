import Button from './Button'

// Filters ka container. Andar Input/Select daalo, onReset se saare filters clear karo.
export default function FiltersBar({ children, onReset }) {
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 bg-white p-3">
      {children}
      {onReset && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset
        </Button>
      )}
    </div>
  )
}
