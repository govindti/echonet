import { apiFetch } from "@/lib/api";
import type { User, Post } from "@/lib/types";
import FollowButton from "@/components/FollowButton";
import Link from "next/link";

export const dynamic = "force-dynamic";

const AVATAR_COLORS = [
  "bg-violet-500", "bg-pink-500", "bg-sky-500", "bg-emerald-500",
  "bg-amber-500", "bg-rose-500", "bg-teal-500", "bg-indigo-500",
];
const COVER_GRADIENTS = [
  "from-violet-500 to-purple-700",
  "from-pink-500 to-rose-700",
  "from-sky-500 to-blue-700",
  "from-emerald-500 to-teal-700",
  "from-amber-500 to-orange-700",
];
function avatarColor(name: string) {
  let n = 0;
  for (let i = 0; i < name.length; i++) n += name.charCodeAt(i);
  return AVATAR_COLORS[n % AVATAR_COLORS.length];
}
function coverGradient(name: string) {
  let n = 0;
  for (let i = 0; i < name.length; i++) n += name.charCodeAt(i);
  return COVER_GRADIENTS[n % COVER_GRADIENTS.length];
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr + "Z").getTime()) / 1000);
  if (seconds < 60) return "just now";
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d < 30 ? `${d}d ago` : new Date(dateStr + "Z").toLocaleDateString("en", { month: "short", day: "numeric" });
}

export default async function ProfilePage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  let user: User;
  try {
    user = await apiFetch<User>(`/api/v1/users/${id}`);
  } catch {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-xl font-bold text-surface-900 dark:text-white mb-2">User not found</h1>
        <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors">
          ← Back to feed
        </Link>
      </div>
    );
  }

  let posts: Post[] = [];
  try {
    const feed = await apiFetch<Post[]>(`/api/v1/users/feed?limit=50&sort=desc`);
    posts = (feed || []).filter((p: Post) => String(p.user_id) === id);
  } catch { posts = []; }

  const color = avatarColor(user.username);
  const gradient = coverGradient(user.username);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      {/* Profile card */}
      <div className="rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 overflow-hidden mb-6">
        {/* Cover */}
        <div className={`h-36 bg-gradient-to-br ${gradient}`} />

        {/* Profile info */}
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-12 mb-4">
            <div className={`h-24 w-24 rounded-2xl ${color} flex items-center justify-center text-white text-4xl font-black shadow-xl ring-4 ring-white dark:ring-surface-900`}>
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="mb-1">
              <FollowButton userId={user.id} />
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">{user.username}</h1>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">{user.email}</p>
          </div>

          <div className="mt-4 flex items-center gap-5 text-sm">
            <div className="flex items-center gap-1.5 text-surface-500 dark:text-surface-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
              </svg>
              <span className="font-medium capitalize">{user.role?.name || "user"}</span>
            </div>
            <div className="flex items-center gap-1.5 text-surface-500 dark:text-surface-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
              <span>Joined {new Date(user.created_at + "Z").toLocaleDateString("en", { month: "long", year: "numeric" })}</span>
            </div>
            <div className="flex items-center gap-1.5 text-surface-500 dark:text-surface-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
              </svg>
              <span><strong className="text-surface-900 dark:text-white">{posts.length}</strong> posts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <h2 className="text-base font-bold text-surface-900 dark:text-white mb-3">Posts</h2>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-900 py-14 text-center">
          <p className="text-sm font-medium text-surface-500 dark:text-surface-400">No posts yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="group block rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 p-5 transition-all hover:shadow-md hover:border-surface-300 dark:hover:border-surface-700"
            >
              <h3 className="font-bold text-surface-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-1.5">
                {post.title}
              </h3>
              <p className="text-sm text-surface-500 dark:text-surface-400 line-clamp-2 leading-relaxed">
                {post.content}
              </p>
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                {post.tags?.slice(0, 4).map((tag) => (
                  <span key={tag} className="text-xs text-brand-600 dark:text-brand-400 font-medium">#{tag}</span>
                ))}
                <span className="ml-auto text-xs text-surface-400 dark:text-surface-500">{timeAgo(post.created_at)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
