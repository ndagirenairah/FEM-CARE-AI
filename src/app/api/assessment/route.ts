import { db } from "@/db";
import { assessments } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireUserId } from "@/lib/auth";
import { runAssessment } from "@/lib/ai";
import { awardPoints } from "@/lib/gamify";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const userId = await requireUserId();
    const rows = await db
      .select()
      .from(assessments)
      .where(eq(assessments.userId, userId))
      .orderBy(desc(assessments.createdAt))
      .limit(10);
    return Response.json({ assessments: rows });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await requireUserId();
    const { answers } = await req.json();
    if (!answers || typeof answers !== "object") {
      return Response.json({ error: "Answers required" }, { status: 400 });
    }
    const result = runAssessment(answers);
    const [row] = await db.insert(assessments).values({ userId, answers, result }).returning();
    await awardPoints(userId, 15);
    return Response.json({ assessment: row });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
