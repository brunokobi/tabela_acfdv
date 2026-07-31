import { useState } from 'react'
import { Shuffle } from 'lucide-react'
import { useTournamentStore, useTournamentStoreApi } from '../../store/tournamentStore'
import { DrawRevealOverlay, type RevealItem } from '../shared/DrawRevealOverlay'

export function DrawGroupsButton() {
  const config = useTournamentStore((s) => s.config)
  const groups = useTournamentStore((s) => s.groups)
  const teams = useTournamentStore((s) => s.teams)
  const drawGroups = useTournamentStore((s) => s.drawGroups)
  const storeApi = useTournamentStoreApi()
  const [revealItems, setRevealItems] = useState<RevealItem[] | null>(null)

  function handleDraw() {
    drawGroups()
    const state = storeApi.getState()
    const items = state.groups.flatMap((g) =>
      state.teams
        .filter((t) => t.groupId === g.id)
        .map((t) => ({ key: t.id, label: `Grupo ${g.name}`, finalText: t.name })),
    )
    setRevealItems(items)
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-neutral-500">
        {teams.length} equipes cadastradas · {config.groupCount} grupo
        {config.groupCount === 1 ? '' : 's'}
      </p>
      <button
        type="button"
        onClick={handleDraw}
        disabled={teams.length < config.groupCount}
        className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-40"
      >
        <Shuffle className="h-4 w-4" />
        {groups.length > 0 ? 'Sortear novamente' : 'Sortear grupos'}
      </button>

      {revealItems && (
        <DrawRevealOverlay
          title="Sorteio dos Grupos"
          items={revealItems}
          pool={teams.map((t) => t.name)}
          onFinish={() => setRevealItems(null)}
        />
      )}
    </div>
  )
}
