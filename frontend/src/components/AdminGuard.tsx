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

  if (state === "loading") return <p className="p-8 text-sm text-ink-2">Loading…</p>;
  if (state === "forbidden")
    return (
      <main className="mx-auto max-w-xl px-6 py-20 text-center">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">
          Admins only
        </h1>
        <p className="mt-3 text-ink-2">Your account doesn&apos;t have admin access.</p>
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
    <div className="border-b border-ink/10 bg-cream/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-2.5 text-xs text-ink-2">
        <span>
          Signed in as <strong className="text-ink">{user.email}</strong> · Admin
        </span>
        <div className="flex gap-5">
          <a href="/admin" className="transition hover:text-terracotta">
            Dashboard
          </a>
          <a href="/admin/categories" className="transition hover:text-terracotta">
            Categories
          </a>
          <a href="/admin/recipes" className="transition hover:text-terracotta">
            Recipes
          </a>
        </div>
      </div>
    </div>
  );
}
