"use client";

import Link from "next/link";
import { CategoryForm } from "@/components/CategoryForm";

export default function NewCategoryPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 pb-20 pt-12">
      <div className="text-[11px] font-semibold uppercase tracking-widest-er text-ink-2">
        <Link href="/admin/categories" className="transition hover:text-terracotta">
          Categories
        </Link>
        <span className="mx-2 text-ink/30">/</span>
        <span>New</span>
      </div>
      <h1 className="mt-3 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-ink">
        New category
      </h1>
      <CategoryForm />
    </main>
  );
}
