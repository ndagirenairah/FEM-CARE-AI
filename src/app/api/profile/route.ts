import { db } from "@/db";
import { profiles, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireUserId } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const userId = await requireUserId();
    const rows = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
    const userRows = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    return Response.json({ profile: rows[0] ?? null, user: userRows[0] ?? null });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: Request) {
  try {
    const userId = await requireUserId();
    const b = await req.json();
    const num = (v: unknown) => (v === "" || v === null || v === undefined ? null : Number(v));
    const values = {
      age: num(b.age),
      heightCm: num(b.heightCm),
      weightKg: num(b.weightKg),
      bloodGroup: b.bloodGroup || null,
      allergies: b.allergies || null,
      medications: b.medications || null,
      familyHistory: b.familyHistory || null,
      chronicIllnesses: b.chronicIllnesses || null,
      pregnancyHistory: b.pregnancyHistory || null,
      menopauseStatus: b.menopauseStatus || null,
      lifestyle: b.lifestyle || null,
      lifeStage: b.lifeStage || null,
      avgCycleLength: num(b.avgCycleLength) ?? 28,
      avgPeriodLength: num(b.avgPeriodLength) ?? 5,
      updatedAt: new Date(),
    };
    await db
      .insert(profiles)
      .values({ userId, ...values })
      .onConflictDoUpdate({ target: profiles.userId, set: values });

    if (b.emergencyContactName !== undefined || b.emergencyContactPhone !== undefined) {
      await db
        .update(users)
        .set({
          emergencyContactName: b.emergencyContactName || null,
          emergencyContactPhone: b.emergencyContactPhone || null,
        })
        .where(eq(users.id, userId));
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
