import { useState } from 'react'
import { Save, Store, Clock, DollarSign, Wifi, Bell } from 'lucide-react'

import { Trash2, PlusCircle } from 'lucide-react'

export default function Settings({ menuItems, setMenuItems }) {
    const [newProduct, setNewProduct] = useState({ name: '', price: '' })
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

                {/* Product Management */}
                <div className="rounded-2xl bg-[#1a1630] border border-[#2d2556] p-6 shadow-xl overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <PlusCircle size={18} className="text-emerald-400" />
                            <h2 className="text-white font-semibold">Mahsulotlarni boshqarish</h2>
                        </div>
                    </div>
                    
                    {/* Add new product form */}
                    <div className="flex gap-2 mb-6 bg-[#0f0c1e] p-3 rounded-xl border border-[#2d2556]">
                        <input 
                            placeholder="Nomi..." 
                            value={newProduct.name}
                            onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))}
                            className="bg-transparent text-white text-xs outline-none flex-1 px-2" 
                        />
                        <input 
                            type="number" 
                            placeholder="Narxi..." 
                            value={newProduct.price}
                            onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))}
                            className="bg-transparent text-white text-xs outline-none w-24 px-2 border-l border-[#2d2556]" 
                        />
                        <button 
                            type="button"
                            onClick={() => {
                                if (!newProduct.name || !newProduct.price) return
                                setMenuItems(prev => [...prev, { id: Date.now(), name: newProduct.name, price: Number(newProduct.price) }])
                                setNewProduct({ name: '', price: '' })
                            }}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition cursor-pointer"
                        >
                            Qo'shish
                        </button>
                    </div>

                    {/* Products List */}
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {menuItems.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-[#1a1630] border border-[#2d2556] rounded-xl hover:bg-[#221c3d] group transition">
                                <div className="flex flex-col">
                                    <span className="text-white text-sm font-medium">{item.name}</span>
                                    <span className="text-slate-500 text-[10px] font-mono">{item.price.toLocaleString()} so'm</span>
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => setMenuItems(prev => prev.filter(i => i.id !== item.id))}
                                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        {menuItems.length === 0 && (
                            <p className="text-slate-500 text-xs text-center py-8">Hozircha mahsulotlar yo'q</p>
                        )}
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
