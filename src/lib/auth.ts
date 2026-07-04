import { cookies } from "next/headers";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { findLocalUserById } from "@/lib/local-auth-store";

const SESSION_COOKIE = "femcare_session";
const SECRET = process.env.SESSION_SECRET || "femcare-dev-secret-change-me";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const derived = scryptSync(password, salt, 64);
  const keyBuf = Buffer.from(key, "hex");
  if (keyBuf.length !== derived.length) return false;
  return timingSafeEqual(derived, keyBuf);
}

function sign(value: string): string {
  const sig = createHmac("sha256", SECRET).update(value).digest("hex");
  return `${value}.${sig}`;
}

function unsign(signed: string): string | null {
  const idx = signed.lastIndexOf(".");
  if (idx === -1) return null;
  const value = signed.slice(0, idx);
  const sig = signed.slice(idx + 1);
  const expected = createHmac("sha256", SECRET).update(value).digest("hex");
  if (sig.length !== expected.length) return null;
  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  return value;
}

export async function createSession(userId: number) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sign(String(userId)), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionUserId(): Promise<number | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  const value = unsign(raw);
  if (!value) return null;
  const id = Number(value);
  return Number.isFinite(id) ? id : null;
}

export async function getCurrentUser() {
  const id = await getSessionUserId();
  if (!id) return null;
  return await findLocalUserById(id);
}

export async function requireUserId(): Promise<number> {
  const id = await getSessionUserId();
  if (!id) throw new Error("UNAUTHORIZED");
  return id;
}
