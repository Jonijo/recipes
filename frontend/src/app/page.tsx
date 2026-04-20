"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Category, RecipeSummary, categoriesApi, recipesApi } from "@/lib/api";
import { RecipeCard } from "@/components/RecipeCard";
import { CategoryCard } from "@/components/CategoryCard";

export default function Home() {
  const [featured, setFeatured] = useState<RecipeSummary[]>([]);
  const [latest, setLatest] = useState<RecipeSummary[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      recipesApi.listPublic({ featured: true, size: 6 }),
      recipesApi.listPublic({ size: 6 }),
      categoriesApi.list(),
    ])
      .then(([f, l, c]) => {
        setFeatured(f.content);
        setLatest(l.content);
        setCategories(c);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <section className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Recipes to cook tonight</h1>
        <p className="mt-2 max-w-2xl text-stone-600">
          Browse hand-picked recipes from our kitchen. Sign up to unlock premium collections.
        </p>
        <div className="mt-6">
          <Link
            href="/recipes"
            className="inline-flex items-center rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
          >
            Browse all recipes
          </Link>
        </div>
      </section>

      {loading ? (
        <p className="text-sm text-stone-500">Loading…</p>
      ) : (
        <>
          {featured.length > 0 && (
            <Section title="Featured">
              <Grid>
                {featured.map((r) => (
                  <RecipeCard key={r.id} recipe={r} />
                ))}
              </Grid>
            </Section>
          )}

          {categories.length > 0 && (
            <Section title="Categories">
              <Grid>
                {categories.map((c) => (
                  <CategoryCard key={c.id} category={c} />
                ))}
              </Grid>
            </Section>
          )}

          {latest.length > 0 && (
            <Section title="Latest">
              <Grid>
                {latest.map((r) => (
                  <RecipeCard key={r.id} recipe={r} />
                ))}
              </Grid>
            </Section>
          )}

          {featured.length === 0 && latest.length === 0 && (
            <p className="text-stone-500">
              No recipes yet. Sign in as an admin to publish the first one.
            </p>
          )}
        </>
      )}
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="mb-4 text-2xl font-bold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}
