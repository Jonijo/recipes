"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { RecipeDetail, recipesApi } from "@/lib/api";
import { RecipeForm } from "@/components/RecipeForm";

export default function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    recipesApi
      .getAdmin(id)
      .then(setRecipe)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, [id]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="text-sm text-stone-500">
        <Link href="/admin/recipes" className="hover:underline">
          Recipes
        </Link>
        <span className="mx-2">/</span>
        <span>Edit</span>
      </div>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Edit recipe</h1>
      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}
      {!error && !recipe && <p className="mt-6 text-sm text-stone-500">Loading…</p>}
      {recipe && <RecipeForm initial={recipe} />}
    </main>
  );
}
