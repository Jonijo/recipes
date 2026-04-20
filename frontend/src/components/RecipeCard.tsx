import Link from "next/link";
import { RecipeSummary, imageUrl } from "@/lib/api";
import { Badge } from "./Badge";
import { PantryIcon } from "./PantryIcon";

type Size = "sm" | "md" | "lg";

const aspects: Record<Size, string> = {
  sm: "aspect-[4/3]",
  md: "aspect-[4/5]",
  lg: "aspect-[3/4]",
};

const titleSizes: Record<Size, string> = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl sm:text-4xl",
};

export function RecipeCard({
  recipe,
  size = "md",
}: {
  recipe: RecipeSummary;
  size?: Size;
}) {
  const img = imageUrl(recipe.imageUrl);
  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className="group flex flex-col gap-4 transition duration-300 hover:-translate-y-0.5"
    >
      <div
        className={`relative ${aspects[size]} w-full overflow-hidden rounded-3xl bg-cream`}
      >
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={recipe.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink-2/50">
            <PantryIcon className="h-16 w-16" />
          </div>
        )}
        {recipe.accessType === "PREMIUM" && (
          <div className="absolute left-4 top-4">
            <Badge variant="premium">Premium</Badge>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-widest-er text-terracotta">
          {recipe.category.name}
        </span>
        <h3
          className={`font-display ${titleSizes[size]} font-semibold leading-[1.1] tracking-tight text-ink`}
        >
          {recipe.title}
        </h3>
        {recipe.shortDescription && (
          <p className="line-clamp-2 text-sm leading-relaxed text-ink-2">
            {recipe.shortDescription}
          </p>
        )}
      </div>
    </Link>
  );
}
