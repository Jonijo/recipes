"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiError, RecipeSummary, recipesApi } from "@/lib/api";

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
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Recipes</h1>
        <Link
          href="/admin/recipes/new"
          className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
        >
          New recipe
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-stone-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Access</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-stone-500">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-red-600">
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && recipes.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-stone-500">
                  No recipes yet.
                </td>
              </tr>
            )}
            {recipes.map((r) => (
              <tr key={r.id} className="border-b border-stone-100 last:border-0">
                <td className="px-4 py-3 font-medium">
                  {r.title}
                  {r.featured && (
                    <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                      FEATURED
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-stone-600">{r.category.name}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      r.accessType === "PREMIUM"
                        ? "rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800"
                        : "rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600"
                    }
                  >
                    {r.accessType}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      r.published
                        ? "rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800"
                        : "rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600"
                    }
                  >
                    {r.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => togglePublish(r)}
                    disabled={busyId === r.id}
                    className="text-stone-700 hover:underline disabled:opacity-50"
                  >
                    {r.published ? "Unpublish" : "Publish"}
                  </button>
                  <span className="mx-2 text-stone-300">|</span>
                  <Link
                    href={`/admin/recipes/${r.id}/edit`}
                    className="text-stone-700 hover:underline"
                  >
                    Edit
                  </Link>
                  <span className="mx-2 text-stone-300">|</span>
                  <button
                    onClick={() => onDelete(r)}
                    disabled={busyId === r.id}
                    className="text-red-600 hover:underline disabled:opacity-50"
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
