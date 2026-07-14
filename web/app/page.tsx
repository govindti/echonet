import { apiFetch } from "@/lib/api";
import type { PostWithMetaData } from "@/lib/types";
import PostCard from "@/components/PostCard";
import FeedControls from "@/components/FeedControls";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage(props: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await props.searchParams;
  const params = new URLSearchParams();
  if (sp.limit) params.set("limit", sp.limit);
  if (sp.offset) params.set("offset", sp.offset);
  if (sp.sort) params.set("sort", sp.sort);
  if (sp.tags) params.set("tags", sp.tags);
  if (sp.search) params.set("search", sp.search);

  let posts: PostWithMetaData[] = [];
  try {
    posts = await apiFetch<PostWithMetaData[]>(`/api/v1/users/feed${params.toString() ? `?${params}` : ""}`);
  } catch {
    posts = [];
  }

  const currentOffset = Number(sp.offset) || 0;
  const currentLimit = Number(sp.limit) || 20;
  const currentSort = (sp.sort as "asc" | "desc") || "desc";

  function buildPageUrl(offset: number) {
    const p = new URLSearchParams();
    if (sp.search) p.set("search", sp.search);
    if (sp.tags) p.set("tags", sp.tags);
    p.set("sort", currentSort);
    p.set("offset", String(offset));
    p.set("limit", String(currentLimit));
    return `/?${p.toString()}`;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <div className="flex gap-6">
        {/* Main feed */}
        <div className="flex-1 min-w-0">
          <FeedControls
            initialSearch={sp.search || ""}
            initialTags={sp.tags || ""}
            initialSort={currentSort}
          />

          {posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-900 py-20 text-center">
              <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
                <svg className="h-7 w-7 text-surface-400" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                </svg>
              </div>
              <p className="text-base font-semibold text-surface-700 dark:text-surface-300">Nothing here yet</p>
              <p className="mt-1 text-sm text-surface-400 dark:text-surface-500">Follow people or create your first post</p>
              <Link href="/posts/new" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition-colors shadow-sm">
                Create a post
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => <PostCard key={post.id} post={post} />)}
            </div>
          )}

          {/* Pagination */}
          {(currentOffset > 0 || posts.length === currentLimit) && (
            <div className="mt-6 flex items-center justify-between">
              {currentOffset > 0 ? (
                <a href={buildPageUrl(Math.max(0, currentOffset - currentLimit))} className="inline-flex items-center gap-2 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 px-4 py-2 text-sm font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                  </svg>
                  Previous
                </a>
              ) : <div />}
              {posts.length === currentLimit && (
                <a href={buildPageUrl(currentOffset + currentLimit)} className="inline-flex items-center gap-2 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 px-4 py-2 text-sm font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                  Next
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0 space-y-4">
          <div className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-5">
            <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-3">What&apos;s EchoNet?</h3>
            <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
              A developer-focused social platform. Share ideas, follow people, and join the conversation.
            </p>
            <div className="mt-4 space-y-2">
              <Link href="/posts/new" className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors shadow-sm shadow-brand-600/20">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Create a post
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-5">
            <h3 className="text-sm font-bold text-surface-900 dark:text-white mb-3">Tips</h3>
            <ul className="space-y-2.5 text-sm text-surface-500 dark:text-surface-400">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-brand-600 dark:text-brand-400 text-xs font-bold">1</span>
                Follow users to see their posts in your feed
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-brand-600 dark:text-brand-400 text-xs font-bold">2</span>
                Use tags to categorize your posts
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-brand-600 dark:text-brand-400 text-xs font-bold">3</span>
                Search by keyword or filter by tag
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
