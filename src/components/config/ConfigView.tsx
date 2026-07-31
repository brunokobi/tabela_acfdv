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
    <Panel className="space-y-6 divide-y divide-neutral-800/80">
      <section className="space-y-4">
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

        <div className="grid gap-4 sm:grid-cols-2">
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
        </div>
      </section>

      <section className="pt-6">
        <TeamManager />
      </section>

      <section className="space-y-4 pt-6">
        <h3 className="text-sm font-semibold text-neutral-300">Formato do campeonato</h3>
        <RulesEditor />
        {config.useGroupStage && <DrawGroupsButton />}
      </section>

      <section className="pt-6">
        <TiebreakerEditor />
      </section>

      <section className="pt-6">
        <DangerZone />
      </section>
    </Panel>
  )
}
