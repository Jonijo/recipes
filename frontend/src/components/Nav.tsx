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
  const [scrolled, setScrolled] = useState(false);

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function logout() {
    clearToken();
    setUser(null);
    router.push("/");
  }

  return (
    <header
      className={`sticky top-0 z-40 bg-paper transition-shadow ${
        scrolled ? "border-b border-ink/10 shadow-[0_1px_0_rgba(28,20,16,0.04)]" : ""
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="flex items-baseline gap-2 font-display text-[22px] font-semibold leading-none tracking-tight text-ink"
        >
          <span className="italic">Recipes</span>
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-terracotta" />
        </Link>
        <div className="flex items-center gap-7 text-sm">
          <NavLink href="/recipes" active={pathname?.startsWith("/recipes")}>
            Browse
          </NavLink>
          {checked && user?.role === "ADMIN" && (
            <NavLink href="/admin" active={pathname?.startsWith("/admin")}>
              Admin
            </NavLink>
          )}
          {checked && user && (
            <>
              <NavLink href="/account" active={pathname === "/account"}>
                Account
              </NavLink>
              <button
                onClick={logout}
                className="text-ink-2 transition hover:text-ink"
              >
                Log out
              </button>
            </>
          )}
          {checked && !user && (
            <>
              <NavLink href="/login" active={pathname === "/login"}>
                Log in
              </NavLink>
              <Link
                href="/register"
                className="rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-paper transition hover:bg-terracotta"
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

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`relative text-[13px] font-medium transition ${
        active ? "text-ink" : "text-ink-2 hover:text-ink"
      }`}
    >
      {children}
      {active && (
        <span
          aria-hidden
          className="absolute -bottom-1.5 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-terracotta"
        />
      )}
    </Link>
  );
}
