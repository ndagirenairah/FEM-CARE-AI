import { db } from "@/db";
import { communityPosts, users } from "@/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { requireUserId } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await requireUserId();
    const { searchParams } = new URL(req.url);
    const space = searchParams.get("space");
    const rows = space
      ? await db
          .select()
          .from(communityPosts)
          .where(eq(communityPosts.space, space))
          .orderBy(desc(communityPosts.createdAt))
          .limit(50)
      : await db.select().from(communityPosts).orderBy(desc(communityPosts.createdAt)).limit(50);
    return Response.json({ posts: rows });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await requireUserId();
    const b = await req.json();
    if (!b.space || !b.content) return Response.json({ error: "Missing fields" }, { status: 400 });
    const anonymous = !!b.anonymous;
    let displayName = "Anonymous";
    if (!anonymous) {
      const u = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      displayName = u[0]?.name ?? "Member";
    }
    const [row] = await db
      .insert(communityPosts)
      .values({ userId, space: b.space, content: b.content, anonymous, displayName })
      .returning();
    return Response.json({ post: row });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(req: Request) {
  try {
    await requireUserId();
    const b = await req.json();
    if (!b.id) return Response.json({ error: "id required" }, { status: 400 });
    await db
      .update(communityPosts)
      .set({ likes: sql`${communityPosts.likes} + 1` })
      .where(eq(communityPosts.id, Number(b.id)));
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
    await db.delete(communityPosts).where(and(eq(communityPosts.id, id), eq(communityPosts.userId, userId)));
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
