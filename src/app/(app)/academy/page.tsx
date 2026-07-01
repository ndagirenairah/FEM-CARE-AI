"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui";
import { ACADEMY, QUIZZES } from "@/lib/content";

export default function AcademyPage() {
  return (
    <div>
      <PageHeader emoji="🎓" title="Learning Academy" subtitle="Articles, quizzes, tips and challenges to grow your knowledge." />

      <div className="card mb-6 bg-gradient-to-r from-fuchsia-50 to-pink-50">
        <h2 className="font-bold text-slate-800">💡 Weekly Tip</h2>
        <p className="mt-1 text-sm text-slate-600">
          Track your cycle for three consecutive months to reveal your personal patterns — it&apos;s the single most useful habit for understanding your body.
        </p>
      </div>

      <h2 className="mb-3 font-bold text-slate-800">Articles</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {ACADEMY.map((a) => (
          <div key={a.slug} className="card">
            <div className="flex items-center justify-between">
              <span className="text-3xl">{a.emoji}</span>
              <span className="chip bg-rose-50 text-slate-500">{a.readMinutes} min</span>
            </div>
            <div className="mt-1 text-xs font-semibold text-pink-600">{a.category}</div>
            <h3 className="font-bold text-slate-800">{a.title}</h3>
            <p className="mt-1 text-sm text-slate-600">{a.body}</p>
            <div className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-xs text-slate-600">✨ {a.tip}</div>
          </div>
        ))}
      </div>

      <h2 className="mb-3 mt-8 font-bold text-slate-800">Quizzes</h2>
      {QUIZZES.map((q) => (
        <Quiz key={q.slug} quiz={q} />
      ))}
    </div>
  );
}

function Quiz({ quiz }: { quiz: (typeof QUIZZES)[number] }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = quiz.questions.reduce((acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0);

  return (
    <div className="card">
      <h3 className="font-bold text-slate-800">{quiz.emoji} {quiz.title}</h3>
      <div className="mt-3 space-y-4">
        {quiz.questions.map((q, i) => (
          <div key={i}>
            <div className="mb-2 text-sm font-medium text-slate-700">{i + 1}. {q.q}</div>
            <div className="flex flex-wrap gap-2">
              {q.options.map((o, oi) => {
                const chosen = answers[i] === oi;
                const correct = submitted && oi === q.answer;
                const wrong = submitted && chosen && oi !== q.answer;
                return (
                  <button
                    key={oi}
                    disabled={submitted}
                    onClick={() => setAnswers({ ...answers, [i]: oi })}
                    className={`rounded-full px-3 py-1.5 text-sm transition ${
                      correct ? "bg-green-500 text-white" : wrong ? "bg-red-400 text-white" : chosen ? "bg-pink-600 text-white" : "bg-rose-50 text-slate-600 hover:bg-rose-100"
                    }`}
                  >
                    {o}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {submitted ? (
        <div className="mt-4 rounded-xl bg-fuchsia-50 px-4 py-2 text-sm font-semibold text-fuchsia-700">
          You scored {score}/{quiz.questions.length}! 🎉
        </div>
      ) : (
        <button className="btn-primary mt-4" disabled={Object.keys(answers).length < quiz.questions.length} onClick={() => setSubmitted(true)}>
          Submit quiz
        </button>
      )}
    </div>
  );
}
