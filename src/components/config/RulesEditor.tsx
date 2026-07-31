import type { LegsMode } from '../../types'
import { useTournamentStore } from '../../store/tournamentStore'
import { cn } from '../../lib/cn'

function NumberField({
  label,
  value,
  min,
  onChange,
}: {
  label: string
  value: number
  min: number
  onChange: (v: number) => void
}) {
  return (
    <label className="flex items-center justify-between gap-4">
      <span className="text-sm font-medium">{label}</span>
      <input
        type="number"
        min={min}
        value={value}
        onChange={(e) => onChange(Math.max(min, Number(e.target.value) || min))}
        className="w-20 rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-sm text-neutral-100 focus:border-green-500 focus:outline-none"
      />
    </label>
  )
}

function LegsToggle({
  label,
  value,
  onChange,
}: {
  label: string
  value: LegsMode
  onChange: (v: LegsMode) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex overflow-hidden rounded-md border border-neutral-700 text-sm">
        <button
          type="button"
          onClick={() => onChange('single')}
          className={cn(
            'px-3 py-1',
            value === 'single' ? 'bg-green-600 text-white' : 'hover:bg-neutral-800',
          )}
        >
          Jogo único
        </button>
        <button
          type="button"
          onClick={() => onChange('double')}
          className={cn(
            'px-3 py-1',
            value === 'double' ? 'bg-green-600 text-white' : 'hover:bg-neutral-800',
          )}
        >
          Ida e volta
        </button>
      </div>
    </div>
  )
}

export function RulesEditor() {
  const config = useTournamentStore((s) => s.config)
  const updateConfig = useTournamentStore((s) => s.updateConfig)

  return (
    <div className="space-y-4">
      <label className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium">Usar fase de grupos</span>
        <input
          type="checkbox"
          checked={config.useGroupStage}
          onChange={(e) => updateConfig({ useGroupStage: e.target.checked })}
          className="h-4 w-4"
        />
      </label>

      {config.useGroupStage && (
        <>
          <NumberField
            label="Número de grupos"
            value={config.groupCount}
            min={1}
            onChange={(v) => updateConfig({ groupCount: v })}
          />
          <NumberField
            label="Classificados por grupo"
            value={config.qualifiersPerGroup}
            min={1}
            onChange={(v) => updateConfig({ qualifiersPerGroup: v })}
          />
          <LegsToggle
            label="Fase de grupos"
            value={config.groupLegs}
            onChange={(v) => updateConfig({ groupLegs: v })}
          />
        </>
      )}

      <LegsToggle
        label="Mata-mata"
        value={config.knockoutLegs}
        onChange={(v) => updateConfig({ knockoutLegs: v })}
      />

      <label className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium">Disputa de 3º lugar</span>
        <input
          type="checkbox"
          checked={config.thirdPlaceMatch}
          onChange={(e) => updateConfig({ thirdPlaceMatch: e.target.checked })}
          className="h-4 w-4"
        />
      </label>
    </div>
  )
}
