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

      <div className="sticky top-0 z-20 border-b border-green-500/20 bg-black/90 shadow-[0_1px_20px_-4px_rgba(34,197,94,0.25)] backdrop-blur-md">
        <Header />
        <TabNav active={tab} onChange={setTab} />
      </div>

      <main className="mx-4 my-6 rounded-2xl border border-green-500/20 bg-black/70 shadow-xl backdrop-blur-md sm:mx-6">
        {tab === 'config' && <ConfigView />}
        {tab === 'grupos' && <GroupsView />}
        {tab === 'mata-mata' && <KnockoutView />}
      </main>

      <Footer />
    </div>
  )
}

export default App
