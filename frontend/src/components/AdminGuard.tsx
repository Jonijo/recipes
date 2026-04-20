"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiError, authApi } from "@/lib/api";
import { User } from "@/lib/auth";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [state, setState] = useState<"loading" | "forbidden" | "ok">("loading");

  useEffect(() => {
    authApi
      .me()
      .then((u) => {
        if (u.role !== "ADMIN") {
          setState("forbidden");
          return;
        }
        setUser(u);
        setState("ok");
      })
      .catch((e) => {
        if (e instanceof ApiError && e.status === 401) {
          router.replace("/login");
          return;
        }
        setState("forbidden");
      });
  }, [router]);

  if (state === "loading") return <p className="p-8 text-sm text-stone-500">Loading…</p>;
  if (state === "forbidden")
    return (
      <main className="mx-auto max-w-xl px-6 py-16 text-center">
        <h1 className="text-2xl font-bold">Admins only</h1>
        <p className="mt-2 text-stone-600">Your account doesn&apos;t have admin access.</p>
      </main>
    );

  return (
    <>
      <AdminHeader user={user!} />
      {children}
    </>
  );
}

function AdminHeader({ user }: { user: User }) {
  return (
    <div className="border-b border-stone-200 bg-stone-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2 text-xs text-stone-600">
        <span>
          Signed in as <strong className="text-stone-900">{user.email}</strong> · Admin
        </span>
        <div className="flex gap-4">
          <a href="/admin" className="hover:underline">
            Dashboard
          </a>
          <a href="/admin/categories" className="hover:underline">
            Categories
          </a>
          <a href="/admin/recipes" className="hover:underline">
            Recipes
          </a>
        </div>
      </div>
    </div>
  );
}
