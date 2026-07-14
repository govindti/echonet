"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Comment } from "@/lib/types";
import { API_BASE } from "@/lib/client-api";

const AVATAR_COLORS = [
  "bg-violet-500", "bg-pink-500", "bg-sky-500", "bg-emerald-500",
  "bg-amber-500", "bg-rose-500", "bg-teal-500", "bg-indigo-500",
];
function avatarColor(name: string) {
  let n = 0;
  for (let i = 0; i < name.length; i++) n += name.charCodeAt(i);
  return AVATAR_COLORS[n % AVATAR_COLORS.length];
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr + "Z").getTime()) / 1000);
  if (seconds < 60) return "just now";
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d < 30 ? `${d}d ago` : new Date(dateStr + "Z").toLocaleDateString();
}

function CommentItem({ comment, depth = 0 }: { comment: Comment; depth?: number }) {
  const username = comment.user?.username || "unknown";
  const color = avatarColor(username);
  return (
    <div className={depth > 0 ? "ml-8 border-l-2 border-surface-100 dark:border-surface-800 pl-4" : ""}>
      <div className="py-3">
        <div className="flex items-start gap-2.5">
          <div className={`h-7 w-7 shrink-0 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold`}>
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-surface-800 dark:text-surface-200">{username}</span>
              <span className="text-xs text-surface-400 dark:text-surface-500">{timeAgo(comment.created_at)}</span>
            </div>
            <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">{comment.content}</p>
          </div>
        </div>
      </div>
      {comment.comments?.map((reply) => (
        <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function CommentSection({ postId, initialComments }: { postId: number; initialComments: Comment[] }) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setError("");
    setPending(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content: content.trim() }),
      });
      if (res.status === 401) { router.push("/login"); return; }
      if (!res.ok) {
        const body = await res.json();
        setError(body.error || "Failed to post comment");
        return;
      }
      setContent("");
      router.refresh();
    } catch { setError("Network error"); }
    finally { setPending(false); }
  }

  return (
    <section className="mt-5">
      {/* Comment input */}
      <form onSubmit={handleSubmit} className="mb-5">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment..."
          rows={2}
          className="w-full resize-none rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 px-4 py-3 text-sm text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 focus:border-brand-500 focus:bg-white dark:focus:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
        />
        {error && <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{error}</p>}
        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            disabled={pending || !content.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-50 shadow-sm"
          >
            {pending ? (
              <svg className="h-4 w-4 animate-spin-slow" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : null}
            {pending ? "Posting..." : "Comment"}
          </button>
        </div>
      </form>

      {/* Comments list */}
      {initialComments.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-surface-400 dark:text-surface-500">No comments yet — be the first!</p>
        </div>
      ) : (
        <div className="divide-y divide-surface-100 dark:divide-surface-800">
          {initialComments.map((c) => <CommentItem key={c.id} comment={c} />)}
        </div>
      )}
    </section>
  );
}
