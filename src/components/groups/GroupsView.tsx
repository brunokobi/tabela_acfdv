import { Shuffle } from 'lucide-react'
import { useTournamentStore } from '../../store/tournamentStore'
import { GroupCard } from './GroupCard'

export function GroupsView() {
  const config = useTournamentStore((s) => s.config)
  const groups = useTournamentStore((s) => s.groups)
  const teams = useTournamentStore((s) => s.teams)
  const groupMatches = useTournamentStore((s) => s.groupMatches)
  const drawGroups = useTournamentStore((s) => s.drawGroups)
  const setGroupMatchScore = useTournamentStore((s) => s.setGroupMatchScore)

  if (!config.useGroupStage) {
    return (
      <p className="mx-auto max-w-3xl px-6 py-8 text-sm text-neutral-500">
        A fase de grupos está desativada na Configuração — o torneio vai direto para o mata-mata.
      </p>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-6 py-8">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          {teams.length} equipes cadastradas · {config.groupCount} grupo
          {config.groupCount === 1 ? '' : 's'}
        </p>
        <button
          type="button"
          onClick={drawGroups}
          disabled={teams.length < config.groupCount}
          className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40"
        >
          <Shuffle className="h-4 w-4" />
          {groups.length > 0 ? 'Sortear novamente' : 'Sortear grupos'}
        </button>
      </div>

      {groups.length === 0 ? (
        <p className="text-sm text-neutral-400">
          Cadastre as equipes na Configuração e sorteie os grupos.
        </p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              groupName={group.name}
              teams={teams.filter((t) => t.groupId === group.id)}
              matches={groupMatches.filter((m) => m.groupId === group.id)}
              tiebreakers={config.tiebreakers}
              qualifiersPerGroup={config.qualifiersPerGroup}
              onScoreChange={setGroupMatchScore}
            />
          ))}
        </div>
      )}
    </div>
  )
}
