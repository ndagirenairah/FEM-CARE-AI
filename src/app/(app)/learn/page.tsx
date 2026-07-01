import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { DISEASES } from "@/lib/content";

export default function LearnPage() {
  return (
    <div>
      <PageHeader emoji="📚" title="Disease Learning Center" subtitle="Trusted, easy-to-understand education on women's health conditions." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DISEASES.map((d) => (
          <Link key={d.slug} href={`/learn/${d.slug}`} className="card transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="text-3xl">{d.emoji}</div>
            <h2 className="mt-2 font-bold text-slate-800">{d.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{d.summary}</p>
            <span className="mt-3 inline-block text-xs font-semibold text-pink-600">Read more →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
