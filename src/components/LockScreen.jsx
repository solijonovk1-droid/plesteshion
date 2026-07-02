import React, { useState } from 'react'
import { Lock, Delete, ArrowRight, ShieldCheck } from 'lucide-react'

export default function LockScreen({ onUnlock }) {
    const [pin, setPin] = useState('')
    const [error, setError] = useState(false)
    
    // Default PIN: 7777 (Siz buni sozlamalardan o'zgartirishingiz mumkin)
    const CORRECT_PIN = localStorage.getItem('lockPin') || '7777'

    const handleKeyPress = (num) => {
        if (pin.length < 4) {
            setError(false)
            setPin(prev => prev + num)
        }
    }

    const handleClear = () => {
        setPin('')
        setError(false)
    }

    const handleBackspace = () => {
        setPin(prev => prev.slice(0, -1))
        setError(false)
    }

    const handleSubmit = () => {
        if (pin === CORRECT_PIN) {
            onUnlock()
        } else {
            setError(true)
            setPin('')
            // Vibratsiya/silkinish effekti uchun
            setTimeout(() => setError(false), 800)
        }
    }

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#07050e] text-white select-none">
            {/* Background glowing circles */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />

            <div className="text-center mb-8 relative z-10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-900/50">
                    <Lock size={26} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight mb-1">Tizim qulflangan</h1>
                <p className="text-slate-400 text-sm">Davom etish uchun operator PIN-kodini kiriting</p>
                <p className="text-violet-400/50 text-[10px] mt-1">(Standart PIN: 7777)</p>
            </div>

            {/* Display digits */}
            <div className="flex gap-4 mb-8 justify-center items-center h-12 relative z-10">
                {[0, 1, 2, 3].map((index) => (
                    <div 
                        key={index}
                        className={`w-4 h-4 rounded-full border-2 transition-all duration-200 
                            ${error 
                                ? 'border-red-500 bg-red-500 animate-bounce' 
                                : pin.length > index
                                    ? 'border-violet-500 bg-violet-500 shadow-md shadow-violet-500/50 scale-110'
                                    : 'border-[#2d2556] bg-transparent'}`}
                    />
                ))}
            </div>

            {/* Keyboard */}
            <div className="grid grid-cols-3 gap-4 max-w-[280px] w-full relative z-10">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                        key={num}
                        onClick={() => handleKeyPress(num.toString())}
                        className="w-16 h-16 rounded-full bg-[#13102a] border border-[#2d2556] hover:bg-violet-600/20 hover:border-violet-500/60 active:scale-95 text-xl font-bold flex items-center justify-center transition cursor-pointer select-none"
                    >
                        {num}
                    </button>
                ))}
                
                {/* Clear */}
                <button
                    onClick={handleClear}
                    className="w-16 h-16 rounded-full bg-[#13102a]/40 text-slate-500 hover:text-white text-sm font-semibold flex items-center justify-center transition cursor-pointer select-none"
                >
                    Tozalash
                </button>

                {/* 0 */}
                <button
                    onClick={() => handleKeyPress('0')}
                    className="w-16 h-16 rounded-full bg-[#13102a] border border-[#2d2556] hover:bg-violet-600/20 hover:border-violet-500/60 active:scale-95 text-xl font-bold flex items-center justify-center transition cursor-pointer select-none"
                >
                    0
                </button>

                {/* Backspace / Delete */}
                <button
                    onClick={handleBackspace}
                    className="w-16 h-16 rounded-full bg-[#13102a]/40 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer select-none"
                >
                    <Delete size={20} />
                </button>
            </div>

            {/* Unlock Button */}
            {pin.length === 4 && (
                <button
                    onClick={handleSubmit}
                    className="mt-8 flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold transition shadow-lg shadow-violet-900/40 animate-fade-in cursor-pointer"
                >
                    <ShieldCheck size={18} />
                    Kirish
                </button>
            )}
        </div>
    )
}
