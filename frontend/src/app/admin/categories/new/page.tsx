"use client";

import Link from "next/link";
import { CategoryForm } from "@/components/CategoryForm";

export default function NewCategoryPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="text-sm text-stone-500">
        <Link href="/admin/categories" className="hover:underline">
          Categories
        </Link>
        <span className="mx-2">/</span>
        <span>New</span>
      </div>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">New category</h1>
      <CategoryForm />
    </main>
  );
}
