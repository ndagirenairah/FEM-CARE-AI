import { db } from "@/db";
import { dailyLogs } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { requireUserId } from "@/lib/auth";
import { awardPoints } from "@/lib/gamify";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const userId = await requireUserId();
    const rows = await db
      .select()
      .from(dailyLogs)
      .where(eq(dailyLogs.userId, userId))
      .orderBy(desc(dailyLogs.logDate))
      .limit(60);
    return Response.json({ logs: rows });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await requireUserId();
    const b = await req.json();
    const logDate = b.logDate || new Date().toISOString().slice(0, 10);
    const num = (v: unknown) => (v === "" || v === null || v === undefined ? null : Number(v));
    const values = {
      mood: num(b.mood),
      stress: num(b.stress),
      sleepHours: num(b.sleepHours),
      waterMl: num(b.waterMl),
      exerciseMin: num(b.exerciseMin),
      weightKg: num(b.weightKg),
      symptoms: Array.isArray(b.symptoms) ? (b.symptoms as string[]) : [],
      notes: b.notes || null,
    };
    // upsert by (userId, logDate) manually
    const existing = await db
      .select()
      .from(dailyLogs)
      .where(and(eq(dailyLogs.userId, userId), eq(dailyLogs.logDate, logDate)))
      .limit(1);
    if (existing.length > 0) {
      await db.update(dailyLogs).set(values).where(eq(dailyLogs.id, existing[0].id));
    } else {
      await db.insert(dailyLogs).values({ userId, logDate, ...values });
      await awardPoints(userId, 5);
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
