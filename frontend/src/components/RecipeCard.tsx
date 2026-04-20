import Link from "next/link";
import { RecipeSummary, imageUrl } from "@/lib/api";
import { PremiumBadge } from "./PremiumBadge";

export function RecipeCard({ recipe }: { recipe: RecipeSummary }) {
  const img = imageUrl(recipe.imageUrl);
  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-stone-200 bg-white transition hover:shadow-md"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-stone-100">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={recipe.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-stone-400">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wide text-stone-500">
            {recipe.category.name}
          </span>
          {recipe.accessType === "PREMIUM" && <PremiumBadge />}
        </div>
        <h3 className="text-lg font-semibold leading-tight">{recipe.title}</h3>
        {recipe.shortDescription && (
          <p className="line-clamp-2 text-sm text-stone-600">{recipe.shortDescription}</p>
        )}
      </div>
    </Link>
  );
}
