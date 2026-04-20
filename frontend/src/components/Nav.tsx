"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiError, authApi } from "@/lib/api";
import { clearToken, getToken, User } from "@/lib/auth";

export function Nav() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      setChecked(true);
      return;
    }
    authApi
      .me()
      .then((u) => setUser(u))
      .catch((e) => {
        if (e instanceof ApiError && e.status === 401) clearToken();
      })
      .finally(() => setChecked(true));
  }, [pathname]);

  function logout() {
    clearToken();
    setUser(null);
    router.push("/");
  }

  return (
    <header className="border-b border-stone-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Recipes
        </Link>
        <div className="flex items-center gap-5 text-sm">
          <Link href="/recipes" className="hover:underline">
            Browse
          </Link>
          {checked && user?.role === "ADMIN" && (
            <Link href="/admin" className="hover:underline">
              Admin
            </Link>
          )}
          {checked && user && (
            <>
              <Link href="/account" className="hover:underline">
                Account
              </Link>
              <button onClick={logout} className="text-stone-600 hover:underline">
                Log out
              </button>
            </>
          )}
          {checked && !user && (
            <>
              <Link href="/login" className="hover:underline">
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-stone-900 px-3 py-1.5 text-white hover:bg-stone-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
