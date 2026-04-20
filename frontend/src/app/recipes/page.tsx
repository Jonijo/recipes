"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { Category, RecipeSummary, categoriesApi, recipesApi } from "@/lib/api";
import { RecipeCard } from "@/components/RecipeCard";

function RecipesView() {
  const router = useRouter();
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const category = params.get("category") ?? "";
  const page = Number(params.get("page") ?? 0);

  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(q);

  useEffect(() => {
    setSearch(q);
  }, [q]);

  useEffect(() => {
    categoriesApi.list().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    recipesApi
      .listPublic({ q: q || undefined, category: category || undefined, page, size: 12 })
      .then((res) => {
        setRecipes(res.content);
        setTotalPages(res.totalPages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [q, category, page]);

  function applyFilters(next: { q?: string; category?: string; page?: number }) {
    const sp = new URLSearchParams();
    const effectiveQ = next.q ?? q;
    const effectiveCat = next.category ?? category;
    const effectivePage = next.page ?? 0;
    if (effectiveQ) sp.set("q", effectiveQ);
    if (effectiveCat) sp.set("category", effectiveCat);
    if (effectivePage > 0) sp.set("page", String(effectivePage));
    router.push(`/recipes${sp.toString() ? `?${sp}` : ""}`);
  }

  function onSearch(e: FormEvent) {
    e.preventDefault();
    applyFilters({ q: search, page: 0 });
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold tracking-tight">All recipes</h1>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <form onSubmit={onSearch} className="flex flex-1 min-w-[240px] items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recipes…"
            className="flex-1 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:border-stone-500 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
          >
            Search
          </button>
        </form>
        <select
          value={category}
          onChange={(e) => applyFilters({ category: e.target.value, page: 0 })}
          className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-8">
        {loading ? (
          <p className="text-sm text-stone-500">Loading…</p>
        ) : recipes.length === 0 ? (
          <p className="text-stone-500">No recipes match your search.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4 text-sm">
          <button
            disabled={page <= 0}
            onClick={() => applyFilters({ page: page - 1 })}
            className="rounded-md border border-stone-300 px-3 py-1.5 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-stone-600">
            Page {page + 1} of {totalPages}
          </span>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() => applyFilters({ page: page + 1 })}
            className="rounded-md border border-stone-300 px-3 py-1.5 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}

export default function RecipesPage() {
  return (
    <Suspense fallback={<p className="p-8 text-sm text-stone-500">Loading…</p>}>
      <RecipesView />
    </Suspense>
  );
}
