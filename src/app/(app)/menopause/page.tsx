import { PageHeader } from "@/components/ui";

const SYMPTOMS = ["Hot flashes", "Night sweats", "Sleep problems", "Mood changes", "Vaginal dryness", "Brain fog", "Joint aches", "Irregular periods"];
const TIPS = [
  { icon: "🌡️", title: "Manage hot flashes", text: "Dress in layers, keep a cool bedroom, and identify triggers like caffeine, alcohol and spicy food." },
  { icon: "🦴", title: "Protect your bones", text: "Prioritize calcium, vitamin D, and weight-bearing/strength exercise to reduce osteoporosis risk." },
  { icon: "😴", title: "Sleep better", text: "Keep a consistent schedule, limit screens before bed, and try relaxation or breathing exercises." },
  { icon: "❤️", title: "Heart health", text: "Estrogen decline raises cardiovascular risk — stay active, eat well, and monitor blood pressure." },
];

export default function MenopausePage() {
  return (
    <div>
      <PageHeader emoji="🌸" title="Menopause Hub" subtitle="Guidance and tracking for the menopause transition." />

      <div className="card">
        <h2 className="font-bold text-slate-800">Common Symptoms to Track</h2>
        <p className="mt-1 text-sm text-slate-500">Log these in your daily Wellness check-in to spot patterns over time.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {SYMPTOMS.map((s) => (
            <span key={s} className="chip bg-rose-50 text-slate-600">{s}</span>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {TIPS.map((t) => (
          <div key={t.title} className="card">
            <div className="text-3xl">{t.icon}</div>
            <h3 className="mt-2 font-bold text-slate-800">{t.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{t.text}</p>
          </div>
        ))}
      </div>

      <div className="card mt-6 border-l-4 border-red-400">
        <h2 className="font-bold text-slate-800">👩‍⚕️ See your doctor</h2>
        <p className="mt-1 text-sm text-slate-600">
          Any bleeding after menopause, severe symptoms disrupting your life, or concerns about hormone therapy and bone health should be discussed with a healthcare professional.
        </p>
      </div>
    </div>
  );
}
