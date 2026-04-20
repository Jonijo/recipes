"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiError, RecipeDetail, imageUrl, recipesApi } from "@/lib/api";
import { PremiumBadge } from "@/components/PremiumBadge";

export default function RecipeDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    recipesApi
      .get(slug)
      .then(setRecipe)
      .catch((e) => {
        if (e instanceof ApiError && e.status === 404) setError("Recipe not found.");
        else setError("Something went wrong.");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p className="p-8 text-sm text-stone-500">Loading…</p>;
  if (error || !recipe)
    return (
      <main className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="text-lg">{error ?? "Recipe not found."}</p>
        <Link href="/recipes" className="mt-4 inline-block text-sm underline">
          Back to recipes
        </Link>
      </main>
    );

  const img = imageUrl(recipe.imageUrl);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <nav className="mb-6 text-sm text-stone-500">
        <Link href="/recipes" className="hover:underline">
          Recipes
        </Link>
        <span className="px-2">/</span>
        <Link href={`/categories/${recipe.category.slug}`} className="hover:underline">
          {recipe.category.name}
        </Link>
      </nav>

      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{recipe.title}</h1>
        {recipe.accessType === "PREMIUM" && <PremiumBadge />}
      </div>

      {recipe.shortDescription && (
        <p className="mt-2 text-lg text-stone-600">{recipe.shortDescription}</p>
      )}

      {img && (
        <div className="mt-6 aspect-[16/9] w-full overflow-hidden rounded-lg bg-stone-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img} alt={recipe.title} className="h-full w-full object-cover" />
        </div>
      )}

      <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-stone-600">
        {recipe.prepTime != null && (
          <Fact label="Prep" value={`${recipe.prepTime} min`} />
        )}
        {recipe.cookTime != null && (
          <Fact label="Cook" value={`${recipe.cookTime} min`} />
        )}
        {recipe.servings != null && (
          <Fact label="Servings" value={String(recipe.servings)} />
        )}
        {recipe.difficulty && <Fact label="Difficulty" value={recipe.difficulty} />}
      </dl>

      {recipe.description && (
        <section className="mt-8">
          <p className="whitespace-pre-line text-stone-800">{recipe.description}</p>
        </section>
      )}

      {recipe.ingredientsText && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Ingredients</h2>
          <pre className="mt-3 whitespace-pre-wrap font-sans text-stone-800">
            {recipe.ingredientsText}
          </pre>
        </section>
      )}

      {recipe.stepsText && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">Steps</h2>
          <pre className="mt-3 whitespace-pre-wrap font-sans text-stone-800">
            {recipe.stepsText}
          </pre>
        </section>
      )}
    </main>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-stone-500">{label}</dt>
      <dd className="font-medium text-stone-800">{value}</dd>
    </div>
  );
}
