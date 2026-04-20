import { ComponentType, SVGProps } from "react";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

export function MetaChip({
  icon: Icon,
  label,
  value,
}: {
  icon: IconType;
  label: string;
  value: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-cream/50 px-3.5 py-1.5">
      <Icon className="h-4 w-4 text-terracotta" aria-hidden />
      <span className="text-[10px] font-semibold uppercase tracking-widest-er text-ink-2">
        {label}
      </span>
      <span className="font-display text-sm font-medium text-ink">{value}</span>
    </div>
  );
}
