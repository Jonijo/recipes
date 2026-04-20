"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Category, RecipeSummary, categoriesApi, imageUrl, recipesApi } from "@/lib/api";
import { RecipeCard } from "@/components/RecipeCard";
import { CategoryCard } from "@/components/CategoryCard";
import { Badge } from "@/components/Badge";
import { Eyebrow } from "@/components/Eyebrow";
import { PantryIcon } from "@/components/PantryIcon";
import { Section } from "@/components/Section";

const ISSUE_LABEL = "Issue 01 · Spring 2026";

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

  const hero = featured[0] ?? latest[0] ?? null;

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-10 sm:pt-16">
      <Hero hero={hero} />

      {loading ? (
        <p className="mt-20 text-sm text-ink-2">Loading the kitchen…</p>
      ) : (
        <>
          {featured.length > 1 && (
            <Section
              eyebrow="Featured this week"
              title="Dishes we're cooking again and again"
              subtitle="The recipes the kitchen keeps coming back to — slow-simmered, well-tested, repeat-worthy."
            >
              <div className="grid gap-10 sm:grid-cols-2">
                {featured.slice(1, 5).map((r, i) => (
                  <div key={r.id} className={i % 2 === 1 ? "sm:mt-16" : ""}>
                    <RecipeCard recipe={r} size="md" />
                  </div>
                ))}
              </div>
            </Section>
          )}

          {categories.length > 0 && (
            <Section
              eyebrow="By category"
              title="What are you in the mood for?"
              action={
                <Link
                  href="/recipes"
                  className="hidden text-sm font-medium text-terracotta underline-offset-4 hover:underline sm:inline"
                >
                  All recipes →
                </Link>
              }
            >
              <div className="-mx-6 flex snap-x gap-5 overflow-x-auto px-6 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
                {categories.slice(0, 8).map((c) => (
                  <div key={c.id} className="w-64 shrink-0 snap-start sm:w-auto">
                    <CategoryCard category={c} />
                  </div>
                ))}
              </div>
            </Section>
          )}

          {latest.length > 0 && (
            <Section
              eyebrow="Latest"
              title="Just out of the oven"
              subtitle="Newest recipes from our kitchen."
            >
              <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {latest.slice(0, 6).map((r) => (
                  <RecipeCard key={r.id} recipe={r} size="sm" />
                ))}
              </div>
            </Section>
          )}

          {featured.length === 0 && latest.length === 0 && (
            <p className="mt-20 text-ink-2">
              No recipes yet. Sign in as an admin to publish the first one.
            </p>
          )}
        </>
      )}

      <Footer />
    </main>
  );
}

function Hero({ hero }: { hero: RecipeSummary | null }) {
  const img = imageUrl(hero?.imageUrl);
  return (
    <section className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-7">
        <div className="animate-fade-up [animation-delay:60ms]">
          <Eyebrow>{ISSUE_LABEL}</Eyebrow>
        </div>
        <h1 className="mt-4 animate-fade-up font-display text-[56px] font-semibold leading-[0.95] tracking-tight text-ink [animation-delay:160ms] sm:text-[72px] lg:text-[88px]">
          Recipes for
          <br />
          <span className="italic text-terracotta">every table.</span>
        </h1>
        <p className="mt-6 max-w-md animate-fade-up text-lg leading-relaxed text-ink-2 [animation-delay:260ms]">
          A warm little cookbook of weeknight dinners, weekend bakes and the slow Sundays
          in-between. Hand-tested in our kitchen, written the way we cook.
        </p>
        <div className="mt-8 flex animate-fade-up flex-wrap items-center gap-4 [animation-delay:360ms]">
          <Link
            href="/recipes"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:bg-terracotta"
          >
            Browse recipes
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="#featured"
            className="inline-flex items-center text-sm font-medium text-ink underline decoration-terracotta decoration-2 underline-offset-[6px] hover:decoration-[3px]"
          >
            What's new this week
          </Link>
        </div>
      </div>

      <div className="relative animate-fade-scale lg:col-span-5 [animation-delay:440ms]">
        <div className="grain relative aspect-[4/5] overflow-hidden rounded-[2.25rem] bg-cream">
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={img}
              alt={hero?.title ?? ""}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-ink-2/40">
              <PantryIcon className="h-24 w-24" />
            </div>
          )}
        </div>
        {hero && (
          <Link
            href={`/recipes/${hero.slug}`}
            className="absolute -bottom-6 left-4 w-[82%] max-w-sm rounded-2xl border border-ink/10 bg-paper p-5 shadow-[0_12px_40px_-12px_rgba(28,20,16,0.2)] transition hover:-translate-y-0.5 sm:-bottom-8 sm:left-6"
          >
            <div className="flex items-center gap-2">
              <Eyebrow>Editor&apos;s pick</Eyebrow>
              {hero.accessType === "PREMIUM" && <Badge variant="premium">Premium</Badge>}
            </div>
            <h3 className="mt-2 font-display text-2xl font-semibold leading-[1.1] tracking-tight text-ink">
              {hero.title}
            </h3>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest-er text-terracotta">
              {hero.category.name}
            </p>
          </Link>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-28 flex flex-col items-center gap-3 border-t border-ink/10 pt-10 text-center">
      <span className="font-display text-2xl italic tracking-tight text-ink">Recipes</span>
      <p className="text-xs uppercase tracking-widest-er text-ink-2">
        A warm little cookbook · {new Date().getFullYear()}
      </p>
    </footer>
  );
}
