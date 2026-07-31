import type { CatalogEntry } from '../../lib/catalog'
import { Logo } from '../shared/Logo'
import { cn } from '../../lib/cn'

interface CatalogSelectorProps<T extends string> {
  label: string
  options: CatalogEntry<T>[]
  selected: T | null
  onSelect: (id: T) => void
}

export function CatalogSelector<T extends string>({
  label,
  options,
  selected,
  onSelect,
}: CatalogSelectorProps<T>) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-medium text-neutral-400">{label}</h3>
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.id)}
            className={cn(
              'flex flex-col items-center gap-2 rounded-lg border-2 px-5 py-4 transition-colors',
              selected === opt.id
                ? 'border-green-400 bg-green-950/40'
                : 'border-neutral-800 hover:border-neutral-700',
            )}
          >
            <Logo
              src={opt.logoSrc}
              alt={opt.label}
              fallbackIcon={opt.fallbackIcon}
              className="h-10 w-10"
            />
            <span className="text-sm font-medium text-neutral-100">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
