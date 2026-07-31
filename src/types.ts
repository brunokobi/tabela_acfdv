export type Platform = 'ps4' | 'ps5'
export type Game = 'ec26' | 'efootball'
export type LegsMode = 'single' | 'double'

export type TiebreakerId = 'points' | 'goalDiff' | 'goalsFor' | 'headToHead' | 'alphabetical'

export interface Tiebreaker {
  id: TiebreakerId
  label: string
}

export interface TournamentConfig {
  name: string
  platform: Platform | null
  game: Game | null
  useGroupStage: boolean
  groupCount: number
  qualifiersPerGroup: number
  groupLegs: LegsMode
  knockoutLegs: LegsMode
  thirdPlaceMatch: boolean
  tiebreakers: Tiebreaker[]
}

export interface Team {
  id: string
  name: string
  groupId: string | null
}

export interface Group {
  id: string
  name: string
}

export interface GroupMatch {
  id: string
  groupId: string
  round: number
  homeTeamId: string
  awayTeamId: string
  homeGoals: number | null
  awayGoals: number | null
}

export interface GroupStanding {
  teamId: string
  played: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  goalDiff: number
  points: number
}

export interface Leg {
  homeGoals: number | null
  awayGoals: number | null
}

export interface Penalties {
  home: number | null
  away: number | null
}

export interface KnockoutRecord {
  legs: Leg[]
  penalties: Penalties | null
  wo: 'home' | 'away' | null
}

export interface BracketSlot {
  teamId: string | null
}

export interface KnockoutDraw {
  round1: BracketSlot[]
}
