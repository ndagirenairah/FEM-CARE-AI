import type { ReactNode } from "react";

export function PageHeader({ title, subtitle, emoji }: { title: string; subtitle?: string; emoji?: string }) {
  return (
    <div className="mb-6">
      <h1 className="flex items-center gap-2 text-2xl font-black text-slate-900">
        {emoji && <span>{emoji}</span>}
        {title}
      </h1>
      {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
    </div>
  );
}

export function StatCard({ label, value, sub, icon }: { label: string; value: ReactNode; sub?: string; icon?: string }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
        {icon && <span className="text-lg">{icon}</span>}
      </div>
      <div className="mt-2 text-2xl font-black text-slate-900">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-slate-500">{sub}</div>}
    </div>
  );
}

export function Disclaimer() {
  return (
    <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-800 ring-1 ring-amber-100">
      ⚠️ FemCare AI provides educational information only and is not a substitute for professional medical advice,
      diagnosis, or treatment. Always consult a qualified clinician.
    </p>
  );
}

export function Ring({ value, size = 120 }: { value: number; size?: number }) {
  const r = (size - 16) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const offset = c - (pct / 100) * c;
  const color = pct >= 80 ? "#16a34a" : pct >= 60 ? "#db2777" : pct >= 40 ? "#f59e0b" : "#ef4444";
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#fce7f3" strokeWidth={12} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={12}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
      />
      <text x="50%" y="50%" dy="0.35em" textAnchor="middle" className="rotate-90 fill-slate-900 text-xl font-black" style={{ transformOrigin: "center" }}>
        {Math.round(pct)}
      </text>
    </svg>
  );
}
