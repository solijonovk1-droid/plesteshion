import { useState } from 'react'
import { BarChart3, TrendingUp, DollarSign, Clock, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react'

export default function Statistics() {
    const stats = [
        { label: 'Bugungi daromad', value: "0 so'm", trend: '0%', isUp: true, icon: DollarSign, color: 'from-emerald-600 to-teal-600' },
        { label: 'Oylik daromad', value: "0 so'm", trend: '0%', isUp: true, icon: TrendingUp, color: 'from-violet-600 to-indigo-600' },
        { label: "O'rtacha seans", value: '0 soat', trend: '0%', isUp: true, icon: Clock, color: 'from-amber-600 to-orange-600' },
        { label: 'Faol mijozlar', value: '0 ta', trend: '0%', isUp: true, icon: Users, color: 'from-rose-600 to-pink-600' },
    ]

    const roomStats = []

    return (
        <div className="p-6 min-h-screen">
            <div className="mb-8">
                <h1 className="text-white text-2xl font-bold">Statistika</h1>
                <p className="text-slate-400 text-sm mt-1">Klubingiz faoliyati tahlili</p>
            </div>

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
                    </div>
                </div>

                {/* Additional Info */}
                <div className="rounded-2xl bg-gradient-to-br from-indigo-900/40 to-violet-900/40 border border-violet-500/20 p-6 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-violet-600/20 flex items-center justify-center mb-4 border border-violet-500/30">
                        <TrendingUp size={30} className="text-violet-400" />
                    </div>
                    <h4 className="text-white font-bold text-lg mb-2">Ajoyib ko'rsatkich!</h4>
                    <p className="text-slate-400 text-sm px-4">Bugungi daromad o'tgan haftaga nisbatan 12% ga ko'p.</p>
                    <button className="mt-6 px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition-all cursor-pointer">
                        Batafsil ko'rish
                    </button>
                </div>
            </div>
        </div>
    )
}
