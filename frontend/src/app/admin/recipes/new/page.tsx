"use client";

import Link from "next/link";
import { RecipeForm } from "@/components/RecipeForm";

export default function NewRecipePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="text-sm text-stone-500">
        <Link href="/admin/recipes" className="hover:underline">
          Recipes
        </Link>
        <span className="mx-2">/</span>
        <span>New</span>
      </div>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">New recipe</h1>
      <RecipeForm />
    </main>
  );
}
