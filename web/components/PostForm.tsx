"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { API_BASE } from "@/lib/client-api";

export default function PostForm({
  mode,
  initialTitle,
  initialContent,
  initialTags,
  postId,
}: {
  mode: "create" | "edit";
  initialTitle?: string;
  initialContent?: string;
  initialTags?: string;
  postId?: number;
}) {
  const [title, setTitle] = useState(initialTitle || "");
  const [content, setContent] = useState(initialContent || "");
  const [tagsStr, setTagsStr] = useState(initialTags || "");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setPending(true);
    const tags = tagsStr.split(",").map((t) => t.trim()).filter(Boolean);
    try {
      const url = mode === "create" ? `${API_BASE}/api/v1/posts` : `${API_BASE}/api/v1/posts/${postId}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, content, tags }),
      });
      if (res.status === 401) { router.push("/login"); return; }
      if (!res.ok) {
        const body = await res.json();
        setError(body.error || "Something went wrong");
        return;
      }
      const { data } = await res.json();
      router.push(`/posts/${data.id}`);
    } catch { setError("Network error"); }
    finally { setPending(false); }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
          {mode === "create" ? "Create a post" : "Edit post"}
        </h1>
        <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
          {mode === "create" ? "Share something with the community" : "Update your post"}
        </p>
      </div>

      <div className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-6">
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-sm font-medium text-red-700 dark:text-red-400 flex items-center gap-2">
            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
              Title
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 px-4 py-3 text-sm text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 focus:border-brand-500 focus:bg-white dark:focus:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
              Content
            </label>
            <textarea
              id="content"
              required
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post..."
              className="w-full resize-none rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 px-4 py-3 text-sm text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 focus:border-brand-500 focus:bg-white dark:focus:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
              Tags <span className="font-normal text-surface-400">(comma separated)</span>
            </label>
            <input
              id="tags"
              type="text"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              placeholder="go, web, tutorial"
              className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 px-4 py-3 text-sm text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 focus:border-brand-500 focus:bg-white dark:focus:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-surface-100 dark:border-surface-800">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand-600/20 transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pending ? (
                <svg className="h-4 w-4 animate-spin-slow" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : null}
              {pending ? (mode === "create" ? "Publishing..." : "Saving...") : (mode === "create" ? "Publish" : "Save changes")}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-xl border border-surface-200 dark:border-surface-700 px-5 py-2.5 text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
