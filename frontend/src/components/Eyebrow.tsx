export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`text-[11px] font-semibold uppercase tracking-widest-er text-ink-2 ${className}`}
    >
      {children}
    </span>
  );
}
