import type { GroupMatch, GroupStanding, Team, Tiebreaker } from '../types'

function matchPoints(scored: number, conceded: number): number {
  if (scored > conceded) return 3
  if (scored === conceded) return 1
  return 0
}

/** Points earned strictly from direct meetings between the two given teams. */
function headToHeadCompare(matches: GroupMatch[], a: string, b: string): number {
  let aPts = 0
  let bPts = 0
  for (const m of matches) {
    if (m.homeGoals == null || m.awayGoals == null) continue
    if (m.homeTeamId === a && m.awayTeamId === b) {
      aPts += matchPoints(m.homeGoals, m.awayGoals)
      bPts += matchPoints(m.awayGoals, m.homeGoals)
    } else if (m.homeTeamId === b && m.awayTeamId === a) {
      bPts += matchPoints(m.homeGoals, m.awayGoals)
      aPts += matchPoints(m.awayGoals, m.homeGoals)
    }
  }
  return bPts - aPts
}

export function computeStandings(
  teams: Team[],
  matches: GroupMatch[],
  tiebreakers: Tiebreaker[],
): GroupStanding[] {
  const table = new Map<string, GroupStanding>()
  for (const team of teams) {
    table.set(team.id, {
      teamId: team.id,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDiff: 0,
      points: 0,
    })
  }

  for (const m of matches) {
    if (m.homeGoals == null || m.awayGoals == null) continue
    const home = table.get(m.homeTeamId)
    const away = table.get(m.awayTeamId)
    if (!home || !away) continue

    home.played++
    away.played++
    home.goalsFor += m.homeGoals
    home.goalsAgainst += m.awayGoals
    away.goalsFor += m.awayGoals
    away.goalsAgainst += m.homeGoals

    if (m.homeGoals > m.awayGoals) {
      home.wins++
      home.points += 3
      away.losses++
    } else if (m.homeGoals < m.awayGoals) {
      away.wins++
      away.points += 3
      home.losses++
    } else {
      home.draws++
      away.draws++
      home.points++
      away.points++
    }
  }

  for (const s of table.values()) s.goalDiff = s.goalsFor - s.goalsAgainst

  const names = new Map(teams.map((t) => [t.id, t.name]))

  return [...table.values()].sort((a, b) => {
    for (const tb of tiebreakers) {
      let result: number
      switch (tb.id) {
        case 'points':
          result = b.points - a.points
          break
        case 'goalDiff':
          result = b.goalDiff - a.goalDiff
          break
        case 'goalsFor':
          result = b.goalsFor - a.goalsFor
          break
        case 'headToHead':
          result = headToHeadCompare(matches, a.teamId, b.teamId)
          break
        case 'alphabetical':
          result = (names.get(a.teamId) ?? '').localeCompare(names.get(b.teamId) ?? '')
          break
      }
      if (result !== 0) return result
    }
    return 0
  })
}
