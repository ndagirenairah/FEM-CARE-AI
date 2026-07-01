"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui";

type Form = Record<string, string>;

const FIELDS: { key: string; label: string; type?: string; full?: boolean; options?: string[]; placeholder?: string }[] = [
  { key: "age", label: "Age", type: "number" },
  { key: "heightCm", label: "Height (cm)", type: "number" },
  { key: "weightKg", label: "Weight (kg)", type: "number" },
  { key: "bloodGroup", label: "Blood Group", options: ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
  { key: "lifeStage", label: "Life Stage", options: ["", "Puberty", "Reproductive", "Trying to conceive", "Pregnant", "Postpartum", "Perimenopause", "Menopause"] },
  { key: "menopauseStatus", label: "Menopause Status", options: ["", "Pre-menopause", "Perimenopause", "Menopause", "Post-menopause"] },
  { key: "avgCycleLength", label: "Avg Cycle Length (days)", type: "number" },
  { key: "avgPeriodLength", label: "Avg Period Length (days)", type: "number" },
  { key: "allergies", label: "Allergies", full: true, placeholder: "e.g. penicillin, nuts" },
  { key: "medications", label: "Current Medications", full: true },
  { key: "chronicIllnesses", label: "Chronic Illnesses", full: true },
  { key: "familyHistory", label: "Family Medical History", full: true },
  { key: "pregnancyHistory", label: "Pregnancy History", full: true },
  { key: "lifestyle", label: "Lifestyle Habits", full: true, placeholder: "smoking, alcohol, activity level…" },
];

export default function ProfilePage() {
  const [form, setForm] = useState<Form>({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        const f: Form = {};
        if (d.profile) for (const k of Object.keys(d.profile)) if (d.profile[k] !== null) f[k] = String(d.profile[k]);
        if (d.user) {
          if (d.user.emergencyContactName) f.emergencyContactName = d.user.emergencyContactName;
          if (d.user.emergencyContactPhone) f.emergencyContactPhone = d.user.emergencyContactPhone;
        }
        setForm(f);
        setLoading(false);
      });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const bmi =
    form.heightCm && form.weightKg
      ? (Number(form.weightKg) / Math.pow(Number(form.heightCm) / 100, 2)).toFixed(1)
      : null;

  if (loading) return <div className="py-20 text-center text-slate-400">Loading…</div>;

  return (
    <div>
      <PageHeader emoji="👤" title="Personal Health Profile" subtitle="Your information powers personalized insights across the platform." />

      {bmi && (
        <div className="card mb-6 flex items-center gap-4">
          <div className="text-3xl">⚖️</div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Body Mass Index</div>
            <div className="text-2xl font-black text-slate-900">{bmi}</div>
            <div className="text-xs text-slate-500">
              {Number(bmi) < 18.5 ? "Underweight" : Number(bmi) < 25 ? "Healthy range" : Number(bmi) < 30 ? "Overweight" : "Obese range"}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={save} className="card space-y-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FIELDS.filter((f) => !f.full).map((f) => (
            <div key={f.key}>
              <label className="label">{f.label}</label>
              {f.options ? (
                <select className="input" value={form[f.key] || ""} onChange={(e) => set(f.key, e.target.value)}>
                  {f.options.map((o) => (
                    <option key={o} value={o}>
                      {o || "Select…"}
                    </option>
                  ))}
                </select>
              ) : (
                <input className="input" type={f.type || "text"} value={form[f.key] || ""} onChange={(e) => set(f.key, e.target.value)} />
              )}
            </div>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {FIELDS.filter((f) => f.full).map((f) => (
            <div key={f.key}>
              <label className="label">{f.label}</label>
              <textarea className="input min-h-[70px]" placeholder={f.placeholder} value={form[f.key] || ""} onChange={(e) => set(f.key, e.target.value)} />
            </div>
          ))}
        </div>

        <div className="border-t border-rose-100 pt-4">
          <h3 className="mb-3 font-bold text-slate-800">🚨 Emergency Contact</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Contact Name</label>
              <input className="input" value={form.emergencyContactName || ""} onChange={(e) => set("emergencyContactName", e.target.value)} />
            </div>
            <div>
              <label className="label">Contact Phone</label>
              <input className="input" value={form.emergencyContactPhone || ""} onChange={(e) => set("emergencyContactPhone", e.target.value)} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="btn-primary">Save profile</button>
          {saved && <span className="text-sm font-semibold text-green-600">✓ Saved</span>}
        </div>
      </form>
    </div>
  );
}
