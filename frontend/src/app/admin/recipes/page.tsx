"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiError, RecipeSummary, recipesApi } from "@/lib/api";
import { Badge } from "@/components/Badge";

export default function AdminRecipesPage() {
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  function reload() {
    setLoading(true);
    recipesApi
      .listAdmin({ size: 100 })
      .then((p) => setRecipes(p.content))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }

  useEffect(reload, []);

  async function togglePublish(r: RecipeSummary) {
    setBusyId(r.id);
    try {
      if (r.published) await recipesApi.unpublish(r.id);
      else await recipesApi.publish(r.id);
      reload();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  async function onDelete(r: RecipeSummary) {
    if (!confirm(`Delete recipe "${r.title}"?`)) return;
    setBusyId(r.id);
    try {
      await recipesApi.delete(r.id);
      reload();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-6 pb-20 pt-12">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-5xl font-semibold leading-[1.02] tracking-tight text-ink">
          Recipes
        </h1>
        <Link
          href="/admin/recipes/new"
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:bg-terracotta"
        >
          New recipe
        </Link>
      </div>

      <div className="mt-10 overflow-hidden rounded-3xl border border-ink/10 bg-paper">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink/10 bg-cream/60 text-[11px] uppercase tracking-widest-er text-ink-2">
            <tr>
              <th className="px-5 py-4">Title</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Access</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-ink-2">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-terracotta">
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && recipes.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-ink-2">
                  No recipes yet.
                </td>
              </tr>
            )}
            {recipes.map((r) => (
              <tr key={r.id} className="border-b border-ink/5 last:border-0">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-ink">{r.title}</span>
                    {r.featured && <Badge variant="premium">Featured</Badge>}
                  </div>
                </td>
                <td className="px-5 py-4 text-ink-2">{r.category.name}</td>
                <td className="px-5 py-4">
                  {r.accessType === "PREMIUM" ? (
                    <Badge variant="premium">Premium</Badge>
                  ) : (
                    <Badge variant="neutral">Free</Badge>
                  )}
                </td>
                <td className="px-5 py-4">
                  {r.published ? (
                    <Badge variant="published">Published</Badge>
                  ) : (
                    <Badge variant="draft">Draft</Badge>
                  )}
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => togglePublish(r)}
                    disabled={busyId === r.id}
                    className="text-ink transition hover:text-terracotta disabled:opacity-50"
                  >
                    {r.published ? "Unpublish" : "Publish"}
                  </button>
                  <span className="mx-3 text-ink/20">|</span>
                  <Link
                    href={`/admin/recipes/${r.id}/edit`}
                    className="text-ink transition hover:text-terracotta"
                  >
                    Edit
                  </Link>
                  <span className="mx-3 text-ink/20">|</span>
                  <button
                    onClick={() => onDelete(r)}
                    disabled={busyId === r.id}
                    className="text-terracotta transition hover:underline disabled:opacity-50"
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
