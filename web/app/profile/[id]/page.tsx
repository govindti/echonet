import { apiFetch } from "@/lib/api";
import type { User, Post } from "@/lib/types";
import FollowButton from "@/components/FollowButton";
import Link from "next/link";

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

export default async function ProfilePage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  let user: User;
  try {
    user = await apiFetch<User>(`/api/v1/users/${id}`);
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
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
        </div>
        <h1 className="mb-2 text-xl font-bold text-surface-900 dark:text-white">
          User not found
        </h1>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Back to feed
        </Link>
      </div>
    );
  }

  let posts: Post[] = [];
  try {
    const feed = await apiFetch<Post[]>(
      `/api/v1/users/feed?limit=50&sort=desc`
    );
    posts = (feed || []).filter((p: Post) => String(p.user_id) === id);
  } catch {
    posts = [];
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-8 overflow-hidden rounded-2xl border border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-900">
        <div className="h-32 bg-gradient-to-br from-brand-500 to-brand-700" />
        <div className="relative px-6 pb-6">
          <div className="-mt-12 mb-4 flex items-end justify-between">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-brand-100 text-3xl font-bold text-brand-700 shadow-lg dark:border-surface-900 dark:bg-brand-900/50 dark:text-brand-300">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <FollowButton userId={user.id} />
          </div>

          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
            {user.username}
          </h1>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            {user.email}
          </p>

          <div className="mt-4 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-surface-500 dark:text-surface-400">
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
                  d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6h.008v.008H6V6Z"
                />
              </svg>
              <span className="font-medium capitalize">{user.role?.name || "user"}</span>
            </div>
            <div className="flex items-center gap-1.5 text-surface-500 dark:text-surface-400">
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
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                />
              </svg>
              <span>Joined {new Date(user.created_at + "Z").toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <h2 className="mb-4 text-lg font-bold text-surface-900 dark:text-white">
        Posts
      </h2>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-surface-300 bg-white py-12 text-center dark:border-surface-700 dark:bg-surface-900">
          <svg
            className="mx-auto mb-3 h-10 w-10 text-surface-300 dark:text-surface-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
            />
          </svg>
          <p className="text-sm font-medium text-surface-500 dark:text-surface-400">
            No posts yet
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="group block rounded-2xl border border-surface-200 bg-white p-5 transition-all hover:border-surface-300 hover:shadow-md dark:border-surface-800 dark:bg-surface-900 dark:hover:border-surface-700 dark:hover:shadow-lg dark:hover:shadow-black/20"
            >
              <h3 className="font-bold text-surface-900 transition group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-400">
                {post.title}
              </h3>
              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-surface-500 dark:text-surface-400">
                {post.content}
              </p>
              <div className="mt-3 flex items-center gap-3">
                {post.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-surface-100 px-2 py-0.5 text-xs font-medium text-surface-600 dark:bg-surface-800 dark:text-surface-400"
                  >
                    #{tag}
                  </span>
                ))}
                <span className="ml-auto text-xs text-surface-400 dark:text-surface-500">
                  {timeAgo(post.created_at)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
