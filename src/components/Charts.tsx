"use client";

type Point = { label: string; value: number | null };

export function LineChart({ data, color = "#db2777", height = 160, unit = "" }: { data: Point[]; color?: string; height?: number; unit?: string }) {
  const vals = data.map((d) => d.value).filter((v): v is number => v !== null && !Number.isNaN(v));
  if (vals.length === 0) return <EmptyChart />;
  const max = Math.max(...vals);
  const min = Math.min(...vals);
  const range = max - min || 1;
  const w = 100;
  const pts = data
    .map((d, i) => {
      if (d.value === null) return null;
      const x = data.length === 1 ? 50 : (i / (data.length - 1)) * w;
      const y = height - 20 - ((d.value - min) / range) * (height - 40);
      return { x, y, v: d.value };
    })
    .filter((p): p is { x: number; y: number; v: number } => p !== null);

  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" className="h-40 w-full">
        <path d={path} fill="none" stroke={color} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={1.4} fill={color} vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-[10px] text-slate-400">
        <span>{data[0]?.label}</span>
        <span>
          min {min}
          {unit} · max {max}
          {unit}
        </span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
}

export function BarChart({ data, color = "#db2777", max }: { data: Point[]; color?: string; max?: number }) {
  const vals = data.map((d) => d.value ?? 0);
  const top = max ?? Math.max(1, ...vals);
  return (
    <div className="flex h-40 items-end gap-1">
      {data.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1">
          <div
            className="w-full rounded-t"
            style={{ height: `${((d.value ?? 0) / top) * 100}%`, backgroundColor: color, minHeight: d.value ? 4 : 0 }}
            title={`${d.label}: ${d.value ?? "—"}`}
          />
          <span className="text-[9px] text-slate-400">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-40 items-center justify-center rounded-xl bg-rose-50 text-sm text-slate-400">
      No data yet — start logging to see trends.
    </div>
  );
}
