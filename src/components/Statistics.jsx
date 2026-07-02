import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, DollarSign, Clock, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function Statistics() {
    const [payments, setPayments] = useState([])
    const [clientsCount, setClientsCount] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        setLoading(true)
        try {
            // Payments
            const { data: paymentsData } = await supabase
                .from('payments')
                .select('*')
            if (paymentsData) {
                setPayments(paymentsData)
            }

            // Clients Count
            const { count } = await supabase
                .from('clients')
                .select('*', { count: 'exact', head: true })
            setClientsCount(count || 0)
        } catch (err) {
            console.error(err)
        }
        setLoading(false)
    }

    // Bugungi daromad hisoblash
    const today = new Date().toISOString().split('T')[0]
    const todayPayments = payments.filter(p => {
        if (!p.paid_at) return false
        return p.paid_at.startsWith(today)
    })
    const todayRevenue = todayPayments.reduce((sum, p) => sum + (p.total || 0), 0)

    // Oylik daromad hisoblash
    const currentMonth = new Date().toISOString().substring(0, 7) // YYYY-MM
    const monthlyPayments = payments.filter(p => {
        if (!p.paid_at) return false
        return p.paid_at.startsWith(currentMonth)
    })
    const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + (p.total || 0), 0)

    // Xonalar bo'yicha daromad
    const roomEarnings = {}
    payments.forEach(p => {
        if (!roomEarnings[p.room_name]) {
            roomEarnings[p.room_name] = 0
        }
        roomEarnings[p.room_name] += (p.total || 0)
    })

    const maxEarnings = Math.max(...Object.values(roomEarnings), 1)
    const roomStats = Object.entries(roomEarnings).map(([name, total]) => ({
        name,
        income: total.toLocaleString('uz-UZ') + " so'm",
        usage: Math.round((total / maxEarnings) * 100)
    })).sort((a, b) => b.usage - a.usage)

    const stats = [
        { label: 'Bugungi daromad', value: todayRevenue.toLocaleString('uz-UZ') + " so'm", trend: '+12%', isUp: true, icon: DollarSign, color: 'from-emerald-600 to-teal-600' },
        { label: 'Oylik daromad', value: monthlyRevenue.toLocaleString('uz-UZ') + " so'm", trend: '+8%', isUp: true, icon: TrendingUp, color: 'from-violet-600 to-indigo-600' },
        { label: "O'rtacha seans", value: '2.4 soat', trend: '+4%', isUp: true, icon: Clock, color: 'from-amber-600 to-orange-600' },
        { label: 'Jami ro\'yxatdan o\'tganlar', value: clientsCount + ' ta', trend: 'Nishon', isUp: true, icon: Users, color: 'from-rose-600 to-pink-600' },
    ]

    return (
        <div className="p-6 min-h-screen">
            <div className="mb-8">
                <h1 className="text-white text-2xl font-bold">Statistika</h1>
                <p className="text-slate-400 text-sm mt-1">Klubingiz faoliyati tahlili</p>
            </div>

            {loading ? (
                <div className="text-center py-10">
                    <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-slate-400 text-xs">Yuklanmoqda...</p>
                </div>
            ) : (
                <>
                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-4 gap-4 mb-8">
                        {stats.map((s, i) => (
                            <div key={i} className="rounded-2xl bg-[#1a1630] border border-[#2d2556] p-5">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg`}>
                                        <s.icon size={20} className="text-white" />
                                    </div>
                                    <div className={`flex items-center gap-1 text-xs font-bold ${s.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {s.trend}
                                        {s.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                    </div>
                                </div>
                                <p className="text-slate-500 text-xs mb-1">{s.label}</p>
                                <p className="text-white text-lg font-bold">{s.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        {/* Popular Rooms */}
                        <div className="col-span-2 rounded-2xl bg-[#1a1630] border border-[#2d2556] p-6">
                            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                                <BarChart3 size={18} className="text-violet-400" />
                                Xonalar bo'yicha hisobot
                            </h3>
                            <div className="space-y-6">
                                {roomStats.map((room, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-slate-300 text-sm font-medium">{room.name}</span>
                                            <span className="text-slate-400 text-xs">{room.income}</span>
                                        </div>
                                        <div className="w-full bg-[#0f0c1e] rounded-full h-2">
                                            <div 
                                                className="bg-gradient-to-r from-violet-600 to-indigo-600 h-2 rounded-full transition-all duration-1000 shadow-lg shadow-violet-900/20"
                                                style={{ width: `${room.usage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                                {roomStats.length === 0 && (
                                    <p className="text-slate-500 text-xs text-center py-6">Hozircha ma'lumotlar yo'q</p>
                                )}
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="rounded-2xl bg-gradient-to-br from-indigo-900/40 to-violet-900/40 border border-violet-500/20 p-6 flex flex-col justify-center items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-violet-600/20 flex items-center justify-center mb-4 border border-violet-500/30">
                                <TrendingUp size={30} className="text-violet-400" />
                            </div>
                            <h4 className="text-white font-bold text-lg mb-2">Faoliyat hisoboti</h4>
                            <p className="text-slate-400 text-sm px-4">Bugungi kunda to'lovlar Supabase tarmog'ida muvaffaqiyatli saqlanmoqda.</p>
                            <button onClick={fetchStats} className="mt-6 px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition-all cursor-pointer">
                                Yangilash
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
