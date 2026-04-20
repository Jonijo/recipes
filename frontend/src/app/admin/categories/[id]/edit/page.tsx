"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { use } from "react";
import { Category, categoriesApi } from "@/lib/api";
import { CategoryForm } from "@/components/CategoryForm";

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [category, setCategory] = useState<Category | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    categoriesApi
      .list()
      .then((all) => {
        const found = all.find((c) => c.id === id);
        if (!found) setError("Category not found");
        else setCategory(found);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, [id]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="text-sm text-stone-500">
        <Link href="/admin/categories" className="hover:underline">
          Categories
        </Link>
        <span className="mx-2">/</span>
        <span>Edit</span>
      </div>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Edit category</h1>
      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}
      {!error && !category && <p className="mt-6 text-sm text-stone-500">Loading…</p>}
      {category && <CategoryForm initial={category} />}
    </main>
  );
}
