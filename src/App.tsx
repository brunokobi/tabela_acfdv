import { useState } from 'react'
import { ParallaxBackground } from './components/layout/ParallaxBackground'
import { Header } from './components/layout/Header'
import { TabNav, type TabId } from './components/layout/TabNav'
import { Footer } from './components/layout/Footer'
import { ConfigView } from './components/config/ConfigView'
import { GroupsView } from './components/groups/GroupsView'
import { KnockoutView } from './components/knockout/KnockoutView'

function App() {
  const [tab, setTab] = useState<TabId>('config')

  return (
    <div className="relative min-h-svh">
      <ParallaxBackground />

      <div className="sticky top-0 z-20 border-b border-green-500/20 bg-black/25 shadow-[0_1px_20px_-4px_rgba(34,197,94,0.25)]">
        <Header />
        <TabNav active={tab} onChange={setTab} />
      </div>

      <main className="px-4 py-6 sm:px-6">
        {tab === 'config' && <ConfigView />}
        {tab === 'grupos' && <GroupsView />}
        {tab === 'mata-mata' && <KnockoutView />}
      </main>

      <Footer />
    </div>
  )
}

export default App
