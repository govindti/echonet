import { apiFetch } from "@/lib/api";
import type { Post } from "@/lib/types";
import Link from "next/link";
import CommentSection from "@/components/CommentSection";
import PostActions from "@/components/PostActions";

export const dynamic = "force-dynamic";

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr + "Z");
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}

export default async function PostDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  let post: Post;
  try {
    post = await apiFetch<Post>(`/api/v1/posts/${id}`);
  } catch {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-100 dark:bg-surface-800">
          <svg
            className="h-8 w-8 text-surface-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>
        <h1 className="mb-2 text-xl font-bold text-surface-900 dark:text-white">
          Post not found
        </h1>
        <p className="mb-6 text-surface-500 dark:text-surface-400">
          This post may have been deleted.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Back to feed
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-surface-500 transition hover:text-brand-600 dark:text-surface-400 dark:hover:text-brand-400"
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
        Back to feed
      </Link>

      <article className="rounded-2xl border border-surface-200 bg-white p-6 dark:border-surface-800 dark:bg-surface-900 sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/profile/${post.user_id}`}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700 transition hover:bg-brand-200 dark:bg-brand-900/50 dark:text-brand-300 dark:hover:bg-brand-900/70"
            >
              {post.user?.username?.charAt(0).toUpperCase() || "?"}
            </Link>
            <div>
              <Link
                href={`/profile/${post.user_id}`}
                className="text-sm font-semibold text-surface-800 transition hover:text-brand-600 dark:text-surface-200 dark:hover:text-brand-400"
              >
                {post.user?.username || "unknown"}
              </Link>
              <div className="flex items-center gap-2 text-xs text-surface-400 dark:text-surface-500">
                <time>{timeAgo(post.created_at)}</time>
                {post.updated_at !== post.created_at && (
                  <>
                    <span>&middot;</span>
                    <span className="italic">edited</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <PostActions postId={post.id} />
        </div>

        <h1 className="mb-4 text-2xl font-bold leading-tight tracking-tight text-surface-900 dark:text-white sm:text-3xl">
          {post.title}
        </h1>

        <div className="whitespace-pre-wrap text-base leading-relaxed text-surface-600 dark:text-surface-300">
          {post.content}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 dark:bg-brand-950/50 dark:text-brand-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>

      <CommentSection postId={post.id} initialComments={post.comments || []} />
    </div>
  );
}
