"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui";

type Appt = { id: number; title: string; doctor: string | null; location: string | null; apptDate: string; notes: string | null };

export default function AppointmentsPage() {
  const [appts, setAppts] = useState<Appt[]>([]);
  const [form, setForm] = useState({ title: "", doctor: "", location: "", apptDate: "", notes: "" });

  async function load() {
    const d = await fetch("/api/appointments").then((r) => r.json());
    setAppts(d.appointments || []);
  }
  useEffect(() => {
    load();
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.apptDate) return;
    await fetch("/api/appointments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setForm({ title: "", doctor: "", location: "", apptDate: "", notes: "" });
    load();
  }
  async function del(id: number) {
    await fetch(`/api/appointments?id=${id}`, { method: "DELETE" });
    load();
  }

  const now = Date.now();
  const upcoming = appts.filter((a) => new Date(a.apptDate).getTime() >= now).sort((a, b) => +new Date(a.apptDate) - +new Date(b.apptDate));
  const past = appts.filter((a) => new Date(a.apptDate).getTime() < now);

  return (
    <div>
      <PageHeader emoji="📅" title="Appointments" subtitle="Book and track your healthcare visits." />

      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={add} className="card space-y-3">
          <h2 className="font-bold text-slate-800">New appointment</h2>
          <div>
            <label className="label">Title</label>
            <input className="input" placeholder="e.g. Gynecologist visit" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className="label">Doctor</label>
            <input className="input" value={form.doctor} onChange={(e) => setForm({ ...form, doctor: e.target.value })} />
          </div>
          <div>
            <label className="label">Location</label>
            <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div>
            <label className="label">Date & time</label>
            <input type="datetime-local" className="input" value={form.apptDate} onChange={(e) => setForm({ ...form, apptDate: e.target.value })} required />
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea className="input" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <button className="btn-primary w-full">Book</button>
        </form>

        <div className="space-y-6 lg:col-span-2">
          <div>
            <h2 className="mb-2 font-bold text-slate-800">Upcoming</h2>
            {upcoming.length === 0 ? (
              <div className="card text-sm text-slate-400">No upcoming appointments.</div>
            ) : (
              <div className="space-y-3">
                {upcoming.map((a) => (
                  <ApptCard key={a.id} a={a} del={del} />
                ))}
              </div>
            )}
          </div>
          {past.length > 0 && (
            <div>
              <h2 className="mb-2 font-bold text-slate-800">Visit history</h2>
              <div className="space-y-3">
                {past.map((a) => (
                  <ApptCard key={a.id} a={a} del={del} muted />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ApptCard({ a, del, muted }: { a: Appt; del: (id: number) => void; muted?: boolean }) {
  return (
    <div className={`card flex items-start justify-between ${muted && "opacity-70"}`}>
      <div>
        <div className="font-bold text-slate-800">{a.title}</div>
        <div className="text-sm text-pink-600">{new Date(a.apptDate).toLocaleString()}</div>
        <div className="text-xs text-slate-500">
          {a.doctor && `${a.doctor} `}
          {a.location && `· ${a.location}`}
        </div>
        {a.notes && <div className="mt-1 text-xs text-slate-400">{a.notes}</div>}
      </div>
      <button onClick={() => del(a.id)} className="text-xs font-semibold text-red-400 hover:text-red-600">
        Delete
      </button>
    </div>
  );
}
