import Link from "next/link";
import type { PostWithMetaData } from "@/lib/types";

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
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return new Date(dateStr + "Z").toLocaleDateString("en", { month: "short", day: "numeric" });
}

export default function PostCard({ post }: { post: PostWithMetaData }) {
  const username = post.user?.username || "unknown";
  const initial = username.charAt(0).toUpperCase();
  const color = avatarColor(username);

  return (
    <article className="group bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-5 transition-all hover:shadow-lg hover:shadow-black/5 hover:border-surface-300 dark:hover:border-surface-700 dark:hover:shadow-black/30 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <Link href={`/profile/${post.user_id}`} className="shrink-0">
          <div className={`h-10 w-10 rounded-full ${color} flex items-center justify-center text-white text-sm font-bold shadow-sm ring-2 ring-white dark:ring-surface-900`}>
            {initial}
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link href={`/profile/${post.user_id}`} className="text-sm font-semibold text-surface-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              {username}
            </Link>
            <span className="text-surface-300 dark:text-surface-600 text-xs">·</span>
            <span className="text-xs text-surface-400 dark:text-surface-500">{timeAgo(post.created_at)}</span>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs text-brand-600 dark:text-brand-400 font-medium">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <Link href={`/posts/${post.id}`} className="block group/link">
        <h2 className="text-base font-bold text-surface-900 dark:text-white mb-1.5 group-hover/link:text-brand-600 dark:group-hover/link:text-brand-400 transition-colors leading-snug">
          {post.title}
        </h2>
        <p className="text-sm text-surface-500 dark:text-surface-400 line-clamp-2 leading-relaxed">
          {post.content}
        </p>
      </Link>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-surface-100 dark:border-surface-800 flex items-center gap-4">
        <Link href={`/posts/${post.id}`} className="flex items-center gap-1.5 text-surface-400 dark:text-surface-500 hover:text-brand-500 dark:hover:text-brand-400 transition-colors group/btn">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
          </svg>
          <span className="text-xs font-medium">{post.comment_count}</span>
        </Link>
        <div className="ml-auto flex items-center gap-1.5">
          {post.tags && post.tags.length > 3 && (
            <span className="text-xs text-surface-400 dark:text-surface-500">+{post.tags.length - 3} tags</span>
          )}
          <Link href={`/posts/${post.id}`} className="text-xs text-surface-400 dark:text-surface-500 hover:text-brand-500 dark:hover:text-brand-400 transition-colors font-medium">
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}
