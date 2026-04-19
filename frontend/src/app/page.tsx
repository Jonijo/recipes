import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-8 px-6 text-center">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Recipes</h1>
        <p className="mt-2 text-stone-600">
          Phase 1: authentication is online. Recipes and categories are coming in Phase 2.
        </p>
      </div>
      <div className="flex gap-3">
        <Link
          href="/login"
          className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
        >
          Log in
        </Link>
        <Link
          href="/register"
          className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium hover:bg-stone-100"
        >
          Register
        </Link>
      </div>
    </main>
  );
}
