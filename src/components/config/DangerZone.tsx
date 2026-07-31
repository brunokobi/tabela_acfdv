import { Trash2 } from 'lucide-react'
import { useTournamentStore } from '../../store/tournamentStore'

export function DangerZone() {
  const resetAll = useTournamentStore((s) => s.resetAll)

  function handleClear() {
    const confirmed = window.confirm(
      'Isso vai apagar todos os dados do campeonato salvos neste navegador (equipes, grupos, placares e chaveamento). Confirma?',
    )
    if (confirmed) resetAll()
  }

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/20">
      <h3 className="mb-1 text-sm font-medium text-red-700 dark:text-red-400">Zona de perigo</h3>
      <p className="mb-3 text-sm text-red-600/80 dark:text-red-400/70">
        Apaga todos os dados salvos neste navegador (equipes, grupos, placares e chaveamento).
      </p>
      <button
        type="button"
        onClick={handleClear}
        className="flex items-center gap-2 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
      >
        <Trash2 className="h-4 w-4" /> Apagar tudo
      </button>
    </div>
  )
}
