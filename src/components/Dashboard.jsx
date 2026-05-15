import { useState, useEffect, useCallback } from 'react'
import { Clock, AlertTriangle, Play, DoorOpen, Tv, Users, Activity, Plus } from 'lucide-react'

// ─── Initial data ────────────────────────────────────────────────────────────
// Endi xonalar App.jsx dan keladi

function formatTime(seconds) {
    if (seconds <= 0) return '00:00'
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function formatMoney(num) {
    return num.toLocaleString('uz-UZ') + " so'm"
}

// ─── Timer hook ───────────────────────────────────────────────────────────
function useTimer(countUp = false) {
    const [, setTick] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setTick(t => t + 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    return Date.now()
}

// ─── Active Room Card ─────────────────────────────────────────────────────────
function ActiveRoomCard({ room, onStop }) {
    const now = useTimer()
    const isOchiq = room.isOpen;
    
    // Vaqtni hisoblash
    const diffInSeconds = Math.floor((now - room.startTime) / 1000)
    const timeValue = isOchiq 
        ? diffInSeconds 
        : Math.max(0, Math.floor((room.endTime - now) / 1000))
    
    const isOverdue = !isOchiq && now > room.endTime;
    const overdueSeconds = isOverdue ? Math.floor((now - room.endTime) / 1000) : 0;
    const isWarning = !isOchiq && !isOverdue && timeValue <= 300;
    
    const currentCost = isOchiq 
        ? Math.floor((timeValue / 3600) * room.price) 
        : Math.floor((room.totalSeconds / 3600) * room.price);

    return (
        <div
            className={`relative rounded-2xl p-5 border transition-all duration-300
        ${isOverdue
                    ? 'bg-red-950/40 border-red-500 overdue-card'
                    : isWarning
                        ? 'bg-amber-950/30 border-amber-500/60'
                        : isOchiq ? 'bg-blue-950/20 border-blue-900/50' : 'bg-[#1a1630] border-[#2d2556]'
                }`}
        >
            {/* Overdue Badge */}
            {isOverdue && (
                <div className="absolute -top-3 left-4 flex items-center gap-1 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    <AlertTriangle size={12} />
                    Vaqt o'tdi!
                </div>
            )}

            <div className="flex items-start justify-between mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Tv size={16} className={isOverdue ? 'text-red-400' : isWarning ? 'text-amber-400' : isOchiq ? 'text-blue-400' : 'text-violet-400'} />
                        <span className="text-white font-bold text-base">{room.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium
              ${room.type === 'VIP' ? 'bg-violet-900/60 text-violet-300' : 'bg-indigo-900/60 text-indigo-300'}`}>
                            {room.type}
                        </span>
                    </div>
                    <p className="text-slate-400 text-xs">{room.client} · {formatMoney(room.price)}/soat</p>
                </div>

                <div className={`text-right`}>
                    <p className="text-xs text-slate-500 mb-1">{isOchiq ? "O'tgan vaqt" : "Qolgan vaqt"}</p>
                    <p className={`text-2xl font-mono font-bold
            ${isOverdue ? 'text-red-400' : isWarning ? 'text-amber-400 warn-blink' : isOchiq ? 'text-blue-400' : 'text-emerald-400'}`}>
                        {isOverdue ? '-' + formatTime(overdueSeconds) : formatTime(timeValue)}
                    </p>
                </div>
            </div>

            {/* Progress bar */}
            {!isOchiq && (
                <div className="w-full bg-[#0f0c1e] rounded-full h-1.5 mb-4">
                    <div
                        className={`h-1.5 rounded-full transition-all duration-1000
                ${isOverdue ? 'w-full bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: isOverdue ? '100%' : `${Math.max(0, Math.min(100, (diffInSeconds / room.totalSeconds) * 100))}%` }}
                    />
                </div>
            )}
            
            {/* Open time current cost */}
            {isOchiq && (
                <div className="flex items-center justify-between mb-4 mt-2 bg-blue-950/30 px-3 py-2 rounded-lg border border-blue-900/40">
                    <span className="text-blue-300/70 text-xs font-medium">Joriy hisob:</span>
                    <span className="font-bold text-blue-400">{formatMoney(currentCost)}</span>
                </div>
            )}

            <button
                onClick={() => onStop(room.id, currentCost)}
                className="w-full py-2 rounded-xl bg-[#2d2556] hover:bg-red-900/50 text-slate-300 hover:text-red-300 text-sm font-medium transition-all duration-200 border border-[#3d3470] hover:border-red-700 cursor-pointer"
            >
                Tugatish
            </button>
        </div>
    )
}

// ─── Free Room Card ───────────────────────────────────────────────────────────
function FreeRoomCard({ room, onStart }) {
    return (
        <div className="rounded-2xl p-5 bg-[#1a1630] border border-[#2d2556] hover:border-violet-500/50 transition-all duration-200">
            <div className="flex items-center gap-2 mb-2">
                <DoorOpen size={16} className="text-violet-400" />
                <span className="text-white font-bold text-base">{room.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium
          ${room.type === 'VIP' ? 'bg-violet-900/60 text-violet-300' : 'bg-indigo-900/60 text-indigo-300'}`}>
                    {room.type}
                </span>
            </div>

            <div className="flex items-center justify-between mb-1">
                <span className="text-slate-400 text-xs flex items-center gap-1">
                    <Users size={12} /> {room.capacity} o'rindiq
                </span>
                <span className="text-violet-300 text-sm font-semibold">{formatMoney(room.price)}/soat</span>
            </div>

            <div className="flex items-center gap-1 mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                <span className="text-emerald-400 text-xs font-medium">Bo'sh</span>
            </div>

            <button
                onClick={() => onStart(room)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-violet-900/40 flex items-center justify-center gap-2 cursor-pointer"
            >
                <Play size={14} />
                Boshlash
            </button>
        </div>
    )
}

// ─── Start Room Modal ─────────────────────────────────────────────────────────
function StartModal({ room, onConfirm, onClose }) {
    const [client, setClient] = useState('')
    const [hours, setHours] = useState(null)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-[#1a1630] border border-[#2d2556] rounded-2xl p-6 w-full max-w-sm shadow-2xl shadow-violet-900/30">
                <h3 className="text-white font-bold text-lg mb-1">Xonani boshlash</h3>
                <p className="text-violet-300 text-sm mb-5">{room.name} · {formatMoney(room.price)}/soat</p>

                <label className="block text-slate-400 text-xs mb-1">Mijoz ismi (ixtiyoriy)</label>
                <input
                    value={client}
                    onChange={e => setClient(e.target.value)}
                    placeholder="Ism kiriting..."
                    className="w-full bg-[#0f0c1e] border border-[#2d2556] text-white rounded-xl px-4 py-2.5 text-sm mb-4 outline-none focus:border-violet-500 transition"
                />

                <label className="block text-slate-400 text-xs mb-1">Muddat</label>
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setHours(null)}
                        className={`flex-1 py-2 rounded-xl text-sm font-semibold transition cursor-pointer
            ${hours === null
                                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-900/40'
                                : 'bg-[#2d2556] text-slate-300 hover:bg-[#3d3470]'}`}
                    >
                        Limitsiz
                    </button>
                    {[1, 2, 3].map(h => (
                        <button
                            key={h}
                            onClick={() => setHours(h)}
                            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition cursor-pointer
                ${hours === h
                                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-900/40'
                                    : 'bg-[#2d2556] text-slate-300 hover:bg-[#3d3470]'}`}
                        >
                            {h} soat
                        </button>
                    ))}
                </div>

                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-[#2d2556] text-slate-300 text-sm font-medium hover:bg-[#3d3470] transition cursor-pointer">
                        Bekor
                    </button>
                    <button
                        onClick={() => onConfirm(client, hours)}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold hover:from-violet-500 hover:to-indigo-500 transition shadow-lg shadow-violet-900/40 cursor-pointer"
                    >
                        Boshlash
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Receipt Modal ────────────────────────────────────────────────────────────
function ReceiptModal({ data, onConfirm, onClose }) {
    if (!data) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-[#1a1630] border border-blue-900/50 rounded-2xl p-8 w-full max-w-sm shadow-2xl shadow-blue-900/40 text-center">
                <div className="w-16 h-16 rounded-full bg-blue-900/30 flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                    <Tv size={28} className="text-blue-400" />
                </div>
                <h3 className="text-white font-bold text-xl mb-1">To'lovni qabul qilish</h3>
                <p className="text-blue-300 text-sm mb-6">{data.roomName} – {data.client}</p>
                
                <div className="bg-[#0f0c1e] rounded-xl p-4 mb-6 border border-[#2d2556]">
                    <p className="text-slate-400 text-xs mb-1">Jami to'lov summasi</p>
                    <p className="text-3xl font-bold text-white">{formatMoney(data.cost)}</p>
                </div>
                
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-[#2d2556] text-slate-300 text-sm font-medium hover:bg-[#3d3470] transition cursor-pointer">
                        Bekor qilish
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:from-blue-500 hover:to-indigo-500 transition shadow-lg shadow-blue-900/40 cursor-pointer"
                    >
                        Tugatish
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Add Room Modal ────────────────────────────────────────────────────────────
function AddRoomModal({ onAdd, onClose }) {
    const [name, setName] = useState('')
    const [type, setType] = useState('Oddiy')
    const [price, setPrice] = useState(8000)
    const [capacity, setCapacity] = useState(2)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!name) return
        onAdd({
            id: Date.now(),
            name,
            type,
            price: Number(price),
            capacity: Number(capacity)
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-[#1a1630] border border-[#2d2556] rounded-2xl p-6 w-full max-w-sm shadow-2xl shadow-emerald-900/20">
                <h3 className="text-white font-bold text-lg mb-5">Yangi xona qo'shish</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-slate-400 text-xs mb-1">Xona nomi</label>
                        <input value={name} onChange={e => setName(e.target.value)} required placeholder="Masalan: VIP 1" className="w-full bg-[#0f0c1e] border border-[#2d2556] text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 transition" />
                    </div>
                    <div>
                        <label className="block text-slate-400 text-xs mb-1">Turi</label>
                        <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-[#0f0c1e] border border-[#2d2556] text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 transition">
                            <option value="Oddiy">Oddiy</option>
                            <option value="VIP">VIP</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">Narxi (soatiga)</label>
                            <input type="number" value={price} onChange={e => setPrice(e.target.value)} required className="w-full bg-[#0f0c1e] border border-[#2d2556] text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 transition" />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">O'rindiqlar</label>
                            <input type="number" value={capacity} onChange={e => setCapacity(e.target.value)} required className="w-full bg-[#0f0c1e] border border-[#2d2556] text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 transition" />
                        </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                        <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-[#2d2556] text-slate-300 text-sm font-medium hover:bg-[#3d3470] transition cursor-pointer">Bekor</button>
                        <button type="submit" className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-semibold hover:from-emerald-500 hover:to-teal-500 transition shadow-lg shadow-emerald-900/40 cursor-pointer">Saqlash</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function Dashboard({ freeRooms, setFreeRooms, activeRooms, setActiveRooms, setActivePage }) {
    const [modalRoom, setModalRoom] = useState(null)
    const [receiptData, setReceiptData] = useState(null)
    const [activeFilter, setActiveFilter] = useState('all') // 'all' | 'free' | 'busy' | 'overdue'
    const [showAddRoom, setShowAddRoom] = useState(false)

    const handleAddRoom = (newRoom) => {
        setFreeRooms(prev => [...prev, newRoom])
        setShowAddRoom(false)
    }

    const handleStart = (room) => setModalRoom(room)

    const handleConfirm = (client, hours) => {
        const isOchiq = hours === null;
        const secs = isOchiq ? 0 : hours * 3600;
        const now = Date.now();
        
        setActiveRooms(prev => [...prev, {
            id: modalRoom.id,
            name: modalRoom.name,
            type: modalRoom.type,
            price: modalRoom.price,
            client: client || 'Noma\'lum',
            startTime: now,
            endTime: isOchiq ? null : now + (secs * 1000),
            totalSeconds: isOchiq ? 0 : secs,
            isOpen: isOchiq
        }])
        setFreeRooms(prev => prev.filter(r => r.id !== modalRoom.id))
        setModalRoom(null)
    }

    const handleStop = (id, finalCost) => {
        const stopped = activeRooms.find(r => r.id === id)
        if (stopped) {
            setReceiptData({ roomId: id, client: stopped.client, cost: finalCost, roomName: stopped.name })
        }
    }

    const confirmPayment = () => {
        if (!receiptData) return;
        const id = receiptData.roomId;
        const stopped = activeRooms.find(r => r.id === id)
        if (stopped) {
            setFreeRooms(prev => [...prev, {
                id: stopped.id,
                name: stopped.name,
                type: stopped.type,
                price: stopped.price,
                capacity: stopped.type === 'VIP' ? 4 : 2,
            }].sort((a,b) => a.id - b.id))
            setActiveRooms(prev => prev.filter(r => r.id !== id))
        }
        setReceiptData(null)
    }

    const overdueCount = activeRooms.filter(r => r.secondsLeft <= 0).length
    const warnCount = activeRooms.filter(r => r.secondsLeft > 0 && r.secondsLeft <= 300).length

    return (
        <div className="p-6 min-h-screen">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-white text-2xl font-bold">Dashboard</h1>
                    <p className="text-slate-400 text-sm mt-1">PlayStation Klub – Boshqaruv paneli</p>
                </div>
                <div className="flex items-center gap-3">
                    {overdueCount > 0 && (
                        <button 
                            onClick={() => setActiveFilter('overdue')}
                            className={`flex items-center gap-2 bg-red-900/40 border border-red-600/50 text-red-400 text-sm font-semibold px-4 py-2 rounded-xl cursor-pointer hover:bg-red-900/60 transition-all ${activeFilter === 'overdue' ? 'ring-2 ring-red-500' : ''}`}
                        >
                            <AlertTriangle size={15} />
                            {overdueCount} xona vaqti o'tdi
                        </button>
                    )}
                    {warnCount > 0 && (
                        <div className="flex items-center gap-2 bg-amber-900/40 border border-amber-600/50 text-amber-400 text-sm font-semibold px-4 py-2 rounded-xl warn-blink">
                            <Clock size={15} />
                            {warnCount} xona tugayapti
                        </div>
                    )}
                    <div className="flex items-center gap-2 bg-[#1a1630] border border-[#2d2556] text-slate-400 text-sm px-4 py-2 rounded-xl">
                        <Activity size={15} className="text-emerald-400" />
                        {activeRooms.length} faol
                    </div>
                    <button onClick={() => setShowAddRoom(true)} className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:from-emerald-500 hover:to-teal-500 transition shadow-lg shadow-emerald-900/40 cursor-pointer border border-emerald-500/50">
                        <Plus size={16} /> Xona qo'shish
                    </button>
                </div>
            </div>

            {/* Stats row / Tabs */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                {[
                    { id: 'statistics', label: 'Statistika', value: '→', color: 'from-violet-600 to-indigo-600', isAction: true },
                    { id: 'all', label: 'Jami xonalar', value: freeRooms.length + activeRooms.length, color: 'from-blue-600 to-indigo-600' },
                    { id: 'free', label: 'Bo\'sh xonalar', value: freeRooms.length, color: 'from-emerald-600 to-teal-600' },
                    { id: 'busy', label: 'Band xonalar', value: activeRooms.length, color: 'from-rose-600 to-pink-600' },
                ].map(stat => (
                    <div 
                        key={stat.id} 
                        onClick={() => {
                            if (stat.id === 'statistics') {
                                setActivePage('statistics')
                            } else {
                                setActiveFilter(stat.id)
                            }
                        }}
                        className={`rounded-2xl p-5 flex items-center gap-4 cursor-pointer transition-all duration-300
                            ${(activeFilter === stat.id && !stat.isAction)
                                ? 'bg-[#2d2556] border-violet-500 shadow-lg shadow-violet-900/20' 
                                : 'bg-[#1a1630] border-[#2d2556] hover:bg-[#221c3d]'
                            } border`}
                    >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg transition-transform ${activeFilter === stat.id ? 'scale-110' : ''}`}>
                            <span className="text-white text-xl font-bold">{stat.value}</span>
                        </div>
                        <p className={`text-sm font-medium ${activeFilter === stat.id ? 'text-white' : 'text-slate-400'}`}>{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className={`grid ${activeFilter === 'all' ? 'grid-cols-2' : 'grid-cols-1'} gap-6`}>
                {/* Free Rooms */}
                {(activeFilter === 'all' || activeFilter === 'free') && (
                    <section>
                    <div className="flex items-center gap-2 mb-4">
                        <DoorOpen size={18} className="text-emerald-400" />
                        <h2 className="text-white font-bold text-lg">Bo'sh Xonalar</h2>
                        <span className="ml-auto bg-emerald-900/40 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-700/40">
                            {freeRooms.length} ta
                        </span>
                    </div>
                    {freeRooms.length === 0 ? (
                        <div className="rounded-2xl bg-[#1a1630] border border-[#2d2556] p-8 text-center">
                            <p className="text-slate-500 text-sm">Hamma xonalar band</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {freeRooms.map(room => (
                                <FreeRoomCard key={room.id} room={room} onStart={handleStart} />
                            ))}
                        </div>
                    )}
                    </section>
                )}

                {/* Active Rooms */}
                {(activeFilter === 'all' || activeFilter === 'busy' || activeFilter === 'overdue') && (
                    <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Play size={18} className="text-violet-400" />
                        <h2 className="text-white font-bold text-lg">Band Xonalar</h2>
                        <span className="ml-auto bg-violet-900/40 text-violet-400 text-xs font-bold px-2.5 py-1 rounded-full border border-violet-700/40">
                            {activeRooms.length} ta
                        </span>
                    </div>
                    {activeRooms.length === 0 ? (
                        <div className="rounded-2xl bg-[#1a1630] border border-[#2d2556] p-8 text-center">
                            <p className="text-slate-500 text-sm">Hech qanday xona ishlamayapti</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {activeRooms
                                .filter(r => activeFilter === 'overdue' ? (Date.now() > r.endTime && !r.isOpen) : true)
                                .map(room => (
                                <ActiveRoomCard key={room.id} room={room} onStop={handleStop} />
                            ))}
                        </div>
                    )}
                    </section>
                )}
            </div>

            {/* Modals */}
            {showAddRoom && <AddRoomModal onAdd={handleAddRoom} onClose={() => setShowAddRoom(false)} />}
            {modalRoom && (
                <StartModal room={modalRoom} onConfirm={handleConfirm} onClose={() => setModalRoom(null)} />
            )}
            <ReceiptModal data={receiptData} onConfirm={confirmPayment} onClose={() => setReceiptData(null)} />
        </div>
    )
}
