import { readFile, writeFile } from "fs/promises";
import { join } from "path";

export type LocalUser = {
  id: number;
  email: string;
  passwordHash: string;
  name: string;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  points: number;
  streak: number;
  lastActiveDate: string | null;
  createdAt: string;
};

type LocalAuthStore = {
  users: LocalUser[];
};

const STORE_PATH = join(process.cwd(), ".femcare-local-auth.json");

async function readStore(): Promise<LocalAuthStore> {
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<LocalAuthStore>;
    return { users: Array.isArray(parsed.users) ? parsed.users : [] };
  } catch {
    return { users: [] };
  }
}

async function writeStore(store: LocalAuthStore) {
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

function normalizeEmail(email: string) {
  return String(email).toLowerCase().trim();
}

export async function findLocalUserByEmail(email: string): Promise<LocalUser | null> {
  const store = await readStore();
  const normalized = normalizeEmail(email);
  return store.users.find((user) => user.email === normalized) ?? null;
}

export async function findLocalUserById(id: number): Promise<LocalUser | null> {
  const store = await readStore();
  return store.users.find((user) => user.id === id) ?? null;
}

export async function createLocalUser(input: {
  email: string;
  passwordHash: string;
  name: string;
}): Promise<LocalUser> {
  const store = await readStore();
  const user: LocalUser = {
    id: store.users.reduce((maxId, current) => Math.max(maxId, current.id), 0) + 1,
    email: normalizeEmail(input.email),
    passwordHash: input.passwordHash,
    name: String(input.name).trim(),
    emergencyContactName: null,
    emergencyContactPhone: null,
    points: 0,
    streak: 0,
    lastActiveDate: null,
    createdAt: new Date().toISOString(),
  };

  store.users.push(user);
  await writeStore(store);
  return user;
}