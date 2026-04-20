"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiError, authApi } from "@/lib/api";
import { clearToken, User } from "@/lib/auth";
import { Eyebrow } from "@/components/Eyebrow";
import { Badge } from "@/components/Badge";

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
    return <p className="p-8 text-sm text-ink-2">Loading…</p>;
  }

  if (!user) return null;

  return (
    <main className="mx-auto max-w-2xl px-6 pb-20 pt-16">
      <Eyebrow>Your account</Eyebrow>
      <h1 className="mt-3 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-ink">
        Hello, <span className="italic text-terracotta">{user.name.split(" ")[0]}</span>.
      </h1>

      <div className="mt-12 rounded-3xl border border-ink/10 bg-paper p-8">
        <dl className="grid grid-cols-1 gap-y-6 sm:grid-cols-[auto_1fr] sm:gap-x-10">
          <Row label="Name" value={user.name} />
          <Row label="Email" value={user.email} />
          <div className="contents">
            <dt className="text-[11px] font-semibold uppercase tracking-widest-er text-ink-2 sm:pt-1">
              Role
            </dt>
            <dd>
              {user.role === "ADMIN" ? (
                <Badge variant="premium">Admin</Badge>
              ) : (
                <Badge variant="neutral">Member</Badge>
              )}
            </dd>
          </div>
        </dl>
      </div>

      <button
        onClick={logout}
        className="mt-8 rounded-full border border-ink/15 bg-paper px-5 py-2.5 text-sm font-medium text-ink transition hover:border-terracotta hover:text-terracotta"
      >
        Log out
      </button>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="contents">
      <dt className="text-[11px] font-semibold uppercase tracking-widest-er text-ink-2 sm:pt-1">
        {label}
      </dt>
      <dd className="font-display text-xl text-ink">{value}</dd>
    </div>
  );
}
