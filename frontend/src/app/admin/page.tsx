"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminStats, adminApi } from "@/lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.stats().then(setStats).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Admin dashboard</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Recipes" value={stats?.recipesCount} loading={loading} />
        <StatCard label="Published" value={stats?.publishedCount} loading={loading} />
        <StatCard label="Categories" value={stats?.categoriesCount} loading={loading} />
        <StatCard label="Users" value={stats?.usersCount} loading={loading} />
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
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
    <div className="rounded-lg border border-stone-200 bg-white p-5">
      <p className="text-xs uppercase tracking-wide text-stone-500">{label}</p>
      <p className="mt-1 text-3xl font-bold">{loading ? "…" : value ?? 0}</p>
    </div>
  );
}

function QuickLink({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-stone-200 bg-white p-5 transition hover:border-stone-400"
    >
      <p className="text-lg font-semibold">{title}</p>
      <p className="mt-1 text-sm text-stone-600">{description}</p>
    </Link>
  );
}
