import type { GroupMatch, LegsMode } from '../types'
import { shuffle } from './shuffle'

const BYE = '__BYE__'

/** Circle method: returns rounds of [home, away] pairs, each team meets every other exactly once. */
function circleMethod(teamIds: string[]): Array<Array<[string, string]>> {
  const arr = [...teamIds]
  if (arr.length % 2 !== 0) arr.push(BYE)
  const n = arr.length
  const rounds: Array<Array<[string, string]>> = []

  for (let round = 0; round < n - 1; round++) {
    const pairs: Array<[string, string]> = []
    for (let i = 0; i < n / 2; i++) {
      const a = arr[i]
      const b = arr[n - 1 - i]
      if (a !== BYE && b !== BYE) {
        pairs.push(round % 2 === 0 ? [a, b] : [b, a])
      }
    }
    rounds.push(pairs)
    arr.splice(1, 0, arr.pop()!)
  }
  return rounds
}

export function generateGroupMatches(teamIds: string[], groupId: string, legs: LegsMode): GroupMatch[] {
  const rounds = circleMethod(teamIds)
  const matches: GroupMatch[] = []

  rounds.forEach((pairs, roundIdx) => {
    for (const [home, away] of pairs) {
      matches.push({
        id: crypto.randomUUID(),
        groupId,
        round: roundIdx + 1,
        homeTeamId: home,
        awayTeamId: away,
        homeGoals: null,
        awayGoals: null,
      })
    }
  })

  if (legs === 'double') {
    rounds.forEach((pairs, roundIdx) => {
      for (const [home, away] of pairs) {
        matches.push({
          id: crypto.randomUUID(),
          groupId,
          round: rounds.length + roundIdx + 1,
          homeTeamId: away,
          awayTeamId: home,
          homeGoals: null,
          awayGoals: null,
        })
      }
    })
  }

  return matches
}

/** Splits shuffled teams as evenly as possible across `groupCount` groups. */
export function distributeIntoGroups<T>(teams: T[], groupCount: number): T[][] {
  const shuffled = shuffle(teams)
  const groups: T[][] = Array.from({ length: groupCount }, () => [])
  shuffled.forEach((team, i) => {
    groups[i % groupCount].push(team)
  })
  return groups
}
