import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Booking from './components/Booking'
import Clients from './components/Clients'
import Settings from './components/Settings'
import Statistics from './components/Statistics'
import Employer from './components/Employer'
import Utilities from './components/Utilities'
import Login from './components/Login'
import './index.css'

export default function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const [user, setUser] = useState(null)
  
  // Xonalar holati
  const [freeRooms, setFreeRooms] = useState([])
  const [activeRooms, setActiveRooms] = useState([])
  
  // Mahsulotlar (Menyu)
  const [menuItems, setMenuItems] = useState([])

  // Xodimlar va Xarajatlar
  const [staff, setStaff] = useState([])
  const [expenses, setExpenses] = useState([])

  // Loading holati
  const [loading, setLoading] = useState(true)

  // ─── Auth holati ──────────────────────────────────────────────
  useEffect(() => {
    // Birinchi session tekshiruvi
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        loadAllData()
      } else {
        setLoading(false)
      }
    })

    // Auth o'zgarishlarini kuzatish (faqat logout uchun)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null)
        setFreeRooms([])
        setActiveRooms([])
        setMenuItems([])
        setStaff([])
        setExpenses([])
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadAllData = async () => {
    setLoading(true)
    try {
      const [roomsRes, sessionsRes, menuRes, staffRes, expRes] = await Promise.allSettled([
        supabase.from('rooms').select('*').order('id'),
        supabase.from('sessions').select('*').order('id'),
        supabase.from('menu_items').select('*').order('id'),
        supabase.from('staff').select('*').order('id'),
        supabase.from('expenses').select('*').order('created_at', { ascending: false })
      ])

      if (roomsRes.value?.data) setFreeRooms(roomsRes.value.data)
      if (sessionsRes.value?.data) {
        setActiveRooms(sessionsRes.value.data.map(s => ({
          id: s.id,
          name: s.room_name,
          type: s.room_type,
          price: s.room_price,
          client: s.client,
          startTime: s.start_time,
          endTime: s.end_time,
          totalSeconds: s.total_seconds,
          isOpen: s.is_open,
          orders: s.orders || [],
          roomId: s.room_id
        })))
      }
      if (menuRes.value?.data) setMenuItems(menuRes.value.data)
      if (staffRes.value?.data) setStaff(staffRes.value.data)
      if (expRes.value?.data) setExpenses(expRes.value.data)

    } catch (err) {
      console.error('Supabase yuklash xatosi:', err)
    } finally {
      setLoading(false)
    }
  }

  // ─── Xonalar uchun CRUD ───────────────────────────────────────
  const addFreeRoom = async (room) => {
    const { data, error } = await supabase.from('rooms').insert([{
      name: room.name,
      type: room.type,
      price: room.price,
      capacity: room.capacity
    }]).select()
    if (data) setFreeRooms(prev => [...prev, data[0]])
  }

  const removeFreeRoom = async (id) => {
    await supabase.from('rooms').delete().eq('id', id)
    setFreeRooms(prev => prev.filter(r => r.id !== id))
  }

  // ─── Seans boshlash / tugatish ────────────────────────────────
  const startSession = async (room, client, hours) => {
    const isOchiq = hours === null
    const secs = isOchiq ? 0 : hours * 3600
    const now = Date.now()

    const sessionData = {
      room_id: room.id,
      room_name: room.name,
      room_type: room.type,
      room_price: room.price,
      client: client || "Noma'lum",
      start_time: now,
      end_time: isOchiq ? null : now + (secs * 1000),
      total_seconds: isOchiq ? 0 : secs,
      is_open: isOchiq,
      orders: []
    }

    const { data, error } = await supabase.from('sessions').insert([sessionData]).select()
    if (data) {
      setActiveRooms(prev => [...prev, {
        id: data[0].id,
        name: room.name,
        type: room.type,
        price: room.price,
        client: client || "Noma'lum",
        startTime: now,
        endTime: isOchiq ? null : now + (secs * 1000),
        totalSeconds: isOchiq ? 0 : secs,
        isOpen: isOchiq,
        orders: [],
        roomId: room.id
      }])
      // Xonani bo'sh ro'yxatdan o'chirish
      await supabase.from('rooms').delete().eq('id', room.id)
      setFreeRooms(prev => prev.filter(r => r.id !== room.id))
    }
  }

  const stopSession = async (sessionId, roomData) => {
    // Seansni o'chirish
    await supabase.from('sessions').delete().eq('id', sessionId)
    setActiveRooms(prev => prev.filter(r => r.id !== sessionId))

    // Xonani qaytarish
    const { data } = await supabase.from('rooms').insert([{
      name: roomData.name,
      type: roomData.type,
      price: roomData.price,
      capacity: roomData.type === 'VIP' ? 4 : 2
    }]).select()
    if (data) {
      setFreeRooms(prev => [...prev, data[0]].sort((a, b) => a.id - b.id))
    }
  }

  const addOrderToSession = async (sessionId, item) => {
    const session = activeRooms.find(r => r.id === sessionId)
    if (!session) return

    const existingIdx = (session.orders || []).findIndex(o => o.id === item.id)
    let newOrders = [...(session.orders || [])]
    if (existingIdx > -1) {
      newOrders[existingIdx] = {
        ...newOrders[existingIdx],
        quantity: newOrders[existingIdx].quantity + item.quantity
      }
    } else {
      newOrders.push(item)
    }

    await supabase.from('sessions').update({ orders: newOrders }).eq('id', sessionId)
    setActiveRooms(prev => prev.map(r =>
      r.id === sessionId ? { ...r, orders: newOrders } : r
    ))
  }

  // ─── To'lov saqlash ───────────────────────────────────────────
  const savePayment = async (paymentData) => {
    await supabase.from('payments').insert([paymentData])
  }

  // ─── Menyu CRUD ───────────────────────────────────────────────
  const addMenuItem = async (item) => {
    const { data } = await supabase.from('menu_items').insert([{
      name: item.name,
      price: item.price
    }]).select()
    if (data) setMenuItems(prev => [...prev, data[0]])
  }

  const removeMenuItem = async (id) => {
    await supabase.from('menu_items').delete().eq('id', id)
    setMenuItems(prev => prev.filter(i => i.id !== id))
  }

  // ─── Xodimlar CRUD ───────────────────────────────────────────
  const addStaff = async (s) => {
    const { data } = await supabase.from('staff').insert([{
      name: s.name,
      role: s.role,
      phone: s.phone,
      email: s.name.toLowerCase().replace(' ', '.') + '@psclub.uz',
      status: 'Ishda'
    }]).select()
    if (data) setStaff(prev => [...prev, data[0]])
  }

  const removeStaff = async (id) => {
    await supabase.from('staff').delete().eq('id', id)
    setStaff(prev => prev.filter(s => s.id !== id))
  }

  // ─── Xarajatlar CRUD ─────────────────────────────────────────
  const addExpense = async (exp) => {
    const { data } = await supabase.from('expenses').insert([{
      staff_id: exp.staffId,
      staff_name: exp.staffName,
      amount: exp.amount,
      reason: exp.reason,
      date: exp.date
    }]).select()
    if (data) setExpenses(prev => [data[0], ...prev])
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-[#0f0c1e] items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-violet-400 text-sm">Yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': 
        return (
          <Dashboard 
            freeRooms={freeRooms} 
            setFreeRooms={setFreeRooms}
            addFreeRoom={addFreeRoom}
            removeFreeRoom={removeFreeRoom}
            activeRooms={activeRooms} 
            setActiveRooms={setActiveRooms}
            startSession={startSession}
            stopSession={stopSession}
            addOrderToSession={addOrderToSession}
            savePayment={savePayment}
            setActivePage={setActivePage}
            menuItems={menuItems}
          />
        )
      case 'booking': return <Booking />
      case 'statistics': return <Statistics />
      case 'clients': return <Clients />
      case 'utilities': return <Utilities />
      case 'employer': return (
        <Employer 
          staff={staff} 
          setStaff={setStaff}
          addStaff={addStaff}
          removeStaff={removeStaff}
          expenses={expenses} 
          setExpenses={setExpenses}
          addExpense={addExpense}
        />
      )
      case 'settings': return (
        <Settings 
          menuItems={menuItems} 
          setMenuItems={setMenuItems}
          addMenuItem={addMenuItem}
          removeMenuItem={removeMenuItem}
        />
      )
      default: return (
        <Dashboard 
          freeRooms={freeRooms} 
          setFreeRooms={setFreeRooms}
          addFreeRoom={addFreeRoom}
          removeFreeRoom={removeFreeRoom}
          activeRooms={activeRooms} 
          setActiveRooms={setActiveRooms}
          startSession={startSession}
          stopSession={stopSession}
          addOrderToSession={addOrderToSession}
          savePayment={savePayment}
          setActivePage={setActivePage}
          menuItems={menuItems}
        />
      )
    }
  }

  const handleLogout = async () => {
    if (window.confirm("Tizimdan chiqishni xohlaysizmi?")) {
      await supabase.auth.signOut()
    }
  }

  if (!user) {
    return (
      <Login
        onLoginSuccess={(u) => {
          setUser(u)
          loadAllData()
        }}
      />
    )
  }

  return (
    <div className="flex h-screen bg-[#0f0c1e] overflow-hidden">
      <Sidebar activePage={activePage} setActivePage={setActivePage} onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  )
}
