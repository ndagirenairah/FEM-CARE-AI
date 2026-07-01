"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui";

type Rec = { id: number; title: string; category: string; recordDate: string | null; details: string | null };

const CATEGORIES = ["Lab Result", "Ultrasound", "Prescription", "Vaccination", "Medical Report", "Other"];
const ICONS: Record<string, string> = {
  "Lab Result": "🧪",
  Ultrasound: "🩻",
  Prescription: "📝",
  Vaccination: "💉",
  "Medical Report": "📄",
  Other: "📁",
};

export default function RecordsPage() {
  const [records, setRecords] = useState<Rec[]>([]);
  const [form, setForm] = useState({ title: "", category: "Lab Result", recordDate: "", details: "" });

  async function load() {
    const d = await fetch("/api/records").then((r) => r.json());
    setRecords(d.records || []);
  }
  useEffect(() => {
    load();
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title) return;
    await fetch("/api/records", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm({ title: "", category: "Lab Result", recordDate: "", details: "" });
    load();
  }
  async function del(id: number) {
    await fetch(`/api/records?id=${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <PageHeader emoji="📁" title="Health Records" subtitle="Securely store lab results, prescriptions, scans and reports." />

      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={add} className="card space-y-3">
          <h2 className="font-bold text-slate-800">Add record</h2>
          <div>
            <label className="label">Title</label>
            <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className="label">Category</label>
            <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Date</label>
            <input type="date" className="input" value={form.recordDate} onChange={(e) => setForm({ ...form, recordDate: e.target.value })} />
          </div>
          <div>
            <label className="label">Details</label>
            <textarea className="input min-h-[90px]" placeholder="Key results, values, notes…" value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} />
          </div>
          <button className="btn-primary w-full">Save record</button>
        </form>

        <div className="lg:col-span-2">
          {records.length === 0 ? (
            <div className="card text-sm text-slate-400">No records stored yet.</div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {records.map((r) => (
                <div key={r.id} className="card">
                  <div className="flex items-start justify-between">
                    <span className="text-2xl">{ICONS[r.category] || "📁"}</span>
                    <button onClick={() => del(r.id)} className="text-xs font-semibold text-red-400 hover:text-red-600">
                      Delete
                    </button>
                  </div>
                  <div className="mt-2 font-bold text-slate-800">{r.title}</div>
                  <div className="text-xs text-slate-500">
                    {r.category} {r.recordDate && `· ${new Date(r.recordDate).toLocaleDateString()}`}
                  </div>
                  {r.details && <p className="mt-2 text-sm text-slate-600">{r.details}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
