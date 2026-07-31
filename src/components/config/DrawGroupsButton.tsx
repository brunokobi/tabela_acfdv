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
    <>
      <button
        type="button"
        onClick={handleDraw}
        disabled={teams.length < config.groupCount}
        className="flex items-center gap-1.5 rounded-md border border-neutral-700 px-2.5 py-1 text-xs font-medium text-neutral-300 hover:border-green-500 hover:text-green-400 disabled:opacity-40"
      >
        <Shuffle className="h-3.5 w-3.5" />
        {groups.length > 0 ? 'Sortear novamente' : 'Sortear'}
      </button>

      {revealItems && (
        <DrawRevealOverlay
          title="Sorteio dos Grupos"
          items={revealItems}
          pool={teams.map((t) => t.name)}
          onFinish={() => setRevealItems(null)}
        />
      )}
    </>
  )
}
