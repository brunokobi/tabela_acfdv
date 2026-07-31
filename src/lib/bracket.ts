import type { BracketSlot, KnockoutDraw, KnockoutRecord, Team } from '../types'
import { shuffle } from './shuffle'

export const THIRD_PLACE_KEY = 'third-place'

export function matchKey(round: number, index: number): string {
  return `r${round}-m${index}`
}

function nextPowerOfTwo(n: number): number {
  let p = 1
  while (p < n) p *= 2
  return p
}

/**
 * Random draw into a single-elimination bracket. When the qualified count isn't a
 * power of two, the shortfall gets byes (auto walkover into round 2) — the first
 * `byes` pairs are [team, null], the rest are normal team-vs-team pairs.
 */
export function buildKnockoutDraw(teamIds: string[]): KnockoutDraw {
  const shuffled = shuffle(teamIds)
  const bracketSize = nextPowerOfTwo(shuffled.length)
  const byes = bracketSize - shuffled.length
  const byeTeams = shuffled.slice(0, byes)
  const playInTeams = shuffled.slice(byes)

  const round1: BracketSlot[] = []
  for (const teamId of byeTeams) {
    round1.push({ teamId })
    round1.push({ teamId: null })
  }
  for (const teamId of playInTeams) {
    round1.push({ teamId })
  }
  return { round1 }
}

export function totalRounds(draw: KnockoutDraw): number {
  return Math.log2(draw.round1.length)
}

export function phaseLabel(round: number, rounds: number): string {
  const distanceFromFinal = rounds - 1 - round
  switch (distanceFromFinal) {
    case 0:
      return 'Final'
    case 1:
      return 'Semifinal'
    case 2:
      return 'Quartas de final'
    case 3:
      return 'Oitavas de final'
    default:
      return `Rodada de ${2 ** (distanceFromFinal + 1)}`
  }
}

function resolveWinnerForTeams(
  home: string | null,
  away: string | null,
  record: KnockoutRecord | undefined,
): string | null {
  if (!home || !away) return null
  if (!record) return null
  if (record.wo === 'home') return home
  if (record.wo === 'away') return away
  if (record.legs.some((l) => l.homeGoals == null || l.awayGoals == null)) return null

  let homeGoals = 0
  let awayGoals = 0
  for (const leg of record.legs) {
    homeGoals += leg.homeGoals!
    awayGoals += leg.awayGoals!
  }
  if (homeGoals !== awayGoals) return homeGoals > awayGoals ? home : away

  const pens = record.penalties
  if (pens?.home != null && pens?.away != null && pens.home !== pens.away) {
    return pens.home > pens.away ? home : away
  }
  return null
}

export function resolveTeams(
  draw: KnockoutDraw,
  records: Record<string, KnockoutRecord>,
  round: number,
  index: number,
): [string | null, string | null] {
  if (round === 0) {
    const home = draw.round1[index * 2]?.teamId ?? null
    const away = draw.round1[index * 2 + 1]?.teamId ?? null
    return [home, away]
  }
  const feederRound = round - 1
  const home = resolveWinner(draw, records, feederRound, index * 2)
  const away = resolveWinner(draw, records, feederRound, index * 2 + 1)
  return [home, away]
}

export function resolveWinner(
  draw: KnockoutDraw,
  records: Record<string, KnockoutRecord>,
  round: number,
  index: number,
): string | null {
  const [home, away] = resolveTeams(draw, records, round, index)
  if (round === 0) {
    // A null slot in round 1 is a genuine bye from the draw (not a pending match) — auto-advance.
    if (home && !away) return home
    if (away && !home) return away
  }
  return resolveWinnerForTeams(home, away, records[matchKey(round, index)])
}

/** True once both teams are known, every leg has a score, and the aggregate is level. */
export function needsPenalties(
  home: string | null,
  away: string | null,
  record: KnockoutRecord | undefined,
): boolean {
  if (!home || !away || !record) return false
  if (record.wo) return false
  if (record.legs.some((l) => l.homeGoals == null || l.awayGoals == null)) return false
  let homeGoals = 0
  let awayGoals = 0
  for (const leg of record.legs) {
    homeGoals += leg.homeGoals!
    awayGoals += leg.awayGoals!
  }
  return homeGoals === awayGoals
}

export function resolveThirdPlaceTeams(
  draw: KnockoutDraw,
  records: Record<string, KnockoutRecord>,
  rounds: number,
): [string | null, string | null] {
  if (rounds < 2) return [null, null]
  const semiRound = rounds - 2
  const loserOf = (index: number) => {
    const [home, away] = resolveTeams(draw, records, semiRound, index)
    const winner = resolveWinner(draw, records, semiRound, index)
    if (!winner) return null
    return winner === home ? away : home
  }
  return [loserOf(0), loserOf(1)]
}

export function resolveThirdPlaceWinner(
  draw: KnockoutDraw,
  records: Record<string, KnockoutRecord>,
  rounds: number,
): string | null {
  const [home, away] = resolveThirdPlaceTeams(draw, records, rounds)
  return resolveWinnerForTeams(home, away, records[THIRD_PLACE_KEY])
}

export interface ResolvedMatch {
  key: string
  round: number
  phase: string
  home: string | null
  away: string | null
  homeName: string
  awayName: string
  record: KnockoutRecord | undefined
  winner: string | null
  needsPens: boolean
}

function teamLabel(teams: Team[], id: string | null, isRound1Bye: boolean): string {
  if (id) return teams.find((t) => t.id === id)?.name ?? '?'
  return isRound1Bye ? 'BYE' : 'A definir'
}

export interface KnockoutViewModel {
  rounds: number
  roundsData: ResolvedMatch[][]
  thirdPlaceEntry: ResolvedMatch | null
}

export function buildKnockoutView(
  draw: KnockoutDraw,
  records: Record<string, KnockoutRecord>,
  teams: Team[],
  includeThirdPlace: boolean,
): KnockoutViewModel {
  const rounds = totalRounds(draw)
  const roundsData: ResolvedMatch[][] = []

  for (let round = 0; round < rounds; round++) {
    const matchesInRound = draw.round1.length / 2 ** (round + 1)
    const list: ResolvedMatch[] = []
    for (let index = 0; index < matchesInRound; index++) {
      const [home, away] = resolveTeams(draw, records, round, index)
      const key = matchKey(round, index)
      const record = records[key]
      list.push({
        key,
        round,
        phase: phaseLabel(round, rounds),
        home,
        away,
        homeName: teamLabel(teams, home, round === 0),
        awayName: teamLabel(teams, away, round === 0),
        record,
        winner: resolveWinner(draw, records, round, index),
        needsPens: needsPenalties(home, away, record),
      })
    }
    roundsData.push(list)
  }

  let thirdPlaceEntry: ResolvedMatch | null = null
  if (includeThirdPlace && rounds >= 2) {
    const [home, away] = resolveThirdPlaceTeams(draw, records, rounds)
    const record = records[THIRD_PLACE_KEY]
    thirdPlaceEntry = {
      key: THIRD_PLACE_KEY,
      round: rounds - 1,
      phase: '3º lugar',
      home,
      away,
      homeName: teamLabel(teams, home, false),
      awayName: teamLabel(teams, away, false),
      record,
      winner: resolveThirdPlaceWinner(draw, records, rounds),
      needsPens: needsPenalties(home, away, record),
    }
  }

  return { rounds, roundsData, thirdPlaceEntry }
}
