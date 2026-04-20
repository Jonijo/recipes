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
    <form onSubmit={onSubmit} className="mt-10 max-w-xl space-y-6 rounded-3xl border border-ink/10 bg-paper p-8">
      <Field label="Name" htmlFor="name">
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={255}
          className={inputCls}
        />
      </Field>

      <Field label="Description" htmlFor="description">
        <textarea
          id="description"
          value={description ?? ""}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className={inputCls}
        />
      </Field>

      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest-er text-ink-2">
          Image
        </p>
        <ImageUploader value={imageUrl} onChange={setImageUrl} />
      </div>

      {error && <p className="text-sm text-terracotta">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:bg-terracotta disabled:opacity-50"
        >
          {submitting ? "Saving…" : initial ? "Save changes" : "Create category"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/categories")}
          className="rounded-full border border-ink/15 bg-paper px-5 py-2.5 text-sm text-ink transition hover:border-terracotta hover:text-terracotta"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-2xl border border-ink/15 bg-paper px-4 py-3 text-base text-ink transition placeholder:text-ink-2/50 focus:border-terracotta focus:outline-none";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="flex flex-col gap-1.5 text-sm">
      <span className="text-[11px] font-semibold uppercase tracking-widest-er text-ink-2">
        {label}
      </span>
      {children}
    </label>
  );
}
