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
  
  // Mahsulotlar (Menyu)
  const [menuItems, setMenuItems] = useState(() => getSaved('menuItems', [
    { id: 1, name: 'Cola 0.5', price: 6000 },
    { id: 2, name: 'Fanta 0.5', price: 6000 },
    { id: 3, name: 'Pepsi 0.5', price: 6000 },
    { id: 4, name: 'Choy (idish)', price: 4000 },
    { id: 5, name: 'Kofe', price: 5000 },
    { id: 6, name: 'Chips (Lays)', price: 12000 },
    { id: 7, name: 'Sementer', price: 3000 },
  ]))

  // Xodimlar va Xarajatlar
  const [staff, setStaff] = useState(() => getSaved('staff', []))
  const [expenses, setExpenses] = useState(() => getSaved('expenses', []))

  // Har safar o'zgarganda saqlab borish
  useEffect(() => {
    localStorage.setItem('freeRooms', JSON.stringify(freeRooms))
  }, [freeRooms])

  useEffect(() => {
    localStorage.setItem('activeRooms', JSON.stringify(activeRooms))
  }, [activeRooms])

  useEffect(() => {
    localStorage.setItem('menuItems', JSON.stringify(menuItems))
  }, [menuItems])

  useEffect(() => {
    localStorage.setItem('staff', JSON.stringify(staff))
  }, [staff])

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

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
            menuItems={menuItems}
          />
        )
      case 'booking': return <Booking />
      case 'statistics': return <Statistics />
      case 'clients': return <Clients />
      case 'employer': return (
        <Employer 
          staff={staff} 
          setStaff={setStaff} 
          expenses={expenses} 
          setExpenses={setExpenses} 
        />
      )
      case 'settings': return <Settings menuItems={menuItems} setMenuItems={setMenuItems} />
      default: return <Dashboard 
        freeRooms={freeRooms} 
        setFreeRooms={setFreeRooms} 
        activeRooms={activeRooms} 
        setActiveRooms={setActiveRooms} 
        setActivePage={setActivePage}
        menuItems={menuItems}
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
