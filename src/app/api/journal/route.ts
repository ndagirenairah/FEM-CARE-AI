import { db } from "@/db";
import { journalEntries } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireUserId } from "@/lib/auth";
import { awardPoints } from "@/lib/gamify";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const userId = await requireUserId();
    const rows = await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .orderBy(desc(journalEntries.entryDate))
      .limit(50);
    return Response.json({ entries: rows });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await requireUserId();
    const b = await req.json();
    if (!b.content && !b.gratitude) {
      return Response.json({ error: "Write something first" }, { status: 400 });
    }
    const [row] = await db
      .insert(journalEntries)
      .values({
        userId,
        entryDate: b.entryDate || new Date().toISOString().slice(0, 10),
        mood: b.mood ? Number(b.mood) : null,
        gratitude: b.gratitude || null,
        content: b.content || null,
      })
      .returning();
    await awardPoints(userId, 8);
    return Response.json({ entry: row });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
