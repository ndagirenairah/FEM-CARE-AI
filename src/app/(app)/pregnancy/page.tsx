"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui";
import { PREGNANCY_WEEKS, HOSPITAL_BAG } from "@/lib/content";

export default function PregnancyPage() {
  const [week, setWeek] = useState(20);
  const [kicks, setKicks] = useState(0);
  const [contractions, setContractions] = useState<number[]>([]);

  const info = [...PREGNANCY_WEEKS].reverse().find((w) => week >= w.week) || PREGNANCY_WEEKS[0];
  const progress = Math.min(100, (week / 40) * 100);

  const lastGap =
    contractions.length >= 2 ? Math.round((contractions[contractions.length - 1] - contractions[contractions.length - 2]) / 1000) : null;

  return (
    <div>
      <PageHeader emoji="🤰" title="Pregnancy Hub" subtitle="Track your journey week by week with helpful tools." />

      <div className="card">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-800">Pregnancy Tracker</h2>
          <span className="chip bg-pink-100 text-pink-700">Week {week} of 40</span>
        </div>
        <input type="range" min={1} max={40} value={week} onChange={(e) => setWeek(Number(e.target.value))} className="mt-4 w-full accent-pink-600" />
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-rose-100">
          <div className="h-full bg-gradient-to-r from-pink-500 to-fuchsia-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-4 rounded-2xl bg-rose-50 p-4">
          <div className="text-sm font-semibold text-pink-600">Baby is about the size of a {info.size} 🍼</div>
          <p className="mt-1 text-sm text-slate-600">{info.note}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card text-center">
          <h2 className="font-bold text-slate-800">👣 Kick Counter</h2>
          <div className="my-4 text-5xl font-black text-pink-600">{kicks}</div>
          <div className="flex justify-center gap-2">
            <button onClick={() => setKicks(kicks + 1)} className="btn-primary">Count kick</button>
            <button onClick={() => setKicks(0)} className="btn-ghost">Reset</button>
          </div>
          <p className="mt-3 text-xs text-slate-400">Aim to feel 10 movements within 2 hours.</p>
        </div>

        <div className="card text-center">
          <h2 className="font-bold text-slate-800">⏱️ Contraction Timer</h2>
          <div className="my-4 text-3xl font-black text-pink-600">
            {lastGap !== null ? `${lastGap}s apart` : "—"}
          </div>
          <div className="flex justify-center gap-2">
            <button onClick={() => setContractions([...contractions, Date.now()])} className="btn-primary">Log contraction</button>
            <button onClick={() => setContractions([])} className="btn-ghost">Reset</button>
          </div>
          <p className="mt-3 text-xs text-slate-400">{contractions.length} logged. Call your provider if ~5 min apart.</p>
        </div>

        <div className="card">
          <h2 className="font-bold text-slate-800">🎒 Hospital Bag</h2>
          <ul className="mt-3 space-y-1 text-sm text-slate-600">
            {HOSPITAL_BAG.map((h) => (
              <li key={h} className="flex gap-2">
                <span className="text-pink-400">☐</span>
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card mt-6 border-l-4 border-red-400">
        <h2 className="font-bold text-slate-800">⚠️ Call your provider urgently if you have</h2>
        <p className="mt-1 text-sm text-slate-600">
          Heavy bleeding, severe headache or vision changes, severe abdominal pain, significant swelling, fluid leakage, or reduced fetal movement.
        </p>
      </div>
    </div>
  );
}
