"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ApiError, Category, CategoryRequest, categoriesApi } from "@/lib/api";
import { ImageUploader } from "./ImageUploader";

export function CategoryForm({ initial }: { initial?: Category }) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [imageUrl, setImageUrl] = useState<string | null>(initial?.imageUrl ?? null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const body: CategoryRequest = {
      name,
      description: description || undefined,
      imageUrl: imageUrl ?? undefined,
    };
    try {
      if (initial) await categoriesApi.update(initial.id, body);
      else await categoriesApi.create(body);
      router.push("/admin/categories");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Save failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 max-w-xl space-y-6">
      <div className="flex flex-col gap-1 text-sm">
        <label htmlFor="name" className="font-medium">
          Name
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={255}
          className="rounded-md border border-stone-300 bg-white px-3 py-2 focus:border-stone-500 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1 text-sm">
        <label htmlFor="description" className="font-medium">
          Description
        </label>
        <textarea
          id="description"
          value={description ?? ""}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="rounded-md border border-stone-300 bg-white px-3 py-2 focus:border-stone-500 focus:outline-none"
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Image</p>
        <ImageUploader value={imageUrl} onChange={setImageUrl} />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50"
        >
          {submitting ? "Saving…" : initial ? "Save changes" : "Create category"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/categories")}
          className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm hover:bg-stone-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
