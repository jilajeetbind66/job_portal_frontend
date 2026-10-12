import Button from './Button'

// Filters ka container. Andar Input/Select daalo, onReset se saare filters clear karo.
export default function FiltersBar({ children, onReset }) {
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-[#294341] bg-[#0D2224] p-3.5">
      {children}
      {onReset && (
        <Button variant="ghost" size="sm" onClick={onReset} className="text-[#91A6A0] hover:text-[#F7F8F5]">
          Reset
        </Button>
      )}
    </div>
  )
}
