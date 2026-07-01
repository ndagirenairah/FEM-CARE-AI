"use client";

import { useRef, useState, useEffect } from "react";
import { PageHeader } from "@/components/ui";

type Msg = { role: "user" | "ai"; text: string };

const SUGGESTIONS = [
  "Why is my period late?",
  "When am I most fertile?",
  "How can I ease period cramps?",
  "What is PCOS?",
  "Nutrition tips for iron",
  "What are menopause symptoms?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: "Hi! I'm your FemCare AI Copilot 🌸 Ask me anything about periods, fertility, pregnancy, menopause, nutrition, fitness or mental wellbeing." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });
    const d = await res.json();
    setMessages((m) => [...m, { role: "ai", text: d.reply || "Sorry, please try again." }]);
    setLoading(false);
  }

  return (
    <div>
      <PageHeader emoji="🤖" title="AI Health Copilot" subtitle="Your 24/7 women's health assistant." />

      <div className="card flex h-[65vh] flex-col p-0">
        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${
                  m.role === "user" ? "bg-pink-600 text-white" : "bg-rose-50 text-slate-700"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {loading && <div className="text-sm text-slate-400">Copilot is typing…</div>}
          <div ref={endRef} />
        </div>

        <div className="border-t border-rose-100 p-3">
          <div className="mb-2 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)} className="rounded-full bg-rose-50 px-3 py-1 text-xs text-slate-600 hover:bg-rose-100">
                {s}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2"
          >
            <input className="input" placeholder="Type your question…" value={input} onChange={(e) => setInput(e.target.value)} />
            <button className="btn-primary" disabled={loading}>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
