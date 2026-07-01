import { db } from "@/db";
import { cycles, profiles } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { requireUserId } from "@/lib/auth";
import { awardPoints } from "@/lib/gamify";
import { predictCycle } from "@/lib/cycle";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const userId = await requireUserId();
    const rows = await db
      .select()
      .from(cycles)
      .where(eq(cycles.userId, userId))
      .orderBy(desc(cycles.startDate));
    const prof = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
    const prediction = predictCycle(
      rows,
      prof[0]?.avgCycleLength ?? 28,
      prof[0]?.avgPeriodLength ?? 5,
    );
    return Response.json({ cycles: rows, prediction });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await requireUserId();
    const b = await req.json();
    if (!b.startDate) return Response.json({ error: "Start date required" }, { status: 400 });
    const [row] = await db
      .insert(cycles)
      .values({
        userId,
        startDate: b.startDate,
        endDate: b.endDate || null,
        flow: b.flow || null,
        crampLevel: b.crampLevel ? Number(b.crampLevel) : null,
        pmsLevel: b.pmsLevel ? Number(b.pmsLevel) : null,
        notes: b.notes || null,
      })
      .returning();
    await awardPoints(userId, 10);
    return Response.json({ cycle: row });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(req: Request) {
  try {
    const userId = await requireUserId();
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!id) return Response.json({ error: "id required" }, { status: 400 });
    await db.delete(cycles).where(and(eq(cycles.id, id), eq(cycles.userId, userId)));
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
