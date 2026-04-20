"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiError, Category, RecipeSummary, categoriesApi, imageUrl, recipesApi } from "@/lib/api";
import { RecipeCard } from "@/components/RecipeCard";
import { Eyebrow } from "@/components/Eyebrow";
import { PantryIcon } from "@/components/PantryIcon";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    Promise.all([
      categoriesApi.get(slug),
      recipesApi.listPublic({ category: slug, size: 24 }),
    ])
      .then(([c, r]) => {
        setCategory(c);
        setRecipes(r.content);
      })
      .catch((e) => {
        if (e instanceof ApiError && e.status === 404) setError("Category not found.");
        else setError("Something went wrong.");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p className="p-8 text-sm text-ink-2">Loading…</p>;
  if (error || !category)
    return (
      <main className="mx-auto max-w-2xl px-6 py-20 text-center">
        <p className="font-display text-2xl italic text-ink">
          {error ?? "Category not found."}
        </p>
        <Link
          href="/recipes"
          className="mt-4 inline-block text-sm text-terracotta underline-offset-4 hover:underline"
        >
          ← Back to recipes
        </Link>
      </main>
    );

  const img = imageUrl(category.imageUrl);

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-10 sm:pt-16">
      <nav className="text-xs uppercase tracking-widest-er text-ink-2">
        <Link href="/recipes" className="transition hover:text-ink">
          Recipes
        </Link>
        <span className="px-2" aria-hidden>
          ·
        </span>
        <span className="text-ink">{category.name}</span>
      </nav>

      <header className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <Eyebrow>Category</Eyebrow>
          <h1 className="mt-3 font-display text-6xl font-semibold leading-[0.98] tracking-tight text-ink sm:text-7xl">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-2">
              {category.description}
            </p>
          )}
          <p className="mt-6 text-sm text-ink-2">
            {recipes.length === 0
              ? "No recipes here yet."
              : `${recipes.length} ${recipes.length === 1 ? "recipe" : "recipes"}`}
          </p>
        </div>
        <div className="lg:col-span-5">
          <div className="grain relative aspect-[4/3] overflow-hidden rounded-3xl bg-cream">
            {img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={img}
                alt={category.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-ink-2/40">
                <PantryIcon className="h-24 w-24" />
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="mt-16">
        {recipes.length === 0 ? (
          <p className="text-ink-2">No recipes in this category yet.</p>
        ) : (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((r) => (
              <RecipeCard key={r.id} recipe={r} size="sm" />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
