"use client";

import { useEffect, useState } from "react";
import { PageHeader, StatCard } from "@/components/ui";
import { LineChart, BarChart } from "@/components/Charts";

type Log = { logDate: string; mood: number | null; stress: number | null; sleepHours: number | null; waterMl: number | null; exerciseMin: number | null; weightKg: number | null; symptoms: string[] | null };
type Cycle = { startDate: string };

export default function ReportsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [cycles, setCycles] = useState<Cycle[]>([]);

  useEffect(() => {
    Promise.all([fetch("/api/daily").then((r) => r.json()), fetch("/api/cycles").then((r) => r.json())]).then(([d1, d2]) => {
      setLogs((d1.logs || []).slice().reverse());
      setCycles(d2.cycles || []);
    });
  }, []);

  const avg = (arr: (number | null)[]) => {
    const v = arr.filter((x): x is number => x != null);
    return v.length ? (v.reduce((a, b) => a + b, 0) / v.length).toFixed(1) : "—";
  };

  const symptomCounts: Record<string, number> = {};
  logs.forEach((l) => (l.symptoms || []).forEach((s) => (symptomCounts[s] = (symptomCounts[s] || 0) + 1)));
  const topSymptoms = Object.entries(symptomCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);

  const label = (d: string) => d.slice(5);

  return (
    <div>
      <PageHeader emoji="📊" title="Reports & Analytics" subtitle="Long-term trends across your health and lifestyle." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Avg Mood" value={`${avg(logs.map((l) => l.mood))}/5`} icon="💗" />
        <StatCard label="Avg Sleep" value={`${avg(logs.map((l) => l.sleepHours))}h`} icon="😴" />
        <StatCard label="Avg Water" value={`${avg(logs.map((l) => l.waterMl))}ml`} icon="💧" />
        <StatCard label="Cycles Logged" value={cycles.length} icon="🩸" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="mb-3 font-bold text-slate-800">Mood over time</h2>
          <LineChart data={logs.map((l) => ({ label: label(l.logDate), value: l.mood }))} color="#db2777" />
        </div>
        <div className="card">
          <h2 className="mb-3 font-bold text-slate-800">Stress over time</h2>
          <LineChart data={logs.map((l) => ({ label: label(l.logDate), value: l.stress }))} color="#ef4444" />
        </div>
        <div className="card">
          <h2 className="mb-3 font-bold text-slate-800">Sleep (hours)</h2>
          <LineChart data={logs.map((l) => ({ label: label(l.logDate), value: l.sleepHours }))} color="#7c3aed" unit="h" />
        </div>
        <div className="card">
          <h2 className="mb-3 font-bold text-slate-800">Exercise (minutes)</h2>
          <BarChart data={logs.slice(-14).map((l) => ({ label: label(l.logDate), value: l.exerciseMin }))} color="#16a34a" />
        </div>
        <div className="card">
          <h2 className="mb-3 font-bold text-slate-800">Weight trend (kg)</h2>
          <LineChart data={logs.map((l) => ({ label: label(l.logDate), value: l.weightKg }))} color="#0ea5e9" />
        </div>
        <div className="card">
          <h2 className="mb-3 font-bold text-slate-800">Most frequent symptoms</h2>
          {topSymptoms.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-xl bg-rose-50 text-sm text-slate-400">No symptom data yet.</div>
          ) : (
            <div className="space-y-2">
              {topSymptoms.map(([s, c]) => (
                <div key={s} className="flex items-center gap-3">
                  <span className="w-32 text-sm text-slate-600">{s}</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-rose-100">
                    <div className="h-full bg-pink-500" style={{ width: `${(c / topSymptoms[0][1]) * 100}%` }} />
                  </div>
                  <span className="w-6 text-right text-xs text-slate-400">{c}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card mt-6">
        <h2 className="mb-2 font-bold text-slate-800">Monthly Summary</h2>
        <p className="text-sm text-slate-600">
          You have {logs.length} wellness check-ins and {cycles.length} logged cycles. Keep logging daily to unlock richer
          insights and more accurate predictions. Your averages: mood {avg(logs.map((l) => l.mood))}/5, sleep{" "}
          {avg(logs.map((l) => l.sleepHours))}h, water {avg(logs.map((l) => l.waterMl))}ml.
        </p>
      </div>
    </div>
  );
}
