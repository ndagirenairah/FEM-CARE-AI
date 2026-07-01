import { db } from "@/db";
import { medications } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { requireUserId } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const userId = await requireUserId();
    const rows = await db
      .select()
      .from(medications)
      .where(eq(medications.userId, userId))
      .orderBy(desc(medications.createdAt));
    return Response.json({ medications: rows });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await requireUserId();
    const b = await req.json();
    if (!b.name) return Response.json({ error: "Name required" }, { status: 400 });
    const [row] = await db
      .insert(medications)
      .values({
        userId,
        name: b.name,
        dosage: b.dosage || null,
        kind: b.kind || "medication",
        timeOfDay: b.timeOfDay || null,
        frequency: b.frequency || null,
        refillDate: b.refillDate || null,
      })
      .returning();
    return Response.json({ medication: row });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(req: Request) {
  try {
    const userId = await requireUserId();
    const b = await req.json();
    if (!b.id) return Response.json({ error: "id required" }, { status: 400 });
    await db
      .update(medications)
      .set({ active: !!b.active })
      .where(and(eq(medications.id, Number(b.id)), eq(medications.userId, userId)));
    return Response.json({ ok: true });
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
    await db.delete(medications).where(and(eq(medications.id, id), eq(medications.userId, userId)));
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
