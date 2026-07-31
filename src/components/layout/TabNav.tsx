import { Settings, Users, Network } from 'lucide-react'
import { cn } from '../../lib/cn'

export type TabId = 'config' | 'grupos' | 'mata-mata'

const TABS: { id: TabId; label: string; icon: typeof Settings }[] = [
  { id: 'config', label: 'Configuração', icon: Settings },
  { id: 'grupos', label: 'Grupos', icon: Users },
  { id: 'mata-mata', label: 'Mata-Mata', icon: Network },
]

interface TabNavProps {
  active: TabId
  onChange: (tab: TabId) => void
}

export function TabNav({ active, onChange }: TabNavProps) {
  return (
    <nav className="flex gap-1 px-6">
      {TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={cn(
            'flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors',
            active === id
              ? 'border-green-400 text-green-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-200',
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </nav>
  )
}
