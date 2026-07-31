import { useTournamentStore } from '../../store/tournamentStore'
import { PLATFORMS, GAMES } from '../../lib/catalog'
import { Panel } from '../shared/Panel'
import { CatalogSelector } from './CatalogSelector'
import { TeamManager } from './TeamManager'
import { RulesEditor } from './RulesEditor'
import { DrawGroupsButton } from './DrawGroupsButton'
import { TiebreakerEditor } from './TiebreakerEditor'
import { DangerZone } from './DangerZone'

export function ConfigView() {
  const config = useTournamentStore((s) => s.config)
  const updateConfig = useTournamentStore((s) => s.updateConfig)

  return (
    <Panel maxWidth="max-w-3xl">
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-400">
          Nome do campeonato
        </label>
        <input
          value={config.name}
          onChange={(e) => updateConfig({ name: e.target.value })}
          placeholder="Ex: Copa do Mundo E-Futebol"
          className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 focus:border-green-500 focus:outline-none"
        />
      </div>

      <CatalogSelector
        label="Plataforma"
        options={PLATFORMS}
        selected={config.platform}
        onSelect={(id) => updateConfig({ platform: id })}
      />

      <CatalogSelector
        label="Jogo"
        options={GAMES}
        selected={config.game}
        onSelect={(id) => updateConfig({ game: id })}
      />

      <TeamManager />
      <RulesEditor />
      {config.useGroupStage && <DrawGroupsButton />}
      <TiebreakerEditor />
      <DangerZone />
    </Panel>
  )
}
