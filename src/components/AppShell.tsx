"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV: { section: string; items: { href: string; label: string; icon: string }[] }[] = [
  {
    section: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: "🏠" },
      { href: "/profile", label: "Health Profile", icon: "👤" },
      { href: "/reports", label: "Reports & Analytics", icon: "📊" },
    ],
  },
  {
    section: "AI Copilot",
    items: [
      { href: "/assessment", label: "Health Assessment", icon: "🧪" },
      { href: "/symptom-checker", label: "Symptom Checker", icon: "🔎" },
      { href: "/chat", label: "AI Chatbot", icon: "🤖" },
    ],
  },
  {
    section: "Tracking",
    items: [
      { href: "/cycle", label: "Cycle Center", icon: "🩸" },
      { href: "/wellness", label: "Mental Wellness", icon: "💗" },
      { href: "/medications", label: "Medications", icon: "💊" },
      { href: "/appointments", label: "Appointments", icon: "📅" },
      { href: "/records", label: "Health Records", icon: "📁" },
    ],
  },
  {
    section: "Life Stages",
    items: [
      { href: "/pregnancy", label: "Pregnancy Hub", icon: "🤰" },
      { href: "/menopause", label: "Menopause Hub", icon: "🌸" },
    ],
  },
  {
    section: "Explore",
    items: [
      { href: "/learn", label: "Learning Center", icon: "📚" },
      { href: "/nutrition", label: "Nutrition", icon: "🥗" },
      { href: "/fitness", label: "Fitness", icon: "🏃‍♀️" },
      { href: "/academy", label: "Academy", icon: "🎓" },
      { href: "/community", label: "Community", icon: "💬" },
    ],
  },
];

export default function AppShell({
  children,
  userName,
  points,
  streak,
}: {
  children: ReactNode;
  userName: string;
  points: number;
  streak: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="text-2xl">🌸</span>
        <span className="text-lg font-black text-pink-700">FemCare AI</span>
      </div>
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-4">
        {NAV.map((group) => (
          <div key={group.section}>
            <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {group.section}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                      active ? "bg-pink-600 text-white shadow" : "text-slate-600 hover:bg-rose-100"
                    }`}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-rose-100 bg-white lg:block">
        {sidebar}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-white shadow-xl">{sidebar}</aside>
        </div>
      )}

      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-rose-100 bg-white/80 px-4 py-3 backdrop-blur sm:px-6">
          <button className="rounded-lg p-2 text-slate-600 hover:bg-rose-100 lg:hidden" onClick={() => setOpen(true)}>
            ☰
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <span className="chip bg-amber-100 text-amber-700">🔥 {streak}d</span>
            <span className="chip bg-fuchsia-100 text-fuchsia-700">⭐ {points} pts</span>
            <div className="hidden text-right sm:block">
              <div className="text-sm font-semibold text-slate-700">{userName}</div>
            </div>
            <button onClick={logout} className="rounded-lg bg-rose-100 px-3 py-1.5 text-xs font-semibold text-pink-700 hover:bg-rose-200">
              Log out
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">{children}</main>

        <footer className="mx-auto max-w-6xl px-6 py-8 text-center text-xs text-slate-400">
          🌸 FemCare AI · Educational information only — not a substitute for professional medical care. In an emergency, call your local emergency number.
        </footer>
      </div>
    </div>
  );
}
