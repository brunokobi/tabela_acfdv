import { useState, type FormEvent } from 'react'
import { Plus, X } from 'lucide-react'
import { useTournamentStore } from '../../store/tournamentStore'

export function TeamManager() {
  const teams = useTournamentStore((s) => s.teams)
  const groups = useTournamentStore((s) => s.groups)
  const addTeam = useTournamentStore((s) => s.addTeam)
  const removeTeam = useTournamentStore((s) => s.removeTeam)
  const renameTeam = useTournamentStore((s) => s.renameTeam)
  const [draft, setDraft] = useState('')

  function handleAdd(e: FormEvent) {
    e.preventDefault()
    const name = draft.trim()
    if (!name) return
    addTeam(name)
    setDraft('')
  }

  const groupName = (groupId: string | null) => groups.find((g) => g.id === groupId)?.name

  return (
    <div>
      <h3 className="mb-2 text-sm font-medium text-neutral-600 dark:text-neutral-400">
        Equipes ({teams.length})
      </h3>
      <form onSubmit={handleAdd} className="mb-3 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Nome da equipe"
          className="flex-1 rounded-md border border-neutral-300 px-3 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        />
        <button
          type="submit"
          className="flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" /> Adicionar
        </button>
      </form>
      <ul className="max-h-80 space-y-1 overflow-y-auto">
        {teams.map((team) => (
          <li key={team.id} className="flex items-center gap-2">
            <input
              value={team.name}
              onChange={(e) => renameTeam(team.id, e.target.value)}
              className="flex-1 rounded-md border border-transparent bg-transparent px-2 py-1 text-sm hover:border-neutral-200 focus:border-neutral-300 focus:outline-none dark:hover:border-neutral-800"
            />
            {team.groupId && (
              <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                Grupo {groupName(team.groupId)}
              </span>
            )}
            <button
              type="button"
              onClick={() => removeTeam(team.id)}
              className="text-neutral-400 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </li>
        ))}
        {teams.length === 0 && (
          <li className="text-sm text-neutral-400">Nenhuma equipe cadastrada ainda.</li>
        )}
      </ul>
    </div>
  )
}
