import Link from "next/link";
import { Category, imageUrl } from "@/lib/api";
import { PantryIcon } from "./PantryIcon";

export function CategoryCard({ category }: { category: Category }) {
  const img = imageUrl(category.imageUrl);
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative flex aspect-[3/4] items-end overflow-hidden rounded-3xl bg-cream"
    >
      {img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={img}
          alt={category.name}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-ink-2/40">
          <PantryIcon className="h-20 w-20" />
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
      <div className="relative z-10 flex w-full items-end justify-between gap-3 p-5">
        <h3 className="font-display text-2xl font-semibold leading-[1.05] tracking-tight text-paper">
          {category.name}
        </h3>
        <span className="text-paper/80 transition group-hover:translate-x-0.5" aria-hidden>
          →
        </span>
      </div>
    </Link>
  );
}
