import { useState } from 'react'
import { Save, Store, Clock, DollarSign, Wifi, Bell } from 'lucide-react'

export default function Settings() {
    const [settings, setSettings] = useState({
        clubName: 'ProPlay PlayStation Club',
        address: 'Toshkent sh., Chilonzor tumani',
        openTime: '09:00',
        closeTime: '24:00',
        vipPrice: '15000',
        regularPrice: '8000',
        warnMinutes: '5',
        autoNotify: true,
    })
    const [saved, setSaved] = useState(false)

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    const inputCls = "w-full bg-[#0f0c1e] border border-[#2d2556] text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-500 transition"

    return (
        <div className="p-6 min-h-screen max-w-2xl">
            <div className="mb-8">
                <h1 className="text-white text-2xl font-bold">Sozlamalar</h1>
                <p className="text-slate-400 text-sm mt-1">Klub konfiguratsiyasi</p>
            </div>

            <div className="space-y-4">
                {/* Club info */}
                <div className="rounded-2xl bg-[#1a1630] border border-[#2d2556] p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <Store size={16} className="text-violet-400" />
                        <h2 className="text-white font-semibold">Klub ma'lumotlari</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">Klub nomi</label>
                            <input value={settings.clubName} onChange={e => setSettings(s => ({ ...s, clubName: e.target.value }))} className={inputCls} />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">Manzil</label>
                            <input value={settings.address} onChange={e => setSettings(s => ({ ...s, address: e.target.value }))} className={inputCls} />
                        </div>
                    </div>
                </div>

                {/* Working hours */}
                <div className="rounded-2xl bg-[#1a1630] border border-[#2d2556] p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <Clock size={16} className="text-violet-400" />
                        <h2 className="text-white font-semibold">Ish vaqti</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">Ochilish</label>
                            <input type="time" value={settings.openTime} onChange={e => setSettings(s => ({ ...s, openTime: e.target.value }))} className={inputCls} />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">Yopilish</label>
                            <input type="time" value={settings.closeTime} onChange={e => setSettings(s => ({ ...s, closeTime: e.target.value }))} className={inputCls} />
                        </div>
                    </div>
                </div>

                {/* Prices */}
                <div className="rounded-2xl bg-[#1a1630] border border-[#2d2556] p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <DollarSign size={16} className="text-violet-400" />
                        <h2 className="text-white font-semibold">Narxlar (soatiga, so'm)</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">VIP xona</label>
                            <input type="number" value={settings.vipPrice} onChange={e => setSettings(s => ({ ...s, vipPrice: e.target.value }))} className={inputCls} />
                        </div>
                        <div>
                            <label className="block text-slate-400 text-xs mb-1">Oddiy zal</label>
                            <input type="number" value={settings.regularPrice} onChange={e => setSettings(s => ({ ...s, regularPrice: e.target.value }))} className={inputCls} />
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="rounded-2xl bg-[#1a1630] border border-[#2d2556] p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <Bell size={16} className="text-violet-400" />
                        <h2 className="text-white font-semibold">Ogohlantirishlar</h2>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-white text-sm font-medium">Avtomatik ogohlantirish</p>
                            <p className="text-slate-500 text-xs">Vaqt tugashidan oldin xabar berish</p>
                        </div>
                        <button
                            onClick={() => setSettings(s => ({ ...s, autoNotify: !s.autoNotify }))}
                            className={`relative w-12 h-6 rounded-full transition-all duration-300 cursor-pointer
                ${settings.autoNotify ? 'bg-violet-600' : 'bg-[#2d2556]'}`}
                        >
                            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300
                ${settings.autoNotify ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>
                    <div>
                        <label className="block text-slate-400 text-xs mb-1">Ogohlantirish (daqiqa oldin)</label>
                        <input type="number" value={settings.warnMinutes} onChange={e => setSettings(s => ({ ...s, warnMinutes: e.target.value }))} className={inputCls} />
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg
            ${saved
                            ? 'bg-emerald-600 text-white shadow-emerald-900/40'
                            : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 shadow-violet-900/40'
                        }`}
                >
                    <Save size={16} />
                    {saved ? 'Saqlandi ✓' : 'Saqlash'}
                </button>
            </div>
        </div>
    )
}
