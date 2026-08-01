import type { Group, GroupMatch, Team, Tiebreaker } from '../types'
import { computeStandings } from './standings'

export async function exportStandingsToExcel(
  groups: Group[],
  teams: Team[],
  groupMatches: GroupMatch[],
  tiebreakers: Tiebreaker[],
  fileName = 'classificacao.xlsx',
) {
  const XLSX = await import('xlsx')
  const wb = XLSX.utils.book_new()

  for (const group of groups) {
    const groupTeams = teams.filter((t) => t.groupId === group.id)
    const matches = groupMatches.filter((m) => m.groupId === group.id)
    const standings = computeStandings(groupTeams, matches, tiebreakers)
    const names = new Map(groupTeams.map((t) => [t.id, t.name]))

    const rows = standings.map((s, i) => ({
      '#': i + 1,
      Equipe: names.get(s.teamId) ?? '?',
      J: s.played,
      V: s.wins,
      E: s.draws,
      D: s.losses,
      SG: s.goalDiff,
      Pts: s.points,
    }))

    const sheet = XLSX.utils.json_to_sheet(rows)
    XLSX.utils.book_append_sheet(wb, sheet, `Grupo ${group.name}`.slice(0, 31))
  }

  XLSX.writeFile(wb, fileName)
}
