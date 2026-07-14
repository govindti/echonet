import { apiFetch } from "@/lib/api";
import type { Post } from "@/lib/types";
import Link from "next/link";
import CommentSection from "@/components/CommentSection";
import PostActions from "@/components/PostActions";

export const dynamic = "force-dynamic";

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
  if (d < 30) return `${d}d ago`;
  return new Date(dateStr + "Z").toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" });
}

export default async function PostDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  let post: Post;
  try {
    post = await apiFetch<Post>(`/api/v1/posts/${id}`);
  } catch {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
          <svg className="h-8 w-8 text-surface-400" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-surface-900 dark:text-white mb-2">Post not found</h1>
        <p className="text-surface-500 dark:text-surface-400 mb-6">This post may have been deleted.</p>
        <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors">
          ← Back to feed
        </Link>
      </div>
    );
  }

  const username = post.user?.username || "unknown";
  const color = avatarColor(username);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-surface-500 dark:text-surface-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors mb-5">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Feed
      </Link>

      <article className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 overflow-hidden">
        {/* Post header */}
        <div className="p-6 pb-0">
          <div className="flex items-start justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <Link href={`/profile/${post.user_id}`}>
                <div className={`h-11 w-11 rounded-full ${color} flex items-center justify-center text-white font-bold text-base shadow-sm ring-2 ring-white dark:ring-surface-900`}>
                  {username.charAt(0).toUpperCase()}
                </div>
              </Link>
              <div>
                <Link href={`/profile/${post.user_id}`} className="text-sm font-semibold text-surface-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  {username}
                </Link>
                <div className="flex items-center gap-1.5 text-xs text-surface-400 dark:text-surface-500 mt-0.5">
                  <time>{timeAgo(post.created_at)}</time>
                  {post.updated_at !== post.created_at && (
                    <><span>·</span><span className="italic">edited</span></>
                  )}
                </div>
              </div>
            </div>
            <PostActions postId={post.id} />
          </div>

          <h1 className="text-2xl font-bold text-surface-900 dark:text-white leading-tight mb-4">
            {post.title}
          </h1>

          <div className="text-base text-surface-600 dark:text-surface-300 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-lg bg-brand-50 dark:bg-brand-950/40 px-2.5 py-1 text-xs font-semibold text-brand-700 dark:text-brand-300">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Stats bar */}
        <div className="mx-6 mt-5 py-3 border-t border-surface-100 dark:border-surface-800 flex items-center gap-4 text-sm text-surface-500 dark:text-surface-400">
          <div className="flex items-center gap-1.5">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
            </svg>
            <span>{post.comments?.length || 0} {post.comments?.length === 1 ? "comment" : "comments"}</span>
          </div>
        </div>

        <div className="px-6 pb-6">
          <CommentSection postId={post.id} initialComments={post.comments || []} />
        </div>
      </article>
    </div>
  );
}
