export interface TournamentMeta {
  id: string
  name: string
  updatedAt: number
}

const REGISTRY_KEY = 'esports-bracket-registry'
const LEGACY_STORAGE_KEY = 'esports-bracket-v1'
const LEGACY_ID = 'legacy'

export function storageKeyFor(id: string): string {
  return id === LEGACY_ID ? LEGACY_STORAGE_KEY : `esports-bracket-tournament:${id}`
}

function readRegistry(): TournamentMeta[] {
  try {
    const raw = localStorage.getItem(REGISTRY_KEY)
    return raw ? (JSON.parse(raw) as TournamentMeta[]) : []
  } catch {
    return []
  }
}

function writeRegistry(list: TournamentMeta[]) {
  localStorage.setItem(REGISTRY_KEY, JSON.stringify(list))
}

/** First run after this feature shipped: fold any pre-existing single tournament into the registry. */
function migrateLegacyTournament(): TournamentMeta[] {
  const registry = readRegistry()
  if (registry.length > 0) return registry

  const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY)
  if (!legacyRaw) return registry

  let name = 'Meu torneio'
  try {
    const parsed = JSON.parse(legacyRaw)
    name = parsed?.state?.config?.name || name
  } catch {
    // malformed legacy data, fall back to the default name
  }

  const migrated: TournamentMeta[] = [{ id: LEGACY_ID, name, updatedAt: Date.now() }]
  writeRegistry(migrated)
  return migrated
}

export function listTournaments(): TournamentMeta[] {
  return migrateLegacyTournament().sort((a, b) => b.updatedAt - a.updatedAt)
}

export function upsertTournament(id: string, patch: Partial<Omit<TournamentMeta, 'id'>>) {
  const registry = migrateLegacyTournament()
  const existing = registry.find((t) => t.id === id)
  if (existing) {
    Object.assign(existing, patch)
  } else {
    registry.push({ id, name: '', updatedAt: Date.now(), ...patch })
  }
  writeRegistry(registry)
}

export function removeTournament(id: string) {
  writeRegistry(migrateLegacyTournament().filter((t) => t.id !== id))
  localStorage.removeItem(storageKeyFor(id))
}

export function createTournamentId(): string {
  return crypto.randomUUID()
}

export function tournamentUrl(id: string): string {
  const url = new URL(window.location.href)
  url.searchParams.set('t', id)
  return url.toString()
}

/** Reads the `t` id from the URL, falling back to (and stamping the URL with) an existing or brand-new tournament. */
export function resolveActiveTournamentId(): string {
  const params = new URLSearchParams(window.location.search)
  const fromUrl = params.get('t')
  const registry = listTournaments()

  if (fromUrl) {
    if (!registry.some((t) => t.id === fromUrl)) {
      upsertTournament(fromUrl, { updatedAt: Date.now() })
    }
    return fromUrl
  }

  const id = registry[0]?.id ?? createTournamentId()
  if (registry.length === 0) upsertTournament(id, { updatedAt: Date.now() })

  const url = new URL(window.location.href)
  url.searchParams.set('t', id)
  window.history.replaceState({}, '', url)
  return id
}
