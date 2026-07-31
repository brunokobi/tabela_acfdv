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

      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md dark:bg-neutral-950/80">
        <Header />
        <TabNav active={tab} onChange={setTab} />
      </div>

      <main className="mx-4 my-6 rounded-2xl border border-neutral-200/60 bg-white/70 shadow-xl backdrop-blur-md sm:mx-6 dark:border-neutral-800/60 dark:bg-neutral-900/50">
        {tab === 'config' && <ConfigView />}
        {tab === 'grupos' && <GroupsView />}
        {tab === 'mata-mata' && <KnockoutView />}
      </main>

      <Footer />
    </div>
  )
}

export default App
