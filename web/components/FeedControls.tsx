"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";

export default function FeedControls({
  initialSearch,
  initialTags,
  initialSort,
}: {
  initialSearch: string;
  initialTags: string;
  initialSort: string;
}) {
  const [search, setSearch] = useState(initialSearch);
  const [tags, setTags] = useState(initialTags);
  const [sort, setSort] = useState(initialSort);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const p = new URLSearchParams();
    if (search) p.set("search", search);
    if (tags) p.set("tags", tags);
    p.set("sort", sort);
    p.set("limit", "20");
    p.set("offset", "0");
    startTransition(() => router.push(`/?${p.toString()}`));
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 py-2.5 pl-9 pr-4 text-sm text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
          />
        </div>
        <input
          type="text"
          placeholder="Filter by tag..."
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 px-4 py-2.5 text-sm text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors sm:w-40"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 px-3 py-2.5 text-sm text-surface-700 dark:text-surface-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors"
        >
          <option value="desc">Newest</option>
          <option value="asc">Oldest</option>
        </select>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-brand-600 hover:bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50 shadow-sm"
        >
          {isPending ? (
            <svg className="h-4 w-4 animate-spin-slow mx-auto" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : "Search"}
        </button>
      </div>
    </form>
  );
}
