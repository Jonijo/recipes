"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiError, authApi } from "@/lib/api";
import { clearToken, User } from "@/lib/auth";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authApi
      .me()
      .then((u) => setUser(u))
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          router.replace("/login");
          return;
        }
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [router]);

  function logout() {
    clearToken();
    router.replace("/login");
  }

  if (loading) {
    return <p className="p-8 text-sm text-stone-500">Loading…</p>;
  }

  if (!user) return null;

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-bold">Your account</h1>
      <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
        <dt className="font-medium text-stone-500">Name</dt>
        <dd>{user.name}</dd>
        <dt className="font-medium text-stone-500">Email</dt>
        <dd>{user.email}</dd>
        <dt className="font-medium text-stone-500">Role</dt>
        <dd>{user.role}</dd>
      </dl>
      <button
        onClick={logout}
        className="mt-8 rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium hover:bg-stone-100"
      >
        Log out
      </button>
    </main>
  );
}
