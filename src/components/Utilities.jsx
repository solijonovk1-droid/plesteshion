import React from 'react';
import { Zap, Flame, Sun, Droplet } from 'lucide-react';

// Utility payment data (placeholder). You can replace with real data later.
const utilities = [
  { id: 'electricity', name: "Elektr energiyasi", icon: Zap, amount: 120000 },
  { id: 'gas', name: "Gaz", icon: Flame, amount: 80000 },
  { id: 'light', name: "Svet (yoritish)", icon: Sun, amount: 40000 },
  { id: 'water', name: "Suv", icon: Droplet, amount: 60000 },
];

function formatMoney(num) {
  return num.toLocaleString('uz-UZ') + " so'm";
}

export default function Utilities() {
  return (
    <div className="rounded-2xl p-5 bg-[#1a1630] border border-[#2d2556] mb-6">
      <h2 className="text-white font-bold text-lg mb-4">Kommunal to'lovlar</h2>
      <div className="grid grid-cols-2 gap-4">
        {utilities.map((u) => {
          const Icon = u.icon;
          return (
            <div key={u.id} className="flex items-center gap-3 p-3 bg-[#0f0c1e] rounded-lg border border-[#2d2556]">
              <Icon className="text-emerald-400" size={20} />
              <div className="flex-1">
                <p className="text-slate-300 text-sm">{u.name}</p>
                <p className="text-white font-medium">{formatMoney(u.amount)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
