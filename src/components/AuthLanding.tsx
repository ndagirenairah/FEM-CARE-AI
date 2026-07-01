"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const FEATURES = [
  { emoji: "🩸", title: "Cycle & Fertility", desc: "Smart period, ovulation & fertility predictions." },
  { emoji: "🤖", title: "AI Health Copilot", desc: "Assessments, symptom checks & a 24/7 chatbot." },
  { emoji: "📚", title: "Learning Center", desc: "Trusted education on 10+ women's health conditions." },
  { emoji: "🥗", title: "Nutrition & Fitness", desc: "Tailored meal plans and safe workout programs." },
  { emoji: "💗", title: "Mental Wellness", desc: "Mood tracking, journaling & breathing tools." },
  { emoji: "🤰", title: "Pregnancy & Menopause", desc: "Guidance for every life stage." },
];

export default function AuthLanding() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function demo() {
    setLoading(true);
    setError("");
    const creds = { email: `demo${Math.floor(Math.random() * 100000)}@femcare.ai`, password: "demo1234", name: "Demo User" };
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creds),
      });
      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError("Could not start demo.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-pink-50 to-fuchsia-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-2 lg:py-20">
        {/* Left: hero */}
        <div className="flex flex-col justify-center">
          <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-sm font-semibold text-pink-700 ring-1 ring-pink-200">
            🌸 FemCare AI
          </div>
          <h1 className="text-4xl font-black leading-tight text-slate-900 sm:text-5xl">
            Your complete <span className="text-pink-600">women&apos;s health</span> ecosystem
          </h1>
          <p className="mt-4 max-w-md text-lg text-slate-600">
            Prevention, education, long-term tracking and personalized AI support — from puberty through menopause.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl bg-white/70 p-4 ring-1 ring-pink-100 backdrop-blur">
                <div className="text-2xl">{f.emoji}</div>
                <div className="mt-1 font-semibold text-slate-800">{f.title}</div>
                <div className="text-sm text-slate-500">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: auth card */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl ring-1 ring-pink-100">
            <div className="mb-6 flex rounded-xl bg-rose-100 p-1">
              <button
                onClick={() => setMode("signup")}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${mode === "signup" ? "bg-white text-pink-700 shadow" : "text-slate-500"}`}
              >
                Sign Up
              </button>
              <button
                onClick={() => setMode("login")}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${mode === "login" ? "bg-white text-pink-700 shadow" : "text-slate-500"}`}
              >
                Log In
              </button>
            </div>

            <form onSubmit={submit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="label">Full name</label>
                  <input
                    className="input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Jane Doe"
                    required
                  />
                </div>
              )}
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="label">Password</label>
                <input
                  type="password"
                  className="input"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="At least 6 characters"
                  required
                />
              </div>

              {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "Please wait…" : mode === "signup" ? "Create my account" : "Log in"}
              </button>
            </form>

            <div className="my-4 flex items-center gap-3 text-xs text-slate-400">
              <div className="h-px flex-1 bg-rose-100" /> or <div className="h-px flex-1 bg-rose-100" />
            </div>
            <button onClick={demo} disabled={loading} className="btn-ghost w-full">
              ✨ Explore with a demo account
            </button>

            <p className="mt-6 text-center text-xs text-slate-400">
              Educational information only — not a substitute for professional medical care.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
