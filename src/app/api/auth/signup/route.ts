import { hashPassword, createSession } from "@/lib/auth";
import { createLocalUser, findLocalUserByEmail } from "@/lib/local-auth-store";

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
    const existing = await findLocalUserByEmail(normalized);
    if (existing) {
      return Response.json({ error: "An account with this email already exists." }, { status: 409 });
    }
    const user = await createLocalUser({
      email: normalized,
      passwordHash: hashPassword(password),
      name: String(name).trim(),
    });
    await createSession(user.id);
    return Response.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}
