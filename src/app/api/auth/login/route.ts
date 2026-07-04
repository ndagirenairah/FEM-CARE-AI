import { verifyPassword, createSession } from "@/lib/auth";
import { findLocalUserByEmail } from "@/lib/local-auth-store";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return Response.json({ error: "Email and password are required." }, { status: 400 });
    }
    const normalized = String(email).toLowerCase().trim();
    const user = await findLocalUserByEmail(normalized);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return Response.json({ error: "Invalid email or password." }, { status: 401 });
    }
    await createSession(user.id);
    return Response.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch {
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}
