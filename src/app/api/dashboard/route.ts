import { db } from "@/db";
import {
  users,
  profiles,
  cycles,
  dailyLogs,
  medications,
  appointments,
  assessments,
  journalEntries,
} from "@/db/schema";
import { eq, desc, gte, and } from "drizzle-orm";
import { requireUserId } from "@/lib/auth";
import { predictCycle } from "@/lib/cycle";
import { computeBadges } from "@/lib/gamify";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const userId = await requireUserId();
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date();

    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const [prof] = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
    const cycleRows = await db.select().from(cycles).where(eq(cycles.userId, userId)).orderBy(desc(cycles.startDate));
    const logRows = await db
      .select()
      .from(dailyLogs)
      .where(eq(dailyLogs.userId, userId))
      .orderBy(desc(dailyLogs.logDate))
      .limit(30);
    const medRows = await db
      .select()
      .from(medications)
      .where(and(eq(medications.userId, userId), eq(medications.active, true)));
    const apptRows = await db
      .select()
      .from(appointments)
      .where(and(eq(appointments.userId, userId), gte(appointments.apptDate, now)))
      .orderBy(appointments.apptDate)
      .limit(5);
    const assessRows = await db
      .select()
      .from(assessments)
      .where(eq(assessments.userId, userId))
      .orderBy(desc(assessments.createdAt))
      .limit(1);
    const journalRows = await db.select().from(journalEntries).where(eq(journalEntries.userId, userId));

    const prediction = predictCycle(cycleRows, prof?.avgCycleLength ?? 28, prof?.avgPeriodLength ?? 5);
    const todayLog = logRows.find((l) => l.logDate === today) ?? null;

    // Health score: blend latest assessment + lifestyle
    let healthScore = assessRows[0]?.result?.score ?? 70;
    if (todayLog) {
      if ((todayLog.waterMl ?? 0) >= 1500) healthScore = Math.min(100, healthScore + 2);
      if ((todayLog.sleepHours ?? 0) >= 7) healthScore = Math.min(100, healthScore + 2);
      if ((todayLog.exerciseMin ?? 0) >= 20) healthScore = Math.min(100, healthScore + 2);
    }

    const badges = computeBadges({
      points: user?.points ?? 0,
      streak: user?.streak ?? 0,
      cycleLogs: cycleRows.length,
      dailyLogs: logRows.length,
      assessments: assessRows.length,
      journalEntries: journalRows.length,
    });

    // reminders
    const reminders: { icon: string; text: string }[] = [];
    if (!todayLog || (todayLog.waterMl ?? 0) < 1500) reminders.push({ icon: "💧", text: "Drink more water today" });
    if (!todayLog || (todayLog.exerciseMin ?? 0) < 20) reminders.push({ icon: "🏃‍♀️", text: "Get some movement in" });
    if (!todayLog) reminders.push({ icon: "📝", text: "Log today's wellness check-in" });
    if (medRows.length > 0) reminders.push({ icon: "💊", text: `${medRows.length} active medication reminder(s)` });
    if (prediction.daysUntilNextPeriod !== null && prediction.daysUntilNextPeriod <= 3 && prediction.daysUntilNextPeriod >= 0)
      reminders.push({ icon: "🩸", text: `Period expected in ${prediction.daysUntilNextPeriod} day(s)` });
    if (apptRows.length > 0) reminders.push({ icon: "📅", text: `Upcoming: ${apptRows[0].title}` });

    return Response.json({
      user: user ? { name: user.name, points: user.points, streak: user.streak } : null,
      profile: prof ?? null,
      healthScore: Math.round(healthScore),
      prediction,
      todayLog,
      recentLogs: logRows.slice(0, 14).reverse(),
      medications: medRows,
      appointments: apptRows,
      latestAssessment: assessRows[0] ?? null,
      badges,
      reminders,
    });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
