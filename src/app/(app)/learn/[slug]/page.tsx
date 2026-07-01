import Link from "next/link";
import { notFound } from "next/navigation";
import { Disclaimer } from "@/components/ui";
import { DISEASES } from "@/lib/content";

export function generateStaticParams() {
  return DISEASES.map((d) => ({ slug: d.slug }));
}

export default async function DiseasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = DISEASES.find((x) => x.slug === slug);
  if (!d) notFound();

  const sections: { title: string; icon: string; items: string[] }[] = [
    { title: "Causes", icon: "🔬", items: d.causes },
    { title: "Symptoms", icon: "📋", items: d.symptoms },
    { title: "Prevention", icon: "🛡️", items: d.prevention },
    { title: "Treatment Overview", icon: "💊", items: d.treatment },
  ];

  return (
    <div>
      <Link href="/learn" className="text-sm font-semibold text-pink-600">← Back to Learning Center</Link>
      <div className="mt-3 rounded-3xl bg-gradient-to-r from-pink-600 to-fuchsia-600 p-6 text-white">
        <div className="text-4xl">{d.emoji}</div>
        <h1 className="mt-2 text-2xl font-black">{d.name}</h1>
        <p className="mt-1 text-pink-100">{d.summary}</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <div key={s.title} className="card">
            <h2 className="font-bold text-slate-800">{s.icon} {s.title}</h2>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              {s.items.map((i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-pink-500">•</span>
                  {i}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="card mt-4 border-l-4 border-red-400">
        <h2 className="font-bold text-slate-800">👩‍⚕️ When to see a doctor</h2>
        <ul className="mt-2 space-y-1 text-sm text-slate-600">
          {d.seeDoctor.map((i) => (
            <li key={i} className="flex gap-2">
              <span className="text-red-400">⚠️</span>
              {i}
            </li>
          ))}
        </ul>
      </div>
      <Disclaimer />
    </div>
  );
}
