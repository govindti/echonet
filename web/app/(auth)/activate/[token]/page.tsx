import Link from "next/link";

async function activateUser(token: string) {
  const res = await fetch(
    `http://localhost:4000/api/v1/users/activate/${token}`,
    { method: "PUT" }
  );
  return res.ok;
}

export default async function ActivatePage(props: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await props.params;
  const success = await activateUser(token);

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md animate-fade-in text-center">
        <div
          className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${success ? "bg-green-100 dark:bg-green-950/50" : "bg-red-100 dark:bg-red-950/50"}`}
        >
          {success ? (
            <svg
              className="h-8 w-8 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
          ) : (
            <svg
              className="h-8 w-8 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          )}
        </div>

        <h1 className="mb-2 text-2xl font-bold text-surface-900 dark:text-white">
          {success ? "Account Activated" : "Activation Failed"}
        </h1>
        <p className="mb-8 text-surface-500 dark:text-surface-400">
          {success
            ? "Your account has been activated. You can now sign in."
            : "The activation link is invalid or has expired."}
        </p>

        <Link
          href={success ? "/login" : "/"}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700"
        >
          {success ? "Sign in" : "Go to Home"}
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
        </Link>
      </div>
    </div>
  );
}
