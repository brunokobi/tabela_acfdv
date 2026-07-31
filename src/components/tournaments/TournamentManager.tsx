import { useState } from 'react'
import { FolderOpen, Plus, Trash2, ExternalLink, X } from 'lucide-react'
import { cn } from '../../lib/cn'
import {
  listTournaments,
  createTournamentId,
  removeTournament,
  tournamentUrl,
} from '../../lib/tournamentRegistry'

const activeId = new URLSearchParams(window.location.search).get('t')

interface TournamentManagerProps {
  onClose: () => void
}

export function TournamentManager({ onClose }: TournamentManagerProps) {
  const [tournaments, setTournaments] = useState(listTournaments())

  function handleNew() {
    window.open(tournamentUrl(createTournamentId()), '_blank')
  }

  function handleRemove(id: string, name: string) {
    const confirmed = window.confirm(
      `Excluir o torneio "${name || 'sem nome'}"? Essa ação apaga todos os dados salvos dele.`,
    )
    if (!confirmed) return
    removeTournament(id)
    setTournaments(listTournaments())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-4 backdrop-blur-sm">
      <div className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-green-500/20 bg-neutral-950 p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-100">Meus torneios</h2>
          <button type="button" onClick={onClose} className="text-neutral-400 hover:text-neutral-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <button
          type="button"
          onClick={handleNew}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
        >
          <Plus className="h-4 w-4" /> Novo torneio (abre em nova aba)
        </button>

        <ul className="space-y-2">
          {tournaments.map((t) => (
            <li
              key={t.id}
              className={cn(
                'flex items-center gap-2 rounded-md border px-3 py-2',
                t.id === activeId ? 'border-green-500/50 bg-green-950/20' : 'border-neutral-800',
              )}
            >
              <FolderOpen className="h-4 w-4 flex-shrink-0 text-neutral-500" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-neutral-100">
                  {t.name || 'Torneio sem nome'}
                </p>
                <p className="text-xs text-neutral-500">
                  {t.id === activeId ? 'Aberto nesta janela' : new Date(t.updatedAt).toLocaleString('pt-BR')}
                </p>
              </div>
              {t.id !== activeId && (
                <a
                  href={tournamentUrl(t.id)}
                  className="rounded-md border border-neutral-700 px-2 py-1 text-xs text-neutral-300 hover:border-green-500 hover:text-green-400"
                >
                  Abrir
                </a>
              )}
              <a
                href={tournamentUrl(t.id)}
                target="_blank"
                rel="noreferrer"
                title="Abrir em nova aba"
                className="text-neutral-400 hover:text-neutral-200"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
              {t.id !== activeId && (
                <button
                  type="button"
                  onClick={() => handleRemove(t.id, t.name)}
                  title="Excluir torneio"
                  className="text-neutral-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </li>
          ))}
          {tournaments.length === 0 && (
            <li className="text-sm text-neutral-500">Nenhum outro torneio salvo ainda.</li>
          )}
        </ul>
      </div>
    </div>
  )
}
