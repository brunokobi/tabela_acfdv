import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  Group,
  GroupMatch,
  KnockoutDraw,
  KnockoutRecord,
  Team,
  Tiebreaker,
  TournamentConfig,
} from '../types'
import { distributeIntoGroups, generateGroupMatches } from '../lib/roundRobin'
import { buildKnockoutDraw } from '../lib/bracket'
import { computeStandings } from '../lib/standings'

const DEFAULT_TIEBREAKERS: Tiebreaker[] = [
  { id: 'points', label: 'Pontos' },
  { id: 'goalDiff', label: 'Saldo de gols' },
  { id: 'goalsFor', label: 'Gols pró' },
  { id: 'headToHead', label: 'Confronto direto' },
  { id: 'alphabetical', label: 'Ordem alfabética' },
]

function defaultConfig(): TournamentConfig {
  return {
    name: '',
    platform: null,
    game: null,
    useGroupStage: true,
    groupCount: 2,
    qualifiersPerGroup: 2,
    groupLegs: 'single',
    knockoutLegs: 'single',
    thirdPlaceMatch: true,
    tiebreakers: DEFAULT_TIEBREAKERS,
  }
}

function ensureRecord(
  records: Record<string, KnockoutRecord>,
  key: string,
  legsMode: TournamentConfig['knockoutLegs'],
): KnockoutRecord {
  return (
    records[key] ?? {
      legs: Array.from({ length: legsMode === 'double' ? 2 : 1 }, () => ({
        homeGoals: null,
        awayGoals: null,
      })),
      penalties: null,
      wo: null,
    }
  )
}

interface TournamentState {
  config: TournamentConfig
  teams: Team[]
  groups: Group[]
  groupMatches: GroupMatch[]
  knockoutDraw: KnockoutDraw | null
  knockoutRecords: Record<string, KnockoutRecord>

  updateConfig: (patch: Partial<TournamentConfig>) => void
  setTiebreakers: (tiebreakers: Tiebreaker[]) => void

  addTeam: (name: string) => void
  removeTeam: (id: string) => void
  renameTeam: (id: string, name: string) => void

  drawGroups: () => void
  setGroupMatchScore: (matchId: string, homeGoals: number | null, awayGoals: number | null) => void

  drawKnockout: () => void
  setKnockoutLeg: (
    key: string,
    legIndex: number,
    side: 'home' | 'away',
    value: number | null,
  ) => void
  setKnockoutPenalty: (key: string, side: 'home' | 'away', value: number | null) => void
  setKnockoutWO: (key: string, side: 'home' | 'away' | null) => void

  resetAll: () => void
}

export const useTournamentStore = create<TournamentState>()(
  persist(
    (set, get) => ({
      config: defaultConfig(),
      teams: [],
      groups: [],
      groupMatches: [],
      knockoutDraw: null,
      knockoutRecords: {},

      updateConfig: (patch) => set((state) => ({ config: { ...state.config, ...patch } })),
      setTiebreakers: (tiebreakers) =>
        set((state) => ({ config: { ...state.config, tiebreakers } })),

      addTeam: (name) =>
        set((state) => ({
          teams: [...state.teams, { id: crypto.randomUUID(), name, groupId: null }],
        })),
      removeTeam: (id) =>
        set((state) => ({ teams: state.teams.filter((t) => t.id !== id) })),
      renameTeam: (id, name) =>
        set((state) => ({
          teams: state.teams.map((t) => (t.id === id ? { ...t, name } : t)),
        })),

      drawGroups: () => {
        const { teams, config } = get()
        if (config.groupCount < 1 || teams.length < config.groupCount) return

        const groups: Group[] = Array.from({ length: config.groupCount }, (_, i) => ({
          id: `g${i}`,
          name: String.fromCharCode(65 + i),
        }))
        const buckets = distributeIntoGroups(teams, config.groupCount)

        const updatedTeams: Team[] = []
        const groupMatches: GroupMatch[] = []
        buckets.forEach((bucket, i) => {
          const groupId = groups[i].id
          for (const team of bucket) updatedTeams.push({ ...team, groupId })
          groupMatches.push(
            ...generateGroupMatches(
              bucket.map((t) => t.id),
              groupId,
              config.groupLegs,
            ),
          )
        })

        set({ groups, teams: updatedTeams, groupMatches, knockoutDraw: null, knockoutRecords: {} })
      },

      setGroupMatchScore: (matchId, homeGoals, awayGoals) =>
        set((state) => ({
          groupMatches: state.groupMatches.map((m) =>
            m.id === matchId ? { ...m, homeGoals, awayGoals } : m,
          ),
        })),

      drawKnockout: () => {
        const { teams, groups, groupMatches, config } = get()
        let poolIds: string[]
        if (config.useGroupStage) {
          poolIds = groups.flatMap((g) => {
            const groupTeams = teams.filter((t) => t.groupId === g.id)
            const matches = groupMatches.filter((m) => m.groupId === g.id)
            const standings = computeStandings(groupTeams, matches, config.tiebreakers)
            return standings.slice(0, config.qualifiersPerGroup).map((s) => s.teamId)
          })
        } else {
          poolIds = teams.map((t) => t.id)
        }
        if (poolIds.length < 2) return
        set({ knockoutDraw: buildKnockoutDraw(poolIds), knockoutRecords: {} })
      },

      setKnockoutLeg: (key, legIndex, side, value) =>
        set((state) => {
          const record = ensureRecord(state.knockoutRecords, key, state.config.knockoutLegs)
          const legs = record.legs.slice()
          legs[legIndex] = {
            ...legs[legIndex],
            [side === 'home' ? 'homeGoals' : 'awayGoals']: value,
          }
          return { knockoutRecords: { ...state.knockoutRecords, [key]: { ...record, legs } } }
        }),

      setKnockoutPenalty: (key, side, value) =>
        set((state) => {
          const record = ensureRecord(state.knockoutRecords, key, state.config.knockoutLegs)
          const penalties = record.penalties ?? { home: null, away: null }
          return {
            knockoutRecords: {
              ...state.knockoutRecords,
              [key]: { ...record, penalties: { ...penalties, [side]: value } },
            },
          }
        }),

      setKnockoutWO: (key, side) =>
        set((state) => {
          const record = ensureRecord(state.knockoutRecords, key, state.config.knockoutLegs)
          return { knockoutRecords: { ...state.knockoutRecords, [key]: { ...record, wo: side } } }
        }),

      resetAll: () =>
        set({
          config: defaultConfig(),
          teams: [],
          groups: [],
          groupMatches: [],
          knockoutDraw: null,
          knockoutRecords: {},
        }),
    }),
    {
      name: 'esports-bracket-v1',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
