"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { API_BASE } from "@/lib/client-api";

const AVATAR_COLORS = [
  "bg-violet-500", "bg-pink-500", "bg-sky-500", "bg-emerald-500",
  "bg-amber-500", "bg-rose-500", "bg-teal-500", "bg-indigo-500",
];
function avatarColor(name: string) {
  let n = 0;
  for (let i = 0; i < name.length; i++) n += name.charCodeAt(i);
  return AVATAR_COLORS[n % AVATAR_COLORS.length];
}

export default function Navbar() {
  const [user, setUser] = useState<{ id: number; username: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie.split("; ").find((c) => c.startsWith("token="))?.split("=")[1];
    if (!token) { setLoading(false); return; }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      fetch(`${API_BASE}/api/v1/users/${payload.sub}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((b) => { if (b?.data) setUser(b.data); })
        .catch(() => {})
        .finally(() => setLoading(false));
    } catch { setLoading(false); }
  }, []);

  function handleLogout() {
    document.cookie = "token=; path=/; max-age=0";
    setUser(null);
    setMenuOpen(false);
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-surface-200 dark:border-surface-800 bg-white/90 dark:bg-surface-950/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-surface-900 dark:text-white">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-sm font-black shadow-md shadow-brand-600/30">
            E
          </div>
          <span className="text-lg tracking-tight">EchoNet</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {loading ? (
            <div className="h-8 w-24 animate-pulse rounded-xl bg-surface-100 dark:bg-surface-800" />
          ) : user ? (
            <>
              <Link
                href="/posts/new"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm shadow-brand-600/25 transition-all hover:shadow-md"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Post
              </Link>

              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 px-2.5 py-1.5 text-sm font-medium text-surface-700 dark:text-surface-300 transition hover:border-surface-300 dark:hover:border-surface-600"
                >
                  <div className={`h-6 w-6 rounded-full ${avatarColor(user.username)} flex items-center justify-center text-white text-xs font-bold`}>
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block max-w-[100px] truncate">{user.username}</span>
                  <svg className={`h-3.5 w-3.5 text-surface-400 transition-transform ${menuOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {menuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 z-50 mt-2 w-52 animate-fade-in overflow-hidden rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 shadow-xl shadow-black/10 dark:shadow-black/40">
                      <div className="px-4 py-3 border-b border-surface-100 dark:border-surface-700">
                        <div className={`h-10 w-10 rounded-full ${avatarColor(user.username)} flex items-center justify-center text-white font-bold mb-2`}>
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <p className="text-sm font-semibold text-surface-900 dark:text-white">{user.username}</p>
                      </div>
                      <div className="py-1.5">
                        <Link href={`/profile/${user.id}`} onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
                          <svg className="h-4 w-4 text-surface-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                          </svg>
                          View Profile
                        </Link>
                        <Link href="/posts/new" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
                          <svg className="h-4 w-4 text-surface-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                          </svg>
                          New Post
                        </Link>
                      </div>
                      <div className="border-t border-surface-100 dark:border-surface-700 py-1.5">
                        <button onClick={handleLogout} className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                          </svg>
                          Sign out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="rounded-xl px-3.5 py-1.5 text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                Sign in
              </Link>
              <Link href="/register" className="rounded-xl bg-brand-600 hover:bg-brand-700 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm shadow-brand-600/25 transition-all hover:shadow-md">
                Join now
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
