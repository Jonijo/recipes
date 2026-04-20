import { ReactNode } from "react";

export type BadgeVariant =
  | "premium"
  | "published"
  | "draft"
  | "category"
  | "neutral";

const variants: Record<BadgeVariant, string> = {
  premium:
    "bg-brass/15 text-brass ring-1 ring-inset ring-brass/40",
  published:
    "bg-sage/15 text-sage ring-1 ring-inset ring-sage/30",
  draft:
    "bg-cream text-ink-2 ring-1 ring-inset ring-ink/10",
  category:
    "bg-transparent text-terracotta ring-1 ring-inset ring-terracotta/50",
  neutral: "bg-cream text-ink-2",
};

export function Badge({
  variant = "neutral",
  children,
  className = "",
}: {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest-er ${variants[variant]} ${className}`}
    >
      {variant === "premium" && <Rosette className="h-3 w-3" />}
      {children}
    </span>
  );
}

function Rosette({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden className={className}>
      <path d="M8 1.5l1.4 2 2.4-.6.2 2.4 2.1 1.2-1.2 2.1.6 2.4-2.4.2-1.2 2.1L8 11.8 5.8 13.3l-1.2-2.1-2.4-.2.6-2.4L1.6 6.5l2.1-1.2.2-2.4 2.4.6L8 1.5z" />
      <circle cx="8" cy="7.5" r="2" fill="#FBF8F2" />
    </svg>
  );
}
