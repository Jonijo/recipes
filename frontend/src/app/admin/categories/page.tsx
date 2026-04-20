"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiError, Category, categoriesApi } from "@/lib/api";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function reload() {
    setLoading(true);
    categoriesApi
      .list()
      .then(setCategories)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }

  useEffect(reload, []);

  async function onDelete(id: string, name: string) {
    if (!confirm(`Delete category "${name}"?`)) return;
    try {
      await categoriesApi.delete(id);
      reload();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Delete failed");
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-6 pb-20 pt-12">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-5xl font-semibold leading-[1.02] tracking-tight text-ink">
          Categories
        </h1>
        <Link
          href="/admin/categories/new"
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:bg-terracotta"
        >
          New category
        </Link>
      </div>

      <div className="mt-10 overflow-hidden rounded-3xl border border-ink/10 bg-paper">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink/10 bg-cream/60 text-[11px] uppercase tracking-widest-er text-ink-2">
            <tr>
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Slug</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-ink-2">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-terracotta">
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && categories.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-8 text-center text-ink-2">
                  No categories yet.
                </td>
              </tr>
            )}
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-ink/5 last:border-0">
                <td className="px-5 py-4 font-medium text-ink">{c.name}</td>
                <td className="px-5 py-4 font-mono text-xs text-ink-2">{c.slug}</td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/admin/categories/${c.id}/edit`}
                    className="text-ink transition hover:text-terracotta"
                  >
                    Edit
                  </Link>
                  <span className="mx-3 text-ink/20">|</span>
                  <button
                    onClick={() => onDelete(c.id, c.name)}
                    className="text-terracotta transition hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
