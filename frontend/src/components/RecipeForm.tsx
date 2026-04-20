"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import {
  AccessType,
  ApiError,
  Category,
  RecipeDetail,
  RecipeRequest,
  categoriesApi,
  recipesApi,
} from "@/lib/api";
import { ImageUploader } from "./ImageUploader";

type Props = { initial?: RecipeDetail };

export function RecipeForm({ initial }: Props) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [shortDescription, setShortDescription] = useState(initial?.shortDescription ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [ingredientsText, setIngredientsText] = useState(initial?.ingredientsText ?? "");
  const [stepsText, setStepsText] = useState(initial?.stepsText ?? "");
  const [prepTime, setPrepTime] = useState<string>(initial?.prepTime?.toString() ?? "");
  const [cookTime, setCookTime] = useState<string>(initial?.cookTime?.toString() ?? "");
  const [servings, setServings] = useState<string>(initial?.servings?.toString() ?? "");
  const [difficulty, setDifficulty] = useState(initial?.difficulty ?? "");
  const [categoryId, setCategoryId] = useState(initial?.category.id ?? "");
  const [accessType, setAccessType] = useState<AccessType>(initial?.accessType ?? "FREE");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [imageUrl, setImageUrl] = useState<string | null>(initial?.imageUrl ?? null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    categoriesApi
      .list()
      .then((cs) => {
        setCategories(cs);
        if (!initial && !categoryId && cs.length > 0) setCategoryId(cs[0].id);
      })
      .catch((e) => setCategoriesError(e instanceof Error ? e.message : "Failed to load categories"));
  }, [initial, categoryId]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!categoryId) {
      setError("Pick a category first.");
      return;
    }
    setSubmitting(true);
    const body: RecipeRequest = {
      title,
      shortDescription: shortDescription || undefined,
      description: description || undefined,
      ingredientsText: ingredientsText || undefined,
      stepsText: stepsText || undefined,
      prepTime: prepTime ? parseInt(prepTime, 10) : null,
      cookTime: cookTime ? parseInt(cookTime, 10) : null,
      servings: servings ? parseInt(servings, 10) : null,
      difficulty: difficulty || undefined,
      categoryId,
      accessType,
      featured,
      imageUrl: imageUrl ?? undefined,
    };
    try {
      if (initial) await recipesApi.update(initial.id, body);
      else await recipesApi.create(body);
      router.push("/admin/recipes");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Save failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-10 max-w-3xl space-y-6 rounded-3xl border border-ink/10 bg-paper p-8">
      <Field label="Title" htmlFor="title">
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={255}
          className={inputCls}
        />
      </Field>

      <Field label="Short description" htmlFor="shortDescription">
        <input
          id="shortDescription"
          value={shortDescription ?? ""}
          onChange={(e) => setShortDescription(e.target.value)}
          maxLength={500}
          className={inputCls}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Category" htmlFor="category">
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className={inputCls}
          >
            <option value="" disabled>
              {categoriesError ? "Failed to load" : "Select a category"}
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {categoriesError && (
            <p className="text-xs text-terracotta">{categoriesError}</p>
          )}
        </Field>

        <Field label="Access" htmlFor="accessType">
          <select
            id="accessType"
            value={accessType}
            onChange={(e) => setAccessType(e.target.value as AccessType)}
            className={inputCls}
          >
            <option value="FREE">Free</option>
            <option value="PREMIUM">Premium</option>
          </select>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-4">
        <Field label="Prep (min)" htmlFor="prepTime">
          <input
            id="prepTime"
            type="number"
            min={0}
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Cook (min)" htmlFor="cookTime">
          <input
            id="cookTime"
            type="number"
            min={0}
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Servings" htmlFor="servings">
          <input
            id="servings"
            type="number"
            min={0}
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Difficulty" htmlFor="difficulty">
          <select
            id="difficulty"
            value={difficulty ?? ""}
            onChange={(e) => setDifficulty(e.target.value)}
            className={inputCls}
          >
            <option value="">—</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
        </Field>
      </div>

      <Field label="Description" htmlFor="description">
        <textarea
          id="description"
          value={description ?? ""}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className={inputCls}
        />
      </Field>

      <Field label="Ingredients (one per line)" htmlFor="ingredients">
        <textarea
          id="ingredients"
          value={ingredientsText ?? ""}
          onChange={(e) => setIngredientsText(e.target.value)}
          rows={6}
          className={`${inputCls} font-mono text-sm`}
        />
      </Field>

      <Field label="Steps (one per line)" htmlFor="steps">
        <textarea
          id="steps"
          value={stepsText ?? ""}
          onChange={(e) => setStepsText(e.target.value)}
          rows={8}
          className={`${inputCls} font-mono text-sm`}
        />
      </Field>

      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest-er text-ink-2">
          Image
        </p>
        <ImageUploader value={imageUrl} onChange={setImageUrl} />
      </div>

      <label className="flex items-center gap-3 text-sm text-ink">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="h-4 w-4 rounded border-ink/30 accent-terracotta"
        />
        Featured on homepage
      </label>

      {error && <p className="text-sm text-terracotta">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:bg-terracotta disabled:opacity-50"
        >
          {submitting ? "Saving…" : initial ? "Save changes" : "Create recipe"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/recipes")}
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
