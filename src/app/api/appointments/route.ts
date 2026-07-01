import { db } from "@/db";
import { appointments } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { requireUserId } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const userId = await requireUserId();
    const rows = await db
      .select()
      .from(appointments)
      .where(eq(appointments.userId, userId))
      .orderBy(desc(appointments.apptDate));
    return Response.json({ appointments: rows });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await requireUserId();
    const b = await req.json();
    if (!b.title || !b.apptDate) return Response.json({ error: "Title and date required" }, { status: 400 });
    const [row] = await db
      .insert(appointments)
      .values({
        userId,
        title: b.title,
        doctor: b.doctor || null,
        location: b.location || null,
        apptDate: new Date(b.apptDate),
        notes: b.notes || null,
      })
      .returning();
    return Response.json({ appointment: row });
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
    await db.delete(appointments).where(and(eq(appointments.id, id), eq(appointments.userId, userId)));
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
