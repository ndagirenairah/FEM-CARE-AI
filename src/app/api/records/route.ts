import { db } from "@/db";
import { healthRecords } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { requireUserId } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const userId = await requireUserId();
    const rows = await db
      .select()
      .from(healthRecords)
      .where(eq(healthRecords.userId, userId))
      .orderBy(desc(healthRecords.recordDate));
    return Response.json({ records: rows });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await requireUserId();
    const b = await req.json();
    if (!b.title || !b.category) return Response.json({ error: "Title and category required" }, { status: 400 });
    const [row] = await db
      .insert(healthRecords)
      .values({
        userId,
        title: b.title,
        category: b.category,
        recordDate: b.recordDate || null,
        details: b.details || null,
      })
      .returning();
    return Response.json({ record: row });
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
    await db.delete(healthRecords).where(and(eq(healthRecords.id, id), eq(healthRecords.userId, userId)));
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
