import Link from "next/link";
import { Category, imageUrl } from "@/lib/api";

export function CategoryCard({ category }: { category: Category }) {
  const img = imageUrl(category.imageUrl);
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative flex aspect-video items-end overflow-hidden rounded-lg border border-stone-200 bg-stone-100"
    >
      {img && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={img}
          alt={category.name}
          className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105"
        />
      )}
      <div className="relative z-10 w-full bg-gradient-to-t from-black/70 to-transparent p-3">
        <h3 className="text-base font-semibold text-white">{category.name}</h3>
      </div>
    </Link>
  );
}
