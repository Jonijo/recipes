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

  const inputCls =
    "rounded-md border border-stone-300 bg-white px-3 py-2 focus:border-stone-500 focus:outline-none";

  return (
    <form onSubmit={onSubmit} className="mt-8 max-w-3xl space-y-6">
      <div className="flex flex-col gap-1 text-sm">
        <label htmlFor="title" className="font-medium">
          Title
        </label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={255}
          className={inputCls}
        />
      </div>

      <div className="flex flex-col gap-1 text-sm">
        <label htmlFor="shortDescription" className="font-medium">
          Short description
        </label>
        <input
          id="shortDescription"
          value={shortDescription ?? ""}
          onChange={(e) => setShortDescription(e.target.value)}
          maxLength={500}
          className={inputCls}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1 text-sm">
          <label htmlFor="category" className="font-medium">
            Category
          </label>
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
            <p className="text-xs text-red-600">{categoriesError}</p>
          )}
        </div>

        <div className="flex flex-col gap-1 text-sm">
          <label htmlFor="accessType" className="font-medium">
            Access
          </label>
          <select
            id="accessType"
            value={accessType}
            onChange={(e) => setAccessType(e.target.value as AccessType)}
            className={inputCls}
          >
            <option value="FREE">Free</option>
            <option value="PREMIUM">Premium</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="flex flex-col gap-1 text-sm">
          <label htmlFor="prepTime" className="font-medium">
            Prep (min)
          </label>
          <input
            id="prepTime"
            type="number"
            min={0}
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
            className={inputCls}
          />
        </div>
        <div className="flex flex-col gap-1 text-sm">
          <label htmlFor="cookTime" className="font-medium">
            Cook (min)
          </label>
          <input
            id="cookTime"
            type="number"
            min={0}
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
            className={inputCls}
          />
        </div>
        <div className="flex flex-col gap-1 text-sm">
          <label htmlFor="servings" className="font-medium">
            Servings
          </label>
          <input
            id="servings"
            type="number"
            min={0}
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            className={inputCls}
          />
        </div>
        <div className="flex flex-col gap-1 text-sm">
          <label htmlFor="difficulty" className="font-medium">
            Difficulty
          </label>
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
        </div>
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
          className={inputCls}
        />
      </div>

      <div className="flex flex-col gap-1 text-sm">
        <label htmlFor="ingredients" className="font-medium">
          Ingredients (one per line)
        </label>
        <textarea
          id="ingredients"
          value={ingredientsText ?? ""}
          onChange={(e) => setIngredientsText(e.target.value)}
          rows={6}
          className={`font-mono text-xs ${inputCls}`}
        />
      </div>

      <div className="flex flex-col gap-1 text-sm">
        <label htmlFor="steps" className="font-medium">
          Steps (one per line)
        </label>
        <textarea
          id="steps"
          value={stepsText ?? ""}
          onChange={(e) => setStepsText(e.target.value)}
          rows={8}
          className={`font-mono text-xs ${inputCls}`}
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Image</p>
        <ImageUploader value={imageUrl} onChange={setImageUrl} />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="h-4 w-4 rounded border-stone-300"
        />
        Featured on homepage
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50"
        >
          {submitting ? "Saving…" : initial ? "Save changes" : "Create recipe"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/recipes")}
          className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm hover:bg-stone-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
