import { useState } from 'react'
import { Layers } from 'lucide-react'
import { useTournamentStore } from '../../store/tournamentStore'
import { PLATFORMS, GAMES } from '../../lib/catalog'
import { Logo } from '../shared/Logo'
import { TournamentManager } from '../tournaments/TournamentManager'

export function Header() {
  const config = useTournamentStore((s) => s.config)
  const platform = PLATFORMS.find((p) => p.id === config.platform)
  const game = GAMES.find((g) => g.id === config.game)
  const [managerOpen, setManagerOpen] = useState(false)

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
      <div className="flex items-center gap-3">
        <img
          src="/favicon.jpg"
          alt="ACFDV"
          className="h-9 w-9 rounded-full ring-1 ring-green-500/40"
        />
        <div>
          <h1 className="text-xl font-semibold text-green-50">
            {config.name || 'Campeonato E-Futebol'}
          </h1>
          <p className="text-xs text-neutral-500">Monte seu torneio</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setManagerOpen(true)}
          className="flex items-center gap-2 rounded-md border border-neutral-700 px-3 py-1.5 text-sm text-neutral-300 hover:border-green-500 hover:text-green-400"
        >
          <Layers className="h-4 w-4" /> Torneios
        </button>
        {managerOpen && <TournamentManager onClose={() => setManagerOpen(false)} />}
        {platform && (
          <div className="flex flex-col items-center gap-1 rounded-lg border-2 border-green-400 bg-green-950/40 px-3 py-2">
            <Logo
              src={platform.logoSrc}
              alt={platform.label}
              fallbackIcon={platform.fallbackIcon}
              className="h-8 w-8"
            />
            <span className="text-xs font-medium text-neutral-100">{platform.label}</span>
          </div>
        )}
        {game && (
          <div className="flex flex-col items-center gap-1 rounded-lg border-2 border-green-400 bg-green-950/40 px-3 py-2">
            <Logo
              src={game.logoSrc}
              alt={game.label}
              fallbackIcon={game.fallbackIcon}
              className="h-8 w-8"
            />
            <span className="text-xs font-medium text-neutral-100">{game.label}</span>
          </div>
        )}
      </div>
    </header>
  )
}
