"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminStats, adminApi } from "@/lib/api";
import { Eyebrow } from "@/components/Eyebrow";

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.stats().then(setStats).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 pb-20 pt-12">
      <Eyebrow>Admin</Eyebrow>
      <h1 className="mt-2 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-ink">
        Dashboard
      </h1>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Recipes" value={stats?.recipesCount} loading={loading} />
        <StatCard label="Published" value={stats?.publishedCount} loading={loading} />
        <StatCard label="Categories" value={stats?.categoriesCount} loading={loading} />
        <StatCard label="Users" value={stats?.usersCount} loading={loading} />
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2">
        <QuickLink href="/admin/categories" title="Categories" description="Create and edit recipe categories." />
        <QuickLink href="/admin/recipes" title="Recipes" description="Manage recipes, publish, and mark premium." />
        <QuickLink href="/admin/categories/new" title="New category" description="Add a new category." />
        <QuickLink href="/admin/recipes/new" title="New recipe" description="Draft a new recipe." />
      </div>
    </main>
  );
}

function StatCard({ label, value, loading }: { label: string; value?: number; loading: boolean }) {
  return (
    <div className="rounded-3xl border border-ink/10 bg-paper p-6">
      <p className="text-[11px] font-semibold uppercase tracking-widest-er text-ink-2">{label}</p>
      <p className="mt-2 font-display text-4xl font-semibold text-ink">
        {loading ? "…" : value ?? 0}
      </p>
    </div>
  );
}

function QuickLink({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-ink/10 bg-paper p-6 transition hover:-translate-y-0.5 hover:border-terracotta"
    >
      <p className="font-display text-2xl font-semibold leading-tight tracking-tight text-ink transition group-hover:text-terracotta">
        {title}
      </p>
      <p className="mt-2 text-sm text-ink-2">{description}</p>
    </Link>
  );
}
