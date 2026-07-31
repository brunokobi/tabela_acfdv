import type { ReactNode } from 'react'
import type { StoreApi } from 'zustand/vanilla'
import { TournamentStoreContext, type TournamentState } from './tournamentStore'

export function TournamentStoreProvider({
  store,
  children,
}: {
  store: StoreApi<TournamentState>
  children: ReactNode
}) {
  return <TournamentStoreContext.Provider value={store}>{children}</TournamentStoreContext.Provider>
}
