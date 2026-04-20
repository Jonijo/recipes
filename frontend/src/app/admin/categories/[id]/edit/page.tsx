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
    <main className="mx-auto max-w-6xl px-6 pb-20 pt-12">
      <div className="text-[11px] font-semibold uppercase tracking-widest-er text-ink-2">
        <Link href="/admin/categories" className="transition hover:text-terracotta">
          Categories
        </Link>
        <span className="mx-2 text-ink/30">/</span>
        <span>Edit</span>
      </div>
      <h1 className="mt-3 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-ink">
        Edit category
      </h1>
      {error && <p className="mt-6 text-sm text-terracotta">{error}</p>}
      {!error && !category && <p className="mt-6 text-sm text-ink-2">Loading…</p>}
      {category && <CategoryForm initial={category} />}
    </main>
  );
}
