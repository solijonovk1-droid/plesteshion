import { useState } from 'react'
import { Briefcase, UserPlus, Shield, Clock, Phone, Mail, MoreHorizontal, Trash2 } from 'lucide-react'

const INITIAL_STAFF = []

export default function Employer() {
    const [staff, setStaff] = useState(INITIAL_STAFF)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ name: '', role: 'Operator', phone: '' })

    const handleAdd = () => {
        if (!form.name || !form.phone) return
        setStaff(prev => [...prev, { ...form, id: Date.now(), status: 'Dam olmoqda', email: form.name.toLowerCase().replace(' ', '.') + '@psclub.uz' }])
        setForm({ name: '', role: 'Operator', phone: '' })
        setShowForm(false)
    }

    return (
        <div className="p-6 min-h-screen">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-white text-2xl font-bold">Xodimlar</h1>
                    <p className="text-slate-400 text-sm mt-1">Klub xodimlari va ularning rollari</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold hover:from-violet-500 hover:to-indigo-500 transition shadow-lg shadow-violet-900/40 cursor-pointer"
                >
                    <UserPlus size={16} /> Xodim qo'shish
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {staff.map(s => (
                    <div key={s.id} className="rounded-2xl bg-[#1a1630] border border-[#2d2556] p-5 flex items-center justify-between hover:border-violet-500/30 transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2d2556] to-[#1a1630] border border-[#3d3470] flex items-center justify-center text-violet-400 font-bold group-hover:from-violet-600 group-hover:to-indigo-600 group-hover:text-white transition-all duration-300">
                                {s.name[0]}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="text-white font-bold">{s.name}</p>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border 
                                        ${s.role === 'Admin' ? 'bg-amber-900/20 text-amber-500 border-amber-800/30' : 'bg-blue-900/20 text-blue-500 border-blue-800/30'}`}>
                                        {s.role}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 mt-1">
                                    <p className="text-slate-500 text-xs flex items-center gap-1">
                                        <Phone size={10} /> {s.phone}
                                    </p>
                                    <p className="text-slate-500 text-xs flex items-center gap-1">
                                        <Mail size={10} /> {s.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                    <span className={`w-2 h-2 rounded-full ${s.status === 'Ishda' ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
                                    <p className={`text-xs font-medium ${s.status === 'Ishda' ? 'text-emerald-400' : 'text-slate-400'}`}>{s.status}</p>
                                </div>
                                <p className="text-slate-500 text-[10px] mt-0.5">So'nggi faollik: 2 soat avval</p>
                            </div>
                            <button className="p-2 rounded-lg bg-[#2d2556] text-slate-400 hover:text-white transition cursor-pointer">
                                <MoreHorizontal size={16} />
                            </button>
                            <button onClick={() => setStaff(prev => prev.filter(x => x.id !== s.id))} className="p-2 rounded-lg bg-red-900/10 text-red-500/50 hover:text-red-500 hover:bg-red-900/20 transition cursor-pointer">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="bg-[#1a1630] border border-[#2d2556] rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                        <h3 className="text-white font-bold text-lg mb-5">Yangi xodim qo'shish</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-slate-400 text-xs mb-1">Ism familiya</label>
                                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    placeholder="Ism kiriting..." className="w-full bg-[#0f0c1e] border border-[#2d2556] text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-500 transition" />
                            </div>
                            <div>
                                <label className="block text-slate-400 text-xs mb-1">Lavozim</label>
                                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                                    className="w-full bg-[#0f0c1e] border border-[#2d2556] text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-500 transition">
                                    <option value="Admin">Admin</option>
                                    <option value="Operator">Operator</option>
                                    <option value="Kassir">Kassir</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-slate-400 text-xs mb-1">Telefon</label>
                                <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                    placeholder="+998 90 000 00 00" className="w-full bg-[#0f0c1e] border border-[#2d2556] text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-500 transition" />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl bg-[#2d2556] text-slate-300 text-sm hover:bg-[#3d3470] transition cursor-pointer">Bekor</button>
                            <button onClick={handleAdd} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold hover:from-violet-500 hover:to-indigo-500 transition shadow-lg shadow-violet-900/40 cursor-pointer">Saqlash</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
