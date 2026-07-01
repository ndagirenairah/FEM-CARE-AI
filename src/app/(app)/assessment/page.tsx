"use client";

import { useEffect, useState } from "react";
import { PageHeader, Ring, Disclaimer } from "@/components/ui";
import { ASSESSMENT_QUESTIONS } from "@/lib/ai";
import type { AssessmentResult } from "@/db/schema";

export default function AssessmentPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ createdAt: string; result: AssessmentResult }[]>([]);

  useEffect(() => {
    fetch("/api/assessment")
      .then((r) => r.json())
      .then((d) => setHistory(d.assessments || []));
  }, [result]);

  const answered = Object.keys(answers).length;
  const progress = Math.round((answered / ASSESSMENT_QUESTIONS.length) * 100);

  async function submit() {
    setLoading(true);
    const res = await fetch("/api/assessment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });
    const d = await res.json();
    setResult(d.assessment.result);
    setLoading(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div>
      <PageHeader emoji="🧪" title="AI Health Assessment" subtitle="Answer a few questions for a personalized wellness snapshot." />

      {result && (
        <div className="card mb-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <Ring value={result.score} />
            <div className="flex-1">
              <div className="text-sm font-semibold uppercase tracking-wide text-pink-600">{result.band}</div>
              <p className="mt-1 text-slate-700">{result.summary}</p>
              {result.seeDoctor && (
                <div className="mt-3 rounded-xl bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800">
                  👩‍⚕️ Based on your responses, consider speaking with a healthcare professional.
                </div>
              )}
            </div>
          </div>

          {result.flags.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="font-bold text-slate-800">Areas of awareness</h3>
              {result.flags.map((f, i) => (
                <div key={i} className={`rounded-xl px-4 py-3 text-sm ${f.level === "urgent" ? "bg-red-50 text-red-800" : "bg-rose-50 text-slate-700"}`}>
                  <div className="font-semibold">{f.title}</div>
                  <div>{f.detail}</div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4">
            <h3 className="font-bold text-slate-800">Recommendations</h3>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              {result.recommendations.map((r, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-pink-500">✓</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <Disclaimer />
          <button className="btn-ghost mt-4" onClick={() => { setResult(null); setAnswers({}); }}>
            Retake assessment
          </button>
        </div>
      )}

      {!result && (
        <div className="card">
          <div className="mb-4">
            <div className="mb-1 flex justify-between text-xs font-semibold text-slate-500">
              <span>Progress</span>
              <span>{answered}/{ASSESSMENT_QUESTIONS.length}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-rose-100">
              <div className="h-full bg-pink-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="space-y-5">
            {ASSESSMENT_QUESTIONS.map((q, i) => (
              <div key={q.id}>
                <div className="mb-2 font-medium text-slate-800">
                  {i + 1}. {q.label}
                </div>
                <div className="flex flex-wrap gap-2">
                  {q.options.map((o) => (
                    <button
                      key={o}
                      onClick={() => setAnswers({ ...answers, [q.id]: o })}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                        answers[q.id] === o ? "bg-pink-600 text-white" : "bg-rose-50 text-slate-600 hover:bg-rose-100"
                      }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button className="btn-primary mt-6 w-full" disabled={answered < ASSESSMENT_QUESTIONS.length || loading} onClick={submit}>
            {loading ? "Analyzing…" : answered < ASSESSMENT_QUESTIONS.length ? `Answer all questions (${answered}/${ASSESSMENT_QUESTIONS.length})` : "Get my results (+15 pts)"}
          </button>
        </div>
      )}

      {history.length > 0 && (
        <div className="card mt-6">
          <h3 className="mb-3 font-bold text-slate-800">Past assessments</h3>
          <div className="flex flex-wrap gap-3">
            {history.map((h, i) => (
              <div key={i} className="rounded-xl bg-rose-50 px-4 py-2 text-center">
                <div className="text-lg font-black text-pink-600">{h.result.score}</div>
                <div className="text-[10px] text-slate-500">{new Date(h.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
