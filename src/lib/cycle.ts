import type { Cycle } from "@/db/schema";

export function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export type CyclePrediction = {
  avgCycleLength: number;
  avgPeriodLength: number;
  lastPeriodStart: string | null;
  nextPeriodStart: string | null;
  ovulationDate: string | null;
  fertileStart: string | null;
  fertileEnd: string | null;
  currentDay: number | null;
  phase: string | null;
  daysUntilNextPeriod: number | null;
};

export function predictCycle(
  cycles: Cycle[],
  fallbackCycleLen = 28,
  fallbackPeriodLen = 5,
): CyclePrediction {
  const sorted = [...cycles].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );

  const empty: CyclePrediction = {
    avgCycleLength: fallbackCycleLen,
    avgPeriodLength: fallbackPeriodLen,
    lastPeriodStart: null,
    nextPeriodStart: null,
    ovulationDate: null,
    fertileStart: null,
    fertileEnd: null,
    currentDay: null,
    phase: null,
    daysUntilNextPeriod: null,
  };

  if (sorted.length === 0) return empty;

  // Average cycle length from gaps between starts
  const gaps: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    const g = daysBetween(new Date(sorted[i - 1].startDate), new Date(sorted[i].startDate));
    if (g > 15 && g < 60) gaps.push(g);
  }
  const avgCycleLength = gaps.length
    ? Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length)
    : fallbackCycleLen;

  // Average period length
  const lengths: number[] = [];
  for (const c of sorted) {
    if (c.endDate) {
      const l = daysBetween(new Date(c.startDate), new Date(c.endDate)) + 1;
      if (l > 0 && l < 15) lengths.push(l);
    }
  }
  const avgPeriodLength = lengths.length
    ? Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length)
    : fallbackPeriodLen;

  const last = sorted[sorted.length - 1];
  const lastStart = new Date(last.startDate);
  const nextStart = addDays(lastStart, avgCycleLength);
  const ovulation = addDays(nextStart, -14);
  const fertileStart = addDays(ovulation, -5);
  const fertileEnd = addDays(ovulation, 1);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentDay = daysBetween(lastStart, today) + 1;
  const daysUntilNextPeriod = daysBetween(today, nextStart);

  let phase: string;
  if (currentDay <= avgPeriodLength) phase = "Menstrual";
  else if (today >= fertileStart && today <= fertileEnd) phase = "Fertile / Ovulation";
  else if (today < fertileStart) phase = "Follicular";
  else phase = "Luteal";

  return {
    avgCycleLength,
    avgPeriodLength,
    lastPeriodStart: iso(lastStart),
    nextPeriodStart: iso(nextStart),
    ovulationDate: iso(ovulation),
    fertileStart: iso(fertileStart),
    fertileEnd: iso(fertileEnd),
    currentDay: currentDay > 0 && currentDay <= avgCycleLength + 10 ? currentDay : null,
    phase,
    daysUntilNextPeriod,
  };
}
