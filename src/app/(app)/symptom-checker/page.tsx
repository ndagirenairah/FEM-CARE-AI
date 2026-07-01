"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader, Disclaimer } from "@/components/ui";

type Result = {
  urgent: boolean;
  urgentMessage?: string;
  matches: { name: string; slug: string; info: string; selfCare: string[] }[];
  generalAdvice: string[];
};

const EXAMPLES = ["Irregular periods, acne and weight gain", "Burning when I pee and frequent urination", "Severe cramps and pelvic pain", "Hot flashes and night sweats"];

export default function SymptomCheckerPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  async function check() {
    if (!text.trim()) return;
    setLoading(true);
    const res = await fetch("/api/symptom-checker", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms: text }),
    });
    const d = await res.json();
    setResult(d.result);
    setLoading(false);
  }

  return (
    <div>
      <PageHeader emoji="🔎" title="AI Symptom Checker" subtitle="Describe how you feel for educational guidance and next steps." />

      <div className="card">
        <textarea
          className="input min-h-[120px]"
          placeholder="Describe your symptoms in your own words…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button key={ex} onClick={() => setText(ex)} className="rounded-full bg-rose-50 px-3 py-1.5 text-xs text-slate-600 hover:bg-rose-100">
              {ex}
            </button>
          ))}
        </div>
        <button className="btn-primary mt-4" onClick={check} disabled={loading || !text.trim()}>
          {loading ? "Checking…" : "Check symptoms"}
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          {result.urgent ? (
            <div className="rounded-2xl bg-red-600 p-6 text-white shadow-lg">
              <h2 className="text-xl font-black">🚨 Seek emergency care</h2>
              <p className="mt-2">{result.urgentMessage}</p>
            </div>
          ) : (
            <>
              {result.matches.length > 0 && (
                <div className="space-y-4">
                  {result.matches.map((m) => (
                    <div key={m.name} className="card">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-800">{m.name}</h3>
                        <Link href={`/learn/${m.slug}`} className="text-xs font-semibold text-pink-600">
                          Learn more →
                        </Link>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{m.info}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {m.selfCare.map((s) => (
                          <span key={s} className="chip bg-rose-50 text-slate-600">
                            💡 {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="card">
                <h3 className="font-bold text-slate-800">General guidance</h3>
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {result.generalAdvice.map((a, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-pink-500">•</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
          <Disclaimer />
        </div>
      )}
    </div>
  );
}
