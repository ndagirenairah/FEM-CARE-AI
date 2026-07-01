"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui";
import { COMMUNITY_SPACES } from "@/lib/content";

type Post = { id: number; space: string; displayName: string; anonymous: boolean; content: string; likes: number; createdAt: string };

export default function CommunityPage() {
  const [space, setSpace] = useState(COMMUNITY_SPACES[0].slug);
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [anon, setAnon] = useState(true);

  async function load(s: string) {
    const d = await fetch(`/api/community?space=${s}`).then((r) => r.json());
    setPosts(d.posts || []);
  }
  useEffect(() => {
    load(space);
  }, [space]);

  async function post(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    await fetch("/api/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ space, content, anonymous: anon }),
    });
    setContent("");
    load(space);
  }
  async function like(id: number) {
    await fetch("/api/community", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load(space);
  }

  const current = COMMUNITY_SPACES.find((s) => s.slug === space)!;

  return (
    <div>
      <PageHeader emoji="💬" title="Community" subtitle="Moderated, supportive spaces — participate anonymously if you prefer." />

      <div className="mb-4 flex flex-wrap gap-2">
        {COMMUNITY_SPACES.map((s) => (
          <button
            key={s.slug}
            onClick={() => setSpace(s.slug)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${space === s.slug ? "bg-pink-600 text-white" : "bg-white text-slate-600 ring-1 ring-rose-100 hover:bg-rose-50"}`}
          >
            {s.emoji} {s.name}
          </button>
        ))}
      </div>

      <form onSubmit={post} className="card mb-6">
        <h2 className="font-bold text-slate-800">Share in {current.emoji} {current.name}</h2>
        <textarea className="input mt-3 min-h-[80px]" placeholder="Share your thoughts, questions or support…" value={content} onChange={(e) => setContent(e.target.value)} />
        <div className="mt-3 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={anon} onChange={(e) => setAnon(e.target.checked)} className="accent-pink-600" />
            Post anonymously
          </label>
          <button className="btn-primary">Post</button>
        </div>
      </form>

      <div className="space-y-3">
        {posts.length === 0 ? (
          <div className="card text-sm text-slate-400">No posts yet. Be the first to start a conversation 💗</div>
        ) : (
          posts.map((p) => (
            <div key={p.id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 text-sm">{p.anonymous ? "🌸" : p.displayName[0]?.toUpperCase()}</div>
                  <div>
                    <div className="text-sm font-semibold text-slate-700">{p.displayName}</div>
                    <div className="text-[10px] text-slate-400">{new Date(p.createdAt).toLocaleString()}</div>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-700">{p.content}</p>
              <button onClick={() => like(p.id)} className="mt-3 text-sm font-medium text-pink-600 hover:text-pink-700">
                💗 {p.likes}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
