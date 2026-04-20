"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ClockIcon,
  FireIcon,
  UsersIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { ApiError, RecipeDetail, imageUrl, recipesApi } from "@/lib/api";
import { Badge } from "@/components/Badge";
import { Eyebrow } from "@/components/Eyebrow";
import { MetaChip } from "@/components/MetaChip";
import { PantryIcon } from "@/components/PantryIcon";

function splitLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.replace(/^[-*•\d.\)\s]+/, "").trim())
    .filter(Boolean);
}

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

  if (loading) return <p className="p-8 text-sm text-ink-2">Loading…</p>;
  if (error || !recipe)
    return (
      <main className="mx-auto max-w-2xl px-6 py-20 text-center">
        <p className="font-display text-2xl italic text-ink">{error ?? "Recipe not found."}</p>
        <Link
          href="/recipes"
          className="mt-4 inline-block text-sm text-terracotta underline-offset-4 hover:underline"
        >
          ← Back to recipes
        </Link>
      </main>
    );

  const img = imageUrl(recipe.imageUrl);
  const ingredients = recipe.ingredientsText ? splitLines(recipe.ingredientsText) : [];
  const steps = recipe.stepsText ? splitLines(recipe.stepsText) : [];

  return (
    <main className="mx-auto max-w-5xl px-6 pb-24 pt-10 sm:pt-14">
      <nav className="flex items-center gap-2 text-xs uppercase tracking-widest-er text-ink-2">
        <Link href="/recipes" className="transition hover:text-ink">
          Recipes
        </Link>
        <span aria-hidden>·</span>
        <Link
          href={`/categories/${recipe.category.slug}`}
          className="text-terracotta transition hover:text-ink"
        >
          {recipe.category.name}
        </Link>
      </nav>

      <header className="mt-8 grid items-end gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          {recipe.accessType === "PREMIUM" && (
            <div className="mb-4">
              <Badge variant="premium">Premium recipe</Badge>
            </div>
          )}
          <h1 className="font-display text-[44px] font-semibold leading-[0.98] tracking-tight text-ink sm:text-6xl">
            {recipe.title}
          </h1>
          {recipe.shortDescription && (
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-2">
              {recipe.shortDescription}
            </p>
          )}
        </div>
        <div className="lg:col-span-5">
          <div className="grain relative aspect-[4/5] overflow-hidden rounded-3xl bg-cream">
            {img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={img} alt={recipe.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-ink-2/40">
                <PantryIcon className="h-24 w-24" />
              </div>
            )}
          </div>
        </div>
      </header>

      {(recipe.prepTime != null ||
        recipe.cookTime != null ||
        recipe.servings != null ||
        recipe.difficulty) && (
        <div className="mt-12 flex flex-wrap gap-3">
          {recipe.prepTime != null && (
            <MetaChip icon={ClockIcon} label="Prep" value={`${recipe.prepTime} min`} />
          )}
          {recipe.cookTime != null && (
            <MetaChip icon={FireIcon} label="Cook" value={`${recipe.cookTime} min`} />
          )}
          {recipe.servings != null && (
            <MetaChip
              icon={UsersIcon}
              label="Serves"
              value={String(recipe.servings)}
            />
          )}
          {recipe.difficulty && (
            <MetaChip icon={SparklesIcon} label="Level" value={recipe.difficulty} />
          )}
        </div>
      )}

      {recipe.description && (
        <section className="mt-14 max-w-2xl">
          <Eyebrow>The story</Eyebrow>
          <p className="mt-4 whitespace-pre-line text-lg leading-relaxed text-ink">
            {recipe.description}
          </p>
        </section>
      )}

      <div className="mt-16 grid gap-14 lg:grid-cols-12">
        {ingredients.length > 0 && (
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <Eyebrow>Ingredients</Eyebrow>
              <h2 className="mt-2 font-display text-3xl font-semibold leading-[1.05] tracking-tight text-ink">
                What you&apos;ll need
              </h2>
              <ul className="mt-6 flex flex-col gap-3.5">
                {ingredients.map((line, i) => (
                  <li key={i} className="flex items-baseline gap-3 text-ink">
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cream font-display text-xs font-semibold text-terracotta">
                      {i + 1}
                    </span>
                    <span className="text-[15px] leading-relaxed">{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}

        {steps.length > 0 && (
          <section className={ingredients.length > 0 ? "lg:col-span-8" : "lg:col-span-12"}>
            <Eyebrow>Method</Eyebrow>
            <h2 className="mt-2 font-display text-3xl font-semibold leading-[1.05] tracking-tight text-ink">
              How to cook it
            </h2>
            <ol className="mt-8 flex flex-col gap-8">
              {steps.map((line, i) => (
                <li key={i} className="grid grid-cols-[auto_1fr] gap-5 sm:gap-7">
                  <span className="font-display text-5xl font-semibold italic leading-none text-terracotta">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="pt-2 text-lg leading-relaxed text-ink">{line}</p>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>

      <div className="mt-24 border-t border-ink/10 pt-10">
        <Link
          href={`/categories/${recipe.category.slug}`}
          className="text-sm font-medium text-terracotta underline-offset-4 hover:underline"
        >
          More {recipe.category.name.toLowerCase()} recipes →
        </Link>
      </div>
    </main>
  );
}
