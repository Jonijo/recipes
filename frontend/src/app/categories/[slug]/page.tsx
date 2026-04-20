"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiError, Category, RecipeSummary, categoriesApi, recipesApi } from "@/lib/api";
import { RecipeCard } from "@/components/RecipeCard";

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

  if (loading) return <p className="p-8 text-sm text-stone-500">Loading…</p>;
  if (error || !category)
    return (
      <main className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="text-lg">{error ?? "Category not found."}</p>
        <Link href="/recipes" className="mt-4 inline-block text-sm underline">
          Back to recipes
        </Link>
      </main>
    );

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
      {category.description && (
        <p className="mt-2 max-w-2xl text-stone-600">{category.description}</p>
      )}

      <div className="mt-8">
        {recipes.length === 0 ? (
          <p className="text-stone-500">No recipes in this category yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
