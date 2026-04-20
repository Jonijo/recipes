"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { Category, RecipeSummary, categoriesApi, recipesApi } from "@/lib/api";
import { RecipeCard } from "@/components/RecipeCard";
import { Eyebrow } from "@/components/Eyebrow";

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
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-10 sm:pt-16">
      <div className="max-w-3xl">
        <Eyebrow>The collection</Eyebrow>
        <h1 className="mt-3 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-ink sm:text-6xl">
          All recipes, <span className="italic text-terracotta">hand-tested.</span>
        </h1>
        <p className="mt-4 text-base text-ink-2">
          Search by name or pick a category. Everything here has been cooked in our kitchen at
          least twice.
        </p>
      </div>

      <form
        onSubmit={onSearch}
        className="mt-10 flex items-center gap-3 rounded-full border border-ink/10 bg-paper px-5 py-2 shadow-[0_1px_0_rgba(28,20,16,0.04)] focus-within:border-ink/30"
      >
        <SearchIcon className="h-5 w-5 text-ink-2" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pasta, roast chicken, lemon tart…"
          className="flex-1 bg-transparent py-2 font-display text-lg italic text-ink placeholder:text-ink-2/60 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper transition hover:bg-terracotta"
        >
          Search
        </button>
      </form>

      <div className="mt-6 -mx-6 flex gap-2 overflow-x-auto px-6 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        <CategoryPill
          label="All"
          active={!category}
          onClick={() => applyFilters({ category: "", page: 0 })}
        />
        {categories.map((c) => (
          <CategoryPill
            key={c.id}
            label={c.name}
            active={category === c.slug}
            onClick={() => applyFilters({ category: c.slug, page: 0 })}
          />
        ))}
      </div>

      <div className="mt-12">
        {loading ? (
          <p className="text-sm text-ink-2">Loading…</p>
        ) : recipes.length === 0 ? (
          <p className="text-ink-2">No recipes match your search.</p>
        ) : (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((r) => (
              <RecipeCard key={r.id} recipe={r} size="sm" />
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-16 flex items-center justify-center gap-4 text-sm">
          <button
            disabled={page <= 0}
            onClick={() => applyFilters({ page: page - 1 })}
            className="rounded-full border border-ink/15 px-4 py-2 text-ink transition hover:border-ink disabled:opacity-30"
          >
            ← Previous
          </button>
          <span className="text-ink-2">
            Page {page + 1} of {totalPages}
          </span>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() => applyFilters({ page: page + 1 })}
            className="rounded-full border border-ink/15 px-4 py-2 text-ink transition hover:border-ink disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      )}
    </main>
  );
}

function CategoryPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
        active
          ? "border-terracotta bg-terracotta text-paper"
          : "border-ink/15 text-ink-2 hover:border-terracotta hover:text-terracotta"
      }`}
    >
      {label}
    </button>
  );
}

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M20 20l-3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function RecipesPage() {
  return (
    <Suspense fallback={<p className="p-8 text-sm text-ink-2">Loading…</p>}>
      <RecipesView />
    </Suspense>
  );
}
