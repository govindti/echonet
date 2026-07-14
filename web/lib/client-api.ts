export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function clientFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = document.cookie
    .split("; ")
    .find((c) => c.startsWith("token="))
    ?.split("=")[1];

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const body = await res.json();

  if (!res.ok) {
    const msg = (body as { error?: string }).error || "Something went wrong";
    throw new Error(msg);
  }

  return (body as { data: T }).data;
}
