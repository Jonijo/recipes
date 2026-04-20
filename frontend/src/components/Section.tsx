import { ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Section({ eyebrow, title, subtitle, action, children, className = "" }: Props) {
  return (
    <section className={`mt-20 ${className}`}>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h2 className="mt-2 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            {title}
          </h2>
          {subtitle && <p className="mt-3 text-base text-ink-2">{subtitle}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      <div className="mt-10">{children}</div>
    </section>
  );
}
