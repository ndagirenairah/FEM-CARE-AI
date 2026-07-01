"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StatCard, Ring } from "@/components/ui";
import { LineChart } from "@/components/Charts";

type Dash = {
  user: { name: string; points: number; streak: number } | null;
  healthScore: number;
  prediction: {
    phase: string | null;
    currentDay: number | null;
    nextPeriodStart: string | null;
    daysUntilNextPeriod: number | null;
    fertileStart: string | null;
    fertileEnd: string | null;
    avgCycleLength: number;
  };
  todayLog: { waterMl: number | null; sleepHours: number | null; exerciseMin: number | null; mood: number | null } | null;
  recentLogs: { logDate: string; mood: number | null; sleepHours: number | null }[];
  medications: { id: number; name: string; timeOfDay: string | null; kind: string }[];
  appointments: { id: number; title: string; apptDate: string; doctor: string | null }[];
  badges: { name: string; emoji: string; earned: boolean }[];
  reminders: { icon: string; text: string }[];
};

const MOOD_EMOJI = ["", "😢", "😕", "😐", "🙂", "😄"];

export default function DashboardPage() {
  const [data, setData] = useState<Dash | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) return <div className="py-20 text-center text-slate-400">Loading your dashboard…</div>;

  const p = data.prediction;
  const moodTrend = data.recentLogs.map((l) => ({ label: l.logDate.slice(5), value: l.mood }));

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-pink-600 to-fuchsia-600 p-6 text-white shadow-lg">
        <h1 className="text-2xl font-black">Welcome back, {data.user?.name?.split(" ")[0] || "there"} 🌸</h1>
        <p className="mt-1 text-pink-100">Here&apos;s your health snapshot for today.</p>
      </div>

      {/* Top stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card flex items-center gap-4">
          <Ring value={data.healthScore} size={92} />
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Health Score</div>
            <div className="text-sm text-slate-500">Based on your assessment & habits</div>
          </div>
        </div>
        <StatCard label="Cycle Phase" value={p.phase || "—"} sub={p.currentDay ? `Day ${p.currentDay}` : "Log a cycle"} icon="🩸" />
        <StatCard
          label="Next Period"
          value={p.daysUntilNextPeriod !== null && p.daysUntilNextPeriod >= 0 ? `${p.daysUntilNextPeriod}d` : "—"}
          sub={p.nextPeriodStart || "Add cycle data"}
          icon="📆"
        />
        <StatCard label="Streak" value={`${data.user?.streak ?? 0} days`} sub={`${data.user?.points ?? 0} wellness points`} icon="🔥" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Reminders */}
        <div className="card lg:col-span-2">
          <h2 className="mb-3 font-bold text-slate-800">🔔 Today&apos;s Reminders</h2>
          <div className="space-y-2">
            {data.reminders.length === 0 && <p className="text-sm text-slate-400">You&apos;re all caught up! 🎉</p>}
            {data.reminders.map((r, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-slate-700">
                <span className="text-lg">{r.icon}</span>
                {r.text}
              </div>
            ))}
          </div>

          <h2 className="mb-3 mt-6 font-bold text-slate-800">Today&apos;s Check-in</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MiniStat label="Water" value={data.todayLog?.waterMl ? `${data.todayLog.waterMl}ml` : "—"} icon="💧" />
            <MiniStat label="Sleep" value={data.todayLog?.sleepHours ? `${data.todayLog.sleepHours}h` : "—"} icon="😴" />
            <MiniStat label="Exercise" value={data.todayLog?.exerciseMin ? `${data.todayLog.exerciseMin}m` : "—"} icon="🏃‍♀️" />
            <MiniStat label="Mood" value={data.todayLog?.mood ? MOOD_EMOJI[data.todayLog.mood] : "—"} icon="💗" />
          </div>
          <Link href="/wellness" className="btn-primary mt-4 w-full">
            Log today&apos;s wellness
          </Link>
        </div>

        {/* Quick AI */}
        <div className="card">
          <h2 className="mb-3 font-bold text-slate-800">🤖 AI Copilot</h2>
          <div className="space-y-2">
            <Link href="/assessment" className="block rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium hover:bg-rose-100">
              🧪 Take health assessment
            </Link>
            <Link href="/symptom-checker" className="block rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium hover:bg-rose-100">
              🔎 Check my symptoms
            </Link>
            <Link href="/chat" className="block rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium hover:bg-rose-100">
              💬 Ask the chatbot
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <h2 className="mb-3 font-bold text-slate-800">Mood trend (last logs)</h2>
          <LineChart data={moodTrend} color="#db2777" />
        </div>
        <div className="card">
          <h2 className="mb-3 font-bold text-slate-800">🏆 Badges</h2>
          <div className="grid grid-cols-4 gap-2">
            {data.badges.map((b) => (
              <div key={b.name} className={`flex flex-col items-center rounded-xl p-2 text-center ${b.earned ? "bg-fuchsia-50" : "opacity-40 grayscale"}`} title={b.name}>
                <span className="text-2xl">{b.emoji}</span>
                <span className="mt-1 text-[9px] leading-tight text-slate-500">{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-slate-800">💊 Active Reminders</h2>
            <Link href="/medications" className="text-xs font-semibold text-pink-600">Manage</Link>
          </div>
          {data.medications.length === 0 ? (
            <p className="text-sm text-slate-400">No medication reminders yet.</p>
          ) : (
            <ul className="space-y-2">
              {data.medications.slice(0, 5).map((m) => (
                <li key={m.id} className="flex items-center justify-between rounded-xl bg-rose-50 px-4 py-2 text-sm">
                  <span>{m.name}</span>
                  <span className="text-xs text-slate-500">{m.timeOfDay || m.kind}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-slate-800">📅 Upcoming Appointments</h2>
            <Link href="/appointments" className="text-xs font-semibold text-pink-600">Manage</Link>
          </div>
          {data.appointments.length === 0 ? (
            <p className="text-sm text-slate-400">No upcoming appointments.</p>
          ) : (
            <ul className="space-y-2">
              {data.appointments.map((a) => (
                <li key={a.id} className="rounded-xl bg-rose-50 px-4 py-2 text-sm">
                  <div className="font-medium">{a.title}</div>
                  <div className="text-xs text-slate-500">
                    {new Date(a.apptDate).toLocaleString()} {a.doctor ? `· ${a.doctor}` : ""}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="rounded-xl bg-rose-50 p-3 text-center">
      <div className="text-lg">{icon}</div>
      <div className="mt-1 text-sm font-bold text-slate-800">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-slate-400">{label}</div>
    </div>
  );
}
