import { Trophy, Monitor, Gamepad2, Users, Shuffle, ListOrdered } from 'lucide-react'
import { useTournamentStore } from '../../store/tournamentStore'
import { PLATFORMS, GAMES } from '../../lib/catalog'
import { Card } from '../shared/Card'
import { CatalogSelector } from './CatalogSelector'
import { TeamManager } from './TeamManager'
import { RulesEditor } from './RulesEditor'
import { DrawGroupsButton } from './DrawGroupsButton'
import { TiebreakerEditor } from './TiebreakerEditor'
import { DangerZone } from './DangerZone'

export function ConfigView() {
  const config = useTournamentStore((s) => s.config)
  const teams = useTournamentStore((s) => s.teams)
  const updateConfig = useTournamentStore((s) => s.updateConfig)

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card icon={Trophy} title="Nome do campeonato" className="md:col-span-2">
          <input
            value={config.name}
            onChange={(e) => updateConfig({ name: e.target.value })}
            placeholder="Ex: Copa do Mundo E-Futebol"
            className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 focus:border-green-500 focus:outline-none"
          />
        </Card>

        <Card icon={Monitor} title="Plataforma">
          <CatalogSelector
            options={PLATFORMS}
            selected={config.platform}
            onSelect={(id) => updateConfig({ platform: id })}
          />
        </Card>

        <Card icon={Gamepad2} title="Jogo">
          <CatalogSelector
            options={GAMES}
            selected={config.game}
            onSelect={(id) => updateConfig({ game: id })}
          />
        </Card>

        <Card
          icon={Users}
          title={`Equipes (${teams.length})`}
          className="md:col-span-2"
          action={config.useGroupStage && <DrawGroupsButton />}
        >
          <TeamManager />
        </Card>

        <Card icon={Shuffle} title="Formato do campeonato">
          <RulesEditor />
        </Card>

        <Card icon={ListOrdered} title="Critérios de desempate">
          <TiebreakerEditor />
        </Card>
      </div>

      <DangerZone />
    </div>
  )
}
