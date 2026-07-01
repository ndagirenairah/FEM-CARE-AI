"use client";

import { useEffect, useState } from "react";
import { PageHeader, StatCard } from "@/components/ui";

type Cycle = {
  id: number;
  startDate: string;
  endDate: string | null;
  flow: string | null;
  crampLevel: number | null;
  pmsLevel: number | null;
  notes: string | null;
};

type Prediction = {
  avgCycleLength: number;
  avgPeriodLength: number;
  nextPeriodStart: string | null;
  ovulationDate: string | null;
  fertileStart: string | null;
  fertileEnd: string | null;
  currentDay: number | null;
  phase: string | null;
  daysUntilNextPeriod: number | null;
};

export default function CyclePage() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [pred, setPred] = useState<Prediction | null>(null);
  const [form, setForm] = useState({ startDate: "", endDate: "", flow: "Medium", crampLevel: "0", pmsLevel: "0", notes: "" });

  async function load() {
    const d = await fetch("/api/cycles").then((r) => r.json());
    setCycles(d.cycles);
    setPred(d.prediction);
  }
  useEffect(() => {
    load();
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.startDate) return;
    await fetch("/api/cycles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ startDate: "", endDate: "", flow: "Medium", crampLevel: "0", pmsLevel: "0", notes: "" });
    load();
  }

  async function del(id: number) {
    await fetch(`/api/cycles?id=${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <PageHeader emoji="🩸" title="Menstrual Health Center" subtitle="Track periods, flow, symptoms and get cycle predictions." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Current Phase" value={pred?.phase || "—"} sub={pred?.currentDay ? `Cycle day ${pred.currentDay}` : ""} icon="🌙" />
        <StatCard label="Next Period" value={pred?.nextPeriodStart || "—"} sub={pred?.daysUntilNextPeriod != null && pred.daysUntilNextPeriod >= 0 ? `in ${pred.daysUntilNextPeriod} days` : ""} icon="📆" />
        <StatCard label="Fertile Window" value={pred?.fertileStart ? `${fmt(pred.fertileStart)}–${fmt(pred.fertileEnd)}` : "—"} sub="Estimated" icon="🌸" />
        <StatCard label="Ovulation" value={pred?.ovulationDate ? fmt(pred.ovulationDate) : "—"} sub={`Avg cycle ${pred?.avgCycleLength ?? 28}d`} icon="🥚" />
      </div>

      {pred && (
        <div className="card mt-6">
          <h2 className="mb-3 font-bold text-slate-800">Cycle Timeline</h2>
          <CycleBar pred={pred} />
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <form onSubmit={add} className="card space-y-3 lg:col-span-1">
          <h2 className="font-bold text-slate-800">Log a Period</h2>
          <div>
            <label className="label">Start date</label>
            <input type="date" className="input" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
          </div>
          <div>
            <label className="label">End date (optional)</label>
            <input type="date" className="input" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          </div>
          <div>
            <label className="label">Flow</label>
            <select className="input" value={form.flow} onChange={(e) => setForm({ ...form, flow: e.target.value })}>
              {["Light", "Medium", "Heavy", "Spotting"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Cramps (0-5)</label>
              <input type="number" min={0} max={5} className="input" value={form.crampLevel} onChange={(e) => setForm({ ...form, crampLevel: e.target.value })} />
            </div>
            <div>
              <label className="label">PMS (0-5)</label>
              <input type="number" min={0} max={5} className="input" value={form.pmsLevel} onChange={(e) => setForm({ ...form, pmsLevel: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea className="input" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <button className="btn-primary w-full">Save (+10 pts)</button>
        </form>

        <div className="card lg:col-span-2">
          <h2 className="mb-3 font-bold text-slate-800">History</h2>
          {cycles.length === 0 ? (
            <p className="text-sm text-slate-400">No cycles logged yet. Add your last period to begin predictions.</p>
          ) : (
            <div className="space-y-2">
              {cycles.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-xl bg-rose-50 px-4 py-3">
                  <div>
                    <div className="font-medium text-slate-800">
                      {fmt(c.startDate)} {c.endDate ? `→ ${fmt(c.endDate)}` : ""}
                    </div>
                    <div className="text-xs text-slate-500">
                      {c.flow ? `Flow: ${c.flow}` : ""} {c.crampLevel ? `· Cramps ${c.crampLevel}/5` : ""} {c.pmsLevel ? `· PMS ${c.pmsLevel}/5` : ""}
                    </div>
                    {c.notes && <div className="text-xs text-slate-400">{c.notes}</div>}
                  </div>
                  <button onClick={() => del(c.id)} className="text-xs font-semibold text-red-400 hover:text-red-600">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function fmt(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function CycleBar({ pred }: { pred: Prediction }) {
  const total = pred.avgCycleLength;
  const period = pred.avgPeriodLength;
  const seg = (from: number, to: number, color: string, label: string) => (
    <div
      className={`${color} flex items-center justify-center text-[9px] font-semibold text-white`}
      style={{ width: `${((to - from) / total) * 100}%` }}
      title={label}
    >
      <span className="hidden sm:inline">{label}</span>
    </div>
  );
  return (
    <div>
      <div className="flex h-8 overflow-hidden rounded-xl">
        {seg(0, period, "bg-pink-500", "Period")}
        {seg(period, total - 16, "bg-rose-200", "Follicular")}
        {seg(total - 16, total - 12, "bg-fuchsia-500", "Fertile")}
        {seg(total - 12, total, "bg-purple-300", "Luteal")}
      </div>
      {pred.currentDay && (
        <div className="mt-2 text-xs text-slate-500">
          You are on <span className="font-bold text-pink-600">day {pred.currentDay}</span> — {pred.phase} phase.
        </div>
      )}
    </div>
  );
}
