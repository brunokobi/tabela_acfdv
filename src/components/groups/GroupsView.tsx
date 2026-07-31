import { useTournamentStore } from '../../store/tournamentStore'
import { Panel } from '../shared/Panel'
import { GroupCard } from './GroupCard'

export function GroupsView() {
  const config = useTournamentStore((s) => s.config)
  const groups = useTournamentStore((s) => s.groups)
  const teams = useTournamentStore((s) => s.teams)
  const groupMatches = useTournamentStore((s) => s.groupMatches)
  const setGroupMatchScore = useTournamentStore((s) => s.setGroupMatchScore)

  if (!config.useGroupStage) {
    return (
      <Panel>
        <p className="text-sm text-neutral-500">
          A fase de grupos está desativada na Configuração — o torneio vai direto para o mata-mata.
        </p>
      </Panel>
    )
  }

  return (
    <Panel>
      {groups.length === 0 ? (
        <p className="text-sm text-neutral-400">
          Cadastre as equipes e sorteie os grupos na aba Configuração.
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
    </Panel>
  )
}
