import { useTournamentStore } from '../../store/tournamentStore'
import { PLATFORMS, GAMES } from '../../lib/catalog'
import { Logo } from '../shared/Logo'

export function Header() {
  const config = useTournamentStore((s) => s.config)
  const platform = PLATFORMS.find((p) => p.id === config.platform)
  const game = GAMES.find((g) => g.id === config.game)

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
      <div className="flex items-center gap-3">
        <img
          src="/favicon.jpg"
          alt="ACFDV"
          className="h-9 w-9 rounded-full ring-1 ring-green-500/40"
        />
        <h1 className="text-xl font-semibold text-green-50">
          {config.name || 'Campeonato E-Futebol'}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        {platform && (
          <span className="flex items-center gap-2 text-sm text-neutral-300">
            <Logo
              src={platform.logoSrc}
              alt={platform.label}
              fallbackIcon={platform.fallbackIcon}
              className="h-10 w-10 rounded-md ring-1 ring-white/10"
            />
            {platform.label}
          </span>
        )}
        {game && (
          <span className="flex items-center gap-2 text-sm text-neutral-300">
            <Logo
              src={game.logoSrc}
              alt={game.label}
              fallbackIcon={game.fallbackIcon}
              className="h-10 w-10 rounded-md ring-1 ring-white/10"
            />
            {game.label}
          </span>
        )}
      </div>
    </header>
  )
}
