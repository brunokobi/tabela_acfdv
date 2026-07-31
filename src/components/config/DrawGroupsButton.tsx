import { useState } from 'react'
import { Dices } from 'lucide-react'
import { useTournamentStore, useTournamentStoreApi } from '../../store/tournamentStore'
import { DrawRevealOverlay, type RevealItem } from '../shared/DrawRevealOverlay'

export function DrawGroupsButton() {
  const config = useTournamentStore((s) => s.config)
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
        className="flex items-center justify-center gap-2 rounded-md border-2 border-green-500/50 bg-transparent px-5 py-2.5 text-base font-semibold text-green-400 hover:bg-green-500/10 disabled:opacity-40 disabled:[animation:none] animate-[pulse-border_1.6s_ease-in-out_infinite]"
      >
        <Dices className="h-5 w-5 text-green-400" />
        Sortear
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
