import type {
  Group,
  GroupMatch,
  KnockoutDraw,
  KnockoutRecord,
  Team,
  Tiebreaker,
} from '../types'
import { computeStandings } from './standings'
import { buildKnockoutView, type ResolvedMatch } from './bracket'

interface ExportParams {
  teams: Team[]
  groups: Group[]
  groupMatches: GroupMatch[]
  tiebreakers: Tiebreaker[]
  knockoutDraw: KnockoutDraw | null
  knockoutRecords: Record<string, KnockoutRecord>
  thirdPlaceMatch: boolean
  fileName?: string
}

export async function exportTournamentToExcel({
  teams,
  groups,
  groupMatches,
  tiebreakers,
  knockoutDraw,
  knockoutRecords,
  thirdPlaceMatch,
  fileName = 'campeonato.xlsx',
}: ExportParams) {
  const XLSX = await import('xlsx')
  const wb = XLSX.utils.book_new()

  const groupName = (id: string | null) => groups.find((g) => g.id === id)?.name ?? ''
  const teamName = (id: string | null) => (id ? (teams.find((t) => t.id === id)?.name ?? '?') : '')

  // Equipes
  const equipesRows = teams.map((t) => ({ Equipe: t.name, Grupo: groupName(t.groupId) }))
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(equipesRows), 'Equipes')

  // Classificação (uma aba por grupo)
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
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), `Grupo ${group.name}`.slice(0, 31))
  }

  // Jogos - Grupos
  if (groupMatches.length > 0) {
    const rows = groupMatches
      .slice()
      .sort((a, b) => {
        const gA = groupName(a.groupId)
        const gB = groupName(b.groupId)
        return gA !== gB ? gA.localeCompare(gB) : a.round - b.round
      })
      .map((m) => ({
        Grupo: groupName(m.groupId),
        Rodada: m.round,
        Mandante: teamName(m.homeTeamId),
        Placar:
          m.homeGoals == null || m.awayGoals == null ? '' : `${m.homeGoals} x ${m.awayGoals}`,
        Visitante: teamName(m.awayTeamId),
      }))
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), 'Jogos - Grupos')
  }

  // Mata-Mata
  if (knockoutDraw) {
    const { roundsData, thirdPlaceEntry } = buildKnockoutView(
      knockoutDraw,
      knockoutRecords,
      teams,
      thirdPlaceMatch,
    )

    function matchRow(m: ResolvedMatch) {
      let placar = ''
      if (m.record) {
        const allPlayed = m.record.legs.every((l) => l.homeGoals != null && l.awayGoals != null)
        if (allPlayed && m.record.legs.length > 0) {
          const homeGoals = m.record.legs.reduce((sum, l) => sum + (l.homeGoals ?? 0), 0)
          const awayGoals = m.record.legs.reduce((sum, l) => sum + (l.awayGoals ?? 0), 0)
          placar = `${homeGoals} x ${awayGoals}`
        }
      }
      const pens = m.record?.penalties
      const penaltis = pens?.home != null && pens?.away != null ? `${pens.home} x ${pens.away}` : ''
      const wo = m.record?.wo === 'home' ? m.homeName : m.record?.wo === 'away' ? m.awayName : ''

      return {
        Fase: m.phase,
        'Equipe 1': m.homeName,
        Placar: placar,
        'Equipe 2': m.awayName,
        Pênaltis: penaltis,
        Vencedor: m.winner ? teamName(m.winner) : '',
        'W.O.': wo,
      }
    }

    const rows = roundsData.flat().map(matchRow)
    if (thirdPlaceEntry) rows.push(matchRow(thirdPlaceEntry))
    if (rows.length > 0) {
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), 'Mata-Mata')
    }
  }

  XLSX.writeFile(wb, fileName)
}
