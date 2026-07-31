import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createTournamentStore } from './store/tournamentStore'
import { TournamentStoreProvider } from './store/TournamentStoreProvider'
import { resolveActiveTournamentId, storageKeyFor, upsertTournament } from './lib/tournamentRegistry'

const tournamentId = resolveActiveTournamentId()
const store = createTournamentStore(storageKeyFor(tournamentId))

store.subscribe((state) => {
  upsertTournament(tournamentId, { name: state.config.name, updatedAt: Date.now() })
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TournamentStoreProvider store={store}>
      <App />
    </TournamentStoreProvider>
  </StrictMode>,
)
