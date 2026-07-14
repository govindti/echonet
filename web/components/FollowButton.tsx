"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { API_BASE } from "@/lib/client-api";

export default function FollowButton({ userId }: { userId: number }) {
  const [following, setFollowing] = useState(false);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function toggle() {
    setPending(true);
    const endpoint = following ? "unfollow" : "follow";
    try {
      const res = await fetch(`${API_BASE}/api/v1/users/${userId}/${endpoint}`, {
        method: "PUT",
        credentials: "include",
      });
      if (res.status === 401) { router.push("/login"); return; }
      if (res.ok || res.status === 204 || res.status === 409) {
        setFollowing(!following);
        router.refresh();
      }
    } catch { /* silently fail */ }
    finally { setPending(false); }
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all disabled:opacity-50 shadow-sm ${
        following
          ? "border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 hover:border-red-300 hover:text-red-600 dark:hover:border-red-700 dark:hover:text-red-400 bg-white dark:bg-surface-800"
          : "bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/20"
      }`}
    >
      {pending ? (
        <svg className="h-4 w-4 animate-spin-slow" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : following ? (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
        </svg>
      ) : (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
        </svg>
      )}
      {following ? "Following" : "Follow"}
    </button>
  );
}
