import Link from "next/link";
import type { PostWithMetaData } from "@/lib/types";

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

export default function PostCard({ post }: { post: PostWithMetaData }) {
  return (
    <article className="group rounded-2xl border border-surface-200 bg-white p-5 transition-all hover:border-surface-300 hover:shadow-md dark:border-surface-800 dark:bg-surface-900 dark:hover:border-surface-700 dark:hover:shadow-lg dark:hover:shadow-black/20">
      <div className="mb-3 flex items-center gap-3">
        <Link
          href={`/profile/${post.user_id}`}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700 transition hover:bg-brand-200 dark:bg-brand-900/50 dark:text-brand-300 dark:hover:bg-brand-900/70"
        >
          {post.user?.username?.charAt(0).toUpperCase() || "?"}
        </Link>
        <div className="flex-1">
          <Link
            href={`/profile/${post.user_id}`}
            className="text-sm font-semibold text-surface-800 transition hover:text-brand-600 dark:text-surface-200 dark:hover:text-brand-400"
          >
            {post.user?.username || "unknown"}
          </Link>
          <p className="text-xs text-surface-400 dark:text-surface-500">
            {timeAgo(post.created_at)}
          </p>
        </div>
      </div>

      <Link href={`/posts/${post.id}`} className="block">
        <h2 className="mb-2 text-lg font-bold text-surface-900 transition group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
          {post.title}
        </h2>
      </Link>

      <Link href={`/posts/${post.id}`}>
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-surface-500 dark:text-surface-400">
          {post.content}
        </p>
      </Link>

      <div className="flex items-center gap-2">
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-1 flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg bg-surface-100 px-2 py-1 text-xs font-medium text-surface-600 dark:bg-surface-800 dark:text-surface-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-1 text-surface-400 dark:text-surface-500">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
            />
          </svg>
          <span className="text-xs font-medium">
            {post.comment_count}{" "}
            {post.comment_count === 1 ? "comment" : "comments"}
          </span>
        </div>
      </div>
    </article>
  );
}
