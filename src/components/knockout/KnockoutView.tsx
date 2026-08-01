import { useMemo, useState } from 'react'
import { Shuffle, LayoutList, Network } from 'lucide-react'
import { useTournamentStore, useTournamentStoreApi } from '../../store/tournamentStore'
import { buildKnockoutView } from '../../lib/bracket'
import { cn } from '../../lib/cn'
import { DrawRevealOverlay, type RevealItem } from '../shared/DrawRevealOverlay'
import { Panel } from '../shared/Panel'
import { KnockoutTable } from './KnockoutTable'
import { BracketView } from './BracketView'
import { Podium } from './Podium'
import { ChampionCelebration } from './ChampionCelebration'

type ViewMode = 'tabela' | 'chaveamento'

export function KnockoutView() {
  const config = useTournamentStore((s) => s.config)
  const teams = useTournamentStore((s) => s.teams)
  const groups = useTournamentStore((s) => s.groups)
  const knockoutDraw = useTournamentStore((s) => s.knockoutDraw)
  const knockoutRecords = useTournamentStore((s) => s.knockoutRecords)
  const drawKnockout = useTournamentStore((s) => s.drawKnockout)
  const setKnockoutLeg = useTournamentStore((s) => s.setKnockoutLeg)
  const setKnockoutPenalty = useTournamentStore((s) => s.setKnockoutPenalty)
  const setKnockoutWO = useTournamentStore((s) => s.setKnockoutWO)
  const celebratedChampion = useTournamentStore((s) => s.celebratedChampion)
  const markChampionCelebrated = useTournamentStore((s) => s.markChampionCelebrated)
  const storeApi = useTournamentStoreApi()
  const [viewMode, setViewMode] = useState<ViewMode>('chaveamento')
  const [revealItems, setRevealItems] = useState<RevealItem[] | null>(null)

  const qualifiedCount = useMemo(() => {
    if (!config.useGroupStage) return teams.length
    return groups.reduce((sum, g) => {
      const groupTeamCount = teams.filter((t) => t.groupId === g.id).length
      return sum + Math.min(config.qualifiersPerGroup, groupTeamCount)
    }, 0)
  }, [config.useGroupStage, config.qualifiersPerGroup, teams, groups])

  const { roundsData, thirdPlaceEntry } = useMemo(() => {
    if (!knockoutDraw) return { roundsData: [], thirdPlaceEntry: null }
    return buildKnockoutView(knockoutDraw, knockoutRecords, teams, config.thirdPlaceMatch)
  }, [knockoutDraw, knockoutRecords, teams, config.thirdPlaceMatch])

  const finalMatch = roundsData[roundsData.length - 1]?.[0] ?? null
  const championId = finalMatch?.winner ?? null
  const championName = championId
    ? championId === finalMatch?.home
      ? finalMatch?.homeName
      : finalMatch?.awayName
    : null
  const runnerUpName = championId
    ? championId === finalMatch?.home
      ? finalMatch?.awayName
      : finalMatch?.homeName
    : null
  const thirdPlaceName = thirdPlaceEntry?.winner
    ? thirdPlaceEntry.winner === thirdPlaceEntry.home
      ? thirdPlaceEntry.homeName
      : thirdPlaceEntry.awayName
    : null

  const shouldCelebrate = championId != null && championId !== celebratedChampion

  function handleCelebrationFinish() {
    if (championId) markChampionCelebrated(championId)
  }

  const handlers = {
    onLegChange: setKnockoutLeg,
    onPenaltyChange: setKnockoutPenalty,
    onWOChange: setKnockoutWO,
  }

  function handleDraw() {
    drawKnockout()
    const state = storeApi.getState()
    const draw = state.knockoutDraw
    if (!draw) return
    const teamName = (id: string | null) =>
      id ? (state.teams.find((t) => t.id === id)?.name ?? '?') : null

    const items: RevealItem[] = []
    for (let i = 0; i < draw.round1.length / 2; i++) {
      const home = teamName(draw.round1[i * 2]?.teamId ?? null)
      const away = teamName(draw.round1[i * 2 + 1]?.teamId ?? null)
      const finalText = home && away ? `${home} × ${away}` : `${home ?? away} (W.O.)`
      items.push({ key: `pair-${i}`, label: `Confronto ${i + 1}`, finalText })
    }
    setRevealItems(items)
  }

  return (
    <Panel className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-neutral-500">
          {qualifiedCount} equipe{qualifiedCount === 1 ? '' : 's'} no mata-mata
        </p>
        <div className="flex items-center gap-3">
          <div className="flex overflow-hidden rounded-md border border-neutral-700 text-sm">
            <button
              type="button"
              onClick={() => setViewMode('tabela')}
              className={cn(
                'flex items-center gap-1 px-3 py-1.5',
                viewMode === 'tabela' ? 'bg-green-600 text-white' : 'hover:bg-neutral-800',
              )}
            >
              <LayoutList className="h-4 w-4" /> Tabela
            </button>
            <button
              type="button"
              onClick={() => setViewMode('chaveamento')}
              className={cn(
                'flex items-center gap-1 px-3 py-1.5',
                viewMode === 'chaveamento' ? 'bg-green-600 text-white' : 'hover:bg-neutral-800',
              )}
            >
              <Network className="h-4 w-4" /> Chaveamento
            </button>
          </div>
          <button
            type="button"
            onClick={handleDraw}
            disabled={qualifiedCount < 2}
            className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-40"
          >
            <Shuffle className="h-4 w-4" />
            {knockoutDraw ? 'Sortear novamente' : 'Sortear mata-mata'}
          </button>
        </div>
      </div>

      {revealItems && (
        <DrawRevealOverlay
          title="Sorteio do Mata-Mata"
          items={revealItems}
          pool={teams.map((t) => t.name)}
          onFinish={() => setRevealItems(null)}
        />
      )}

      {shouldCelebrate && championName && (
        <ChampionCelebration championName={championName} onFinish={handleCelebrationFinish} />
      )}

      {championName && (
        <div className="flex justify-center">
          <Podium champion={championName} runnerUp={runnerUpName} thirdPlace={thirdPlaceName} />
        </div>
      )}

      {!knockoutDraw ? (
        <p className="text-sm text-neutral-400">
          {config.useGroupStage
            ? 'Finalize a fase de grupos e sorteie o mata-mata.'
            : 'Cadastre as equipes e sorteie o mata-mata.'}
        </p>
      ) : viewMode === 'tabela' ? (
        <KnockoutTable
          roundsData={roundsData}
          thirdPlaceEntry={thirdPlaceEntry}
          legsMode={config.knockoutLegs}
          {...handlers}
        />
      ) : (
        <BracketView
          roundsData={roundsData}
          thirdPlaceEntry={thirdPlaceEntry}
          legsMode={config.knockoutLegs}
          {...handlers}
        />
      )}
    </Panel>
  )
}
