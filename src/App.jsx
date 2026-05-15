import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Booking from './components/Booking'
import Clients from './components/Clients'
import Settings from './components/Settings'
import Statistics from './components/Statistics'
import Employer from './components/Employer'
import './index.css'

// ─── Initial Logic for Persistence ───────────────────────────────────────────
const getSaved = (key, def) => {
  const saved = localStorage.getItem(key)
  return saved ? JSON.parse(saved) : def
}

export default function App() {
  const [activePage, setActivePage] = useState('dashboard')
  
  // Xonalar holati
  const [freeRooms, setFreeRooms] = useState(() => getSaved('freeRooms', []))
  const [activeRooms, setActiveRooms] = useState(() => getSaved('activeRooms', []))

  // Har safar o'zgarganda saqlab borish
  useEffect(() => {
    localStorage.setItem('freeRooms', JSON.stringify(freeRooms))
  }, [freeRooms])

  useEffect(() => {
    localStorage.setItem('activeRooms', JSON.stringify(activeRooms))
  }, [activeRooms])

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': 
        return (
          <Dashboard 
            freeRooms={freeRooms} 
            setFreeRooms={setFreeRooms} 
            activeRooms={activeRooms} 
            setActiveRooms={setActiveRooms} 
            setActivePage={setActivePage}
          />
        )
      case 'booking': return <Booking />
      case 'statistics': return <Statistics />
      case 'clients': return <Clients />
      case 'employer': return <Employer />
      case 'settings': return <Settings />
      default: return <Dashboard 
        freeRooms={freeRooms} 
        setFreeRooms={setFreeRooms} 
        activeRooms={activeRooms} 
        setActiveRooms={setActiveRooms} 
        setActivePage={setActivePage}
      />
    }
  }

  return (
    <div className="flex h-screen bg-[#0f0c1e] overflow-hidden">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  )
}
