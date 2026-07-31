import { useTournamentStore } from '../../store/tournamentStore'
import { PLATFORMS, GAMES } from '../../lib/catalog'
import { CatalogSelector } from './CatalogSelector'
import { TeamManager } from './TeamManager'
import { RulesEditor } from './RulesEditor'
import { TiebreakerEditor } from './TiebreakerEditor'
import { DangerZone } from './DangerZone'

export function ConfigView() {
  const config = useTournamentStore((s) => s.config)
  const updateConfig = useTournamentStore((s) => s.updateConfig)

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-6 py-8">
      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-600 dark:text-neutral-400">
          Nome do campeonato
        </label>
        <input
          value={config.name}
          onChange={(e) => updateConfig({ name: e.target.value })}
          placeholder="Ex: Copa do Mundo E-Futebol"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
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
      <TiebreakerEditor />
      <DangerZone />
    </div>
  )
}
