import { getCurrentUser } from "@/lib/auth";
import { predictCycle } from "@/lib/cycle";
import { computeBadges } from "@/lib/gamify";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const prediction = predictCycle([]);
    const healthScore = 70;

    const badges = computeBadges({
      points: user?.points ?? 0,
      streak: user?.streak ?? 0,
      cycleLogs: 0,
      dailyLogs: 0,
      assessments: 0,
      journalEntries: 0,
    });

    return Response.json({
      user: { name: user.name, points: user.points ?? 0, streak: user.streak ?? 0 },
      profile: null,
      healthScore,
      prediction,
      todayLog: null,
      recentLogs: [],
      medications: [],
      appointments: [],
      latestAssessment: null,
      badges,
      reminders: [
        { icon: "💧", text: "Add a real database to unlock tracking and insights" },
        { icon: "📝", text: "Your account and login now work locally" },
      ],
    });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
