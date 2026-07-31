import type { CatalogEntry } from '../../lib/catalog'
import { Logo } from '../shared/Logo'
import { cn } from '../../lib/cn'

interface CatalogSelectorProps<T extends string> {
  options: CatalogEntry<T>[]
  selected: T | null
  onSelect: (id: T) => void
}

export function CatalogSelector<T extends string>({
  options,
  selected,
  onSelect,
}: CatalogSelectorProps<T>) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onSelect(opt.id)}
          className={cn(
            'flex flex-1 items-center gap-2 rounded-lg border px-3 py-2 transition-colors',
            selected === opt.id
              ? 'border-green-500 bg-green-950/30'
              : 'border-neutral-800 hover:border-neutral-700',
          )}
        >
          <Logo
            src={opt.logoSrc}
            alt={opt.label}
            fallbackIcon={opt.fallbackIcon}
            className="h-6 w-6 flex-shrink-0"
          />
          <span className="truncate text-sm font-medium text-neutral-100">{opt.label}</span>
        </button>
      ))}
    </div>
  )
}
