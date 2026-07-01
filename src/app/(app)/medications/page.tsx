"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui";

type Med = {
  id: number;
  name: string;
  dosage: string | null;
  kind: string;
  timeOfDay: string | null;
  frequency: string | null;
  active: boolean;
  refillDate: string | null;
};

const KINDS = [
  { v: "medication", l: "Medication 💊" },
  { v: "vitamin", l: "Vitamin 🍊" },
  { v: "birth-control", l: "Birth Control 🌀" },
  { v: "supplement", l: "Supplement 🌿" },
];

export default function MedicationsPage() {
  const [meds, setMeds] = useState<Med[]>([]);
  const [form, setForm] = useState({ name: "", dosage: "", kind: "medication", timeOfDay: "Morning", frequency: "Daily", refillDate: "" });

  async function load() {
    const d = await fetch("/api/medications").then((r) => r.json());
    setMeds(d.medications || []);
  }
  useEffect(() => {
    load();
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name) return;
    await fetch("/api/medications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm({ name: "", dosage: "", kind: "medication", timeOfDay: "Morning", frequency: "Daily", refillDate: "" });
    load();
  }
  async function toggle(m: Med) {
    await fetch("/api/medications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: m.id, active: !m.active }) });
    load();
  }
  async function del(id: number) {
    await fetch(`/api/medications?id=${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <PageHeader emoji="💊" title="Medication Center" subtitle="Track medications, vitamins, birth control and refills." />

      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={add} className="card space-y-3">
          <h2 className="font-bold text-slate-800">Add reminder</h2>
          <div>
            <label className="label">Name</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="label">Dosage</label>
            <input className="input" placeholder="e.g. 500mg" value={form.dosage} onChange={(e) => setForm({ ...form, dosage: e.target.value })} />
          </div>
          <div>
            <label className="label">Type</label>
            <select className="input" value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })}>
              {KINDS.map((k) => (
                <option key={k.v} value={k.v}>{k.l}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Time</label>
              <select className="input" value={form.timeOfDay} onChange={(e) => setForm({ ...form, timeOfDay: e.target.value })}>
                {["Morning", "Noon", "Evening", "Night"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Frequency</label>
              <select className="input" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}>
                {["Daily", "Twice daily", "Weekly", "As needed"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Refill date</label>
            <input type="date" className="input" value={form.refillDate} onChange={(e) => setForm({ ...form, refillDate: e.target.value })} />
          </div>
          <button className="btn-primary w-full">Add</button>
        </form>

        <div className="lg:col-span-2">
          {meds.length === 0 ? (
            <div className="card text-sm text-slate-400">No reminders yet.</div>
          ) : (
            <div className="space-y-3">
              {meds.map((m) => (
                <div key={m.id} className={`card flex items-center justify-between ${!m.active && "opacity-60"}`}>
                  <div>
                    <div className="font-bold text-slate-800">
                      {m.name} {m.dosage && <span className="text-sm font-normal text-slate-500">· {m.dosage}</span>}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2 text-xs">
                      <span className="chip bg-rose-50 text-slate-600">{m.kind}</span>
                      {m.timeOfDay && <span className="chip bg-rose-50 text-slate-600">⏰ {m.timeOfDay}</span>}
                      {m.frequency && <span className="chip bg-rose-50 text-slate-600">🔁 {m.frequency}</span>}
                      {m.refillDate && <span className="chip bg-amber-50 text-amber-700">Refill {new Date(m.refillDate).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggle(m)} className="rounded-lg bg-rose-100 px-3 py-1.5 text-xs font-semibold text-pink-700">
                      {m.active ? "Pause" : "Resume"}
                    </button>
                    <button onClick={() => del(m.id)} className="text-xs font-semibold text-red-400 hover:text-red-600">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
