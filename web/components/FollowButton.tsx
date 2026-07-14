"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { API_BASE } from "@/lib/client-api";

export default function FollowButton({ userId }: { userId: number }) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleFollow() {
    setPending(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/users/${userId}/follow`, {
        method: "PUT",
        credentials: "include",
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      router.refresh();
    } catch {
      // silently fail
    } finally {
      setPending(false);
    }
  }

  async function handleUnfollow() {
    setPending(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/users/${userId}/unfollow`, {
        method: "PUT",
        credentials: "include",
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      router.refresh();
    } catch {
      // silently fail
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleFollow}
        disabled={pending}
        className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 active:scale-[0.98] disabled:opacity-50"
      >
        {pending ? (
          <svg
            className="h-4 w-4 animate-spin-slow"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : (
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
            />
          </svg>
        )}
        Follow
      </button>
      <button
        onClick={handleUnfollow}
        disabled={pending}
        className="rounded-xl border border-surface-300 px-4 py-2 text-sm font-medium text-surface-700 transition hover:bg-surface-50 dark:border-surface-700 dark:text-surface-300 dark:hover:bg-surface-800 disabled:opacity-50"
      >
        Unfollow
      </button>
    </div>
  );
}
