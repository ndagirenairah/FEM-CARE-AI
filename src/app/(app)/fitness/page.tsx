import { PageHeader } from "@/components/ui";
import { WORKOUTS } from "@/lib/content";

export default function FitnessPage() {
  return (
    <div>
      <PageHeader emoji="🏃‍♀️" title="Fitness Center" subtitle="Home workouts, yoga, and life-stage-safe programs." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {WORKOUTS.map((w) => (
          <div key={w.slug} className="card">
            <div className="flex items-center justify-between">
              <span className="text-3xl">{w.emoji}</span>
              <span className="chip bg-rose-50 text-slate-500">{w.duration}</span>
            </div>
            <h2 className="mt-2 font-bold text-slate-800">{w.title}</h2>
            <div className="text-xs font-semibold text-pink-600">{w.level}</div>
            <p className="mt-1 text-sm text-slate-500">{w.description}</p>
            <ul className="mt-3 space-y-1 text-sm text-slate-600">
              {w.moves.map((m) => (
                <li key={m} className="flex gap-2">
                  <span className="text-pink-400">✓</span>
                  {m}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
