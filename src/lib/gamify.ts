import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function awardPoints(userId: number, points: number) {
  const today = new Date().toISOString().slice(0, 10);
  const rows = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  const user = rows[0];
  if (!user) return;

  let streak = user.streak ?? 0;
  const last = user.lastActiveDate;
  if (last !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    streak = last === yesterday ? streak + 1 : 1;
  }

  await db
    .update(users)
    .set({
      points: sql`${users.points} + ${points}`,
      streak,
      lastActiveDate: today,
    })
    .where(eq(users.id, userId));
}

export type Badge = { name: string; emoji: string; earned: boolean; detail: string };

export function computeBadges(stats: {
  points: number;
  streak: number;
  cycleLogs: number;
  dailyLogs: number;
  assessments: number;
  journalEntries: number;
}): Badge[] {
  return [
    { name: "First Steps", emoji: "🌱", earned: stats.points > 0, detail: "Earn your first points" },
    { name: "Cycle Tracker", emoji: "🩸", earned: stats.cycleLogs >= 1, detail: "Log a cycle" },
    { name: "Consistency", emoji: "🔥", earned: stats.streak >= 3, detail: "3-day streak" },
    { name: "Self-Aware", emoji: "🧠", earned: stats.assessments >= 1, detail: "Complete an assessment" },
    { name: "Journal Keeper", emoji: "📔", earned: stats.journalEntries >= 3, detail: "Write 3 journal entries" },
    { name: "Wellness Pro", emoji: "⭐", earned: stats.dailyLogs >= 7, detail: "Log 7 days of wellness" },
    { name: "Champion", emoji: "🏆", earned: stats.points >= 200, detail: "Reach 200 points" },
  ];
}
