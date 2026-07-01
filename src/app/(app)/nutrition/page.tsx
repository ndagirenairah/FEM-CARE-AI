import { PageHeader } from "@/components/ui";
import { NUTRITION_PLANS } from "@/lib/content";

export default function NutritionPage() {
  return (
    <div>
      <PageHeader emoji="🥗" title="Nutrition Center" subtitle="Personalized meal plans, recipes and grocery lists." />

      <div className="card mb-6 flex items-center gap-4 bg-gradient-to-r from-sky-50 to-cyan-50">
        <span className="text-3xl">💧</span>
        <div>
          <div className="font-bold text-slate-800">Water Reminder</div>
          <div className="text-sm text-slate-500">Aim for ~2 liters (8 glasses) a day. Log your intake in Wellness.</div>
        </div>
      </div>

      <div className="space-y-6">
        {NUTRITION_PLANS.map((p) => (
          <div key={p.slug} className="card">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{p.emoji}</span>
              <div>
                <h2 className="font-bold text-slate-800">{p.title}</h2>
                <p className="text-sm text-slate-500">{p.focus}</p>
              </div>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400">Key Foods</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {p.keyFoods.map((f) => (
                    <span key={f} className="chip bg-green-50 text-green-700">{f}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400">Sample Day</h3>
                <ul className="mt-2 space-y-1 text-sm text-slate-600">
                  {p.sampleDay.map((m) => (
                    <li key={m.meal}>
                      <span className="font-semibold">{m.meal}:</span> {m.item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-400">Grocery List</h3>
                <ul className="mt-2 space-y-1 text-sm text-slate-600">
                  {p.grocery.map((g) => (
                    <li key={g} className="flex gap-2">
                      <span className="text-pink-400">☐</span>
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
