"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui";
import { LineChart } from "@/components/Charts";

const SYMPTOMS = ["Cramps", "Headache", "Bloating", "Fatigue", "Acne", "Breast tenderness", "Nausea", "Back pain", "Cravings", "Insomnia"];
const MOODS = [
  { v: 1, e: "😢", l: "Awful" },
  { v: 2, e: "😕", l: "Low" },
  { v: 3, e: "😐", l: "Okay" },
  { v: 4, e: "🙂", l: "Good" },
  { v: 5, e: "😄", l: "Great" },
];
const BREATHING = [
  { name: "Box Breathing", steps: "Inhale 4s → Hold 4s → Exhale 4s → Hold 4s", emoji: "🟦" },
  { name: "4-7-8 Calm", steps: "Inhale 4s → Hold 7s → Exhale 8s", emoji: "🌬️" },
  { name: "Belly Breathing", steps: "Slow deep breaths into your belly, 2 min", emoji: "🫁" },
];

type Log = { logDate: string; mood: number | null; stress: number | null; sleepHours: number | null; waterMl: number | null; exerciseMin: number | null };

export default function WellnessPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({ mood: "", stress: "", sleepHours: "", waterMl: "", exerciseMin: "", weightKg: "", notes: "", symptoms: [] as string[] });
  const [journal, setJournal] = useState({ mood: "", gratitude: "", content: "" });
  const [logs, setLogs] = useState<Log[]>([]);
  const [entries, setEntries] = useState<{ id: number; entryDate: string; gratitude: string | null; content: string | null; mood: number | null }[]>([]);
  const [saved, setSaved] = useState("");

  async function load() {
    const [d1, d2] = await Promise.all([
      fetch("/api/daily").then((r) => r.json()),
      fetch("/api/journal").then((r) => r.json()),
    ]);
    setLogs(d1.logs || []);
    setEntries(d2.entries || []);
    const t = (d1.logs || []).find((l: Log) => l.logDate === today);
    if (t) {
      setForm((f) => ({
        ...f,
        mood: t.mood?.toString() || "",
        stress: t.stress?.toString() || "",
        sleepHours: t.sleepHours?.toString() || "",
        waterMl: t.waterMl?.toString() || "",
        exerciseMin: t.exerciseMin?.toString() || "",
      }));
    }
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function saveDaily(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/daily", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, logDate: today }),
    });
    setSaved("check-in");
    setTimeout(() => setSaved(""), 2000);
    load();
  }

  async function saveJournal(e: React.FormEvent) {
    e.preventDefault();
    if (!journal.content && !journal.gratitude) return;
    await fetch("/api/journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(journal),
    });
    setJournal({ mood: "", gratitude: "", content: "" });
    setSaved("journal");
    setTimeout(() => setSaved(""), 2000);
    load();
  }

  const toggleSymptom = (s: string) =>
    setForm((f) => ({ ...f, symptoms: f.symptoms.includes(s) ? f.symptoms.filter((x) => x !== s) : [...f.symptoms, s] }));

  const chron = [...logs].reverse();
  const moodTrend = chron.map((l) => ({ label: l.logDate.slice(5), value: l.mood }));
  const sleepTrend = chron.map((l) => ({ label: l.logDate.slice(5), value: l.sleepHours }));

  return (
    <div>
      <PageHeader emoji="💗" title="Mental Wellness & Daily Check-in" subtitle="Track mood, sleep, stress and habits — plus journaling and relaxation." />

      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={saveDaily} className="card space-y-4 lg:col-span-2">
          <h2 className="font-bold text-slate-800">Today&apos;s Check-in</h2>
          <div>
            <label className="label">Mood</label>
            <div className="flex gap-2">
              {MOODS.map((m) => (
                <button
                  type="button"
                  key={m.v}
                  onClick={() => setForm({ ...form, mood: String(m.v) })}
                  className={`flex-1 rounded-xl py-2 text-2xl transition ${form.mood === String(m.v) ? "bg-pink-100 ring-2 ring-pink-400" : "bg-rose-50"}`}
                  title={m.l}
                >
                  {m.e}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <label className="label">Stress (0-5)</label>
              <input type="number" min={0} max={5} className="input" value={form.stress} onChange={(e) => setForm({ ...form, stress: e.target.value })} />
            </div>
            <div>
              <label className="label">Sleep (h)</label>
              <input type="number" step="0.5" className="input" value={form.sleepHours} onChange={(e) => setForm({ ...form, sleepHours: e.target.value })} />
            </div>
            <div>
              <label className="label">Water (ml)</label>
              <input type="number" className="input" value={form.waterMl} onChange={(e) => setForm({ ...form, waterMl: e.target.value })} />
            </div>
            <div>
              <label className="label">Exercise (min)</label>
              <input type="number" className="input" value={form.exerciseMin} onChange={(e) => setForm({ ...form, exerciseMin: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Symptoms</label>
            <div className="flex flex-wrap gap-2">
              {SYMPTOMS.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => toggleSymptom(s)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${form.symptoms.includes(s) ? "bg-pink-600 text-white" : "bg-rose-50 text-slate-600 hover:bg-rose-100"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-primary">Save check-in</button>
            {saved === "check-in" && <span className="text-sm font-semibold text-green-600">✓ Saved</span>}
          </div>
        </form>

        <div className="card">
          <h2 className="mb-3 font-bold text-slate-800">🌬️ Relaxation</h2>
          <div className="space-y-2">
            {BREATHING.map((b) => (
              <div key={b.name} className="rounded-xl bg-rose-50 px-4 py-3">
                <div className="font-medium text-slate-800">{b.emoji} {b.name}</div>
                <div className="text-xs text-slate-500">{b.steps}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="mb-3 font-bold text-slate-800">Mood trend</h2>
          <LineChart data={moodTrend} color="#db2777" />
        </div>
        <div className="card">
          <h2 className="mb-3 font-bold text-slate-800">Sleep trend</h2>
          <LineChart data={sleepTrend} color="#7c3aed" unit="h" />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <form onSubmit={saveJournal} className="card space-y-3">
          <h2 className="font-bold text-slate-800">📔 Journal</h2>
          <div>
            <label className="label">Grateful for…</label>
            <input className="input" value={journal.gratitude} onChange={(e) => setJournal({ ...journal, gratitude: e.target.value })} />
          </div>
          <div>
            <label className="label">Reflections</label>
            <textarea className="input min-h-[90px]" value={journal.content} onChange={(e) => setJournal({ ...journal, content: e.target.value })} />
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-primary">Save entry (+8 pts)</button>
            {saved === "journal" && <span className="text-sm font-semibold text-green-600">✓ Saved</span>}
          </div>
        </form>

        <div className="card">
          <h2 className="mb-3 font-bold text-slate-800">Recent entries</h2>
          {entries.length === 0 ? (
            <p className="text-sm text-slate-400">No journal entries yet.</p>
          ) : (
            <div className="space-y-2">
              {entries.slice(0, 6).map((e) => (
                <div key={e.id} className="rounded-xl bg-rose-50 px-4 py-2">
                  <div className="text-xs font-semibold text-slate-400">{new Date(e.entryDate).toLocaleDateString()}</div>
                  {e.gratitude && <div className="text-sm text-slate-700">🙏 {e.gratitude}</div>}
                  {e.content && <div className="text-sm text-slate-600">{e.content}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
