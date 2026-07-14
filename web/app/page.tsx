import { apiFetch } from "@/lib/api";
import type { PostWithMetaData } from "@/lib/types";
import PostCard from "@/components/PostCard";
import FeedControls from "@/components/FeedControls";

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

  const qs = params.toString();
  let posts: PostWithMetaData[] = [];

  try {
    posts = await apiFetch<PostWithMetaData[]>(
      `/api/v1/users/feed${qs ? `?${qs}` : ""}`
    );
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
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-surface-900 dark:text-white">
          Feed
        </h1>
        <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
          Discover what the community is sharing
        </p>
      </div>

      <FeedControls
        initialSearch={sp.search || ""}
        initialTags={sp.tags || ""}
        initialSort={currentSort}
      />

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-surface-300 bg-white py-16 text-center dark:border-surface-700 dark:bg-surface-900">
          <svg
            className="mx-auto mb-4 h-12 w-12 text-surface-300 dark:text-surface-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
          <p className="text-lg font-medium text-surface-600 dark:text-surface-400">
            No posts found
          </p>
          <p className="mt-1 text-sm text-surface-400 dark:text-surface-500">
            Try adjusting your filters or create a new post
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        {currentOffset > 0 ? (
          <a
            href={buildPageUrl(Math.max(0, currentOffset - currentLimit))}
            className="inline-flex items-center gap-2 rounded-xl border border-surface-200 bg-white px-4 py-2.5 text-sm font-medium text-surface-700 transition hover:border-surface-300 hover:bg-surface-50 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-300 dark:hover:border-surface-600 dark:hover:bg-surface-800"
          >
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
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            Previous
          </a>
        ) : (
          <div />
        )}
        {posts.length === currentLimit && (
          <a
            href={buildPageUrl(currentOffset + currentLimit)}
            className="inline-flex items-center gap-2 rounded-xl border border-surface-200 bg-white px-4 py-2.5 text-sm font-medium text-surface-700 transition hover:border-surface-300 hover:bg-surface-50 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-300 dark:hover:border-surface-600 dark:hover:bg-surface-800"
          >
            Next
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
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
