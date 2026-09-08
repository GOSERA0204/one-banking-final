import { useState } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'

import Header from './components/common/Header'
import BottomNav from './components/common/BottomNav'
import LockScreen from './components/auth/LockScreen'

import HomePage from './pages/HomePage'
import TransferPage from './pages/TransferPage'
import TransferManualEntryPage from './pages/TransferManualEntryPage'
import HistoryPage from './pages/HistoryPage'
import AllMenuPage from './pages/AllMenuPage'

import './styles/common.css'
//

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false)

  return (
    <HashRouter>
      <div className="mobile-container">
        {isUnlocked ? (
          <>
            <Header />

            <main className="page-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/transfer" element={<TransferPage />} />
                <Route path="/transfer/manual" element={<TransferManualEntryPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/all" element={<AllMenuPage />} />
              </Routes>
            </main>

            <BottomNav />
          </>
        ) : (
          <LockScreen onUnlock={() => setIsUnlocked(true)} />
        )}
      </div>
    </HashRouter>
  )
}

export default App