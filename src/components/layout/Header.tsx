import { useState } from 'react'
import { Layers, Download } from 'lucide-react'
import { useTournamentStore } from '../../store/tournamentStore'
import { PLATFORMS, GAMES } from '../../lib/catalog'
import { exportTournamentToExcel } from '../../lib/exportExcel'
import { Logo } from '../shared/Logo'
import { TournamentManager } from '../tournaments/TournamentManager'

export function Header() {
  const config = useTournamentStore((s) => s.config)
  const teams = useTournamentStore((s) => s.teams)
  const groups = useTournamentStore((s) => s.groups)
  const groupMatches = useTournamentStore((s) => s.groupMatches)
  const knockoutDraw = useTournamentStore((s) => s.knockoutDraw)
  const knockoutRecords = useTournamentStore((s) => s.knockoutRecords)
  const platform = PLATFORMS.find((p) => p.id === config.platform)
  const game = GAMES.find((g) => g.id === config.game)
  const [managerOpen, setManagerOpen] = useState(false)

  function handleExport() {
    exportTournamentToExcel({
      teams,
      groups,
      groupMatches,
      tiebreakers: config.tiebreakers,
      knockoutDraw,
      knockoutRecords,
      thirdPlaceMatch: config.thirdPlaceMatch,
    })
  }

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
        <button
          type="button"
          onClick={handleExport}
          disabled={teams.length === 0}
          title="Baixar todos os dados do campeonato (grupos e mata-mata) em Excel"
          className="flex items-center gap-2 rounded-md border border-green-500/30 px-3 py-1.5 text-sm font-medium text-green-400 hover:bg-green-950/30 disabled:opacity-30"
        >
          <Download className="h-4 w-4" /> Baixar Excel
        </button>
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
