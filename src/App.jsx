import { HashRouter, Routes, Route } from 'react-router-dom'

import Header from './components/common/Header'
import BottomNav from './components/common/BottomNav'

import HomePage from './pages/HomePage'
import TransferPage from './pages/TransferPage'
import TransferManualEntryPage from './pages/TransferManualEntryPage'
import HistoryPage from './pages/HistoryPage'

import './styles/common.css'

function App() {
  return (
    <HashRouter>
      <div className="mobile-container">
        <Header />

        <main className="page-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/transfer" element={<TransferPage />} />
            <Route path="/transfer/manual" element={<TransferManualEntryPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </main>

        <BottomNav />
      </div>
    </HashRouter>
  )
}

export default App