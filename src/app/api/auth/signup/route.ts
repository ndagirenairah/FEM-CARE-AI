import { db } from "@/db";
import { users, profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();
    if (!email || !password || !name) {
      return Response.json({ error: "All fields are required." }, { status: 400 });
    }
    if (String(password).length < 6) {
      return Response.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }
    const normalized = String(email).toLowerCase().trim();
    const existing = await db.select().from(users).where(eq(users.email, normalized)).limit(1);
    if (existing.length > 0) {
      return Response.json({ error: "An account with this email already exists." }, { status: 409 });
    }
    const [user] = await db
      .insert(users)
      .values({ email: normalized, passwordHash: hashPassword(password), name: String(name).trim() })
      .returning();
    await db.insert(profiles).values({ userId: user.id }).onConflictDoNothing();
    await createSession(user.id);
    return Response.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}
