import { Download } from 'lucide-react'
import { useTournamentStore } from '../../store/tournamentStore'
import { Panel } from '../shared/Panel'
import { exportStandingsToExcel } from '../../lib/exportExcel'
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
        <>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() =>
                exportStandingsToExcel(groups, teams, groupMatches, config.tiebreakers)
              }
              className="flex items-center gap-2 rounded-md border border-green-500/30 px-3 py-1.5 text-sm font-medium text-green-400 hover:bg-green-950/30"
            >
              <Download className="h-4 w-4" /> Baixar Excel
            </button>
          </div>
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
        </>
      )}
    </Panel>
  )
}
