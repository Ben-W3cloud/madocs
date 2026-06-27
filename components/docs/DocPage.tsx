import Link from "next/link";
import type { ReactNode } from "react";
import { findPrevNext } from "./sidebar-nav";

export default function DocPage({
  eyebrow,
  title,
  intro,
  href,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  href: string;
  children: ReactNode;
}) {
  const { prev, next } = findPrevNext(href);
  return (
    <article data-doc-content className="azk-prose">
      {eyebrow && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-green">
          {eyebrow}
        </p>
      )}
      <h1 className="mt-2 font-[var(--font-display)] text-[40px] font-bold leading-[1.1] tracking-[-0.02em] text-text-primary">
        {title}
      </h1>
      {intro && (
        <p className="mt-5 text-[17px] leading-[1.7] text-text-secondary">
          {intro}
        </p>
      )}
      <div className="mt-8">{children}</div>

      <hr className="my-12 border-border" />
      <nav className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {prev ? (
          <Link
            href={prev.href}
            className="group rounded-lg border border-border/50 bg-bg-card p-4 transition-colors duration-150 hover:border-border-bright hover:bg-bg-card-hover"
          >
            <p className="text-[11px] uppercase tracking-widest text-text-muted">
              ← Previous
            </p>
            <p className="mt-1 text-[15px] font-medium text-text-primary group-hover:text-green">
              {prev.label}
            </p>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={next.href}
            className="group rounded-lg border border-border/50 bg-bg-card p-4 text-right transition-colors duration-150 hover:border-border-bright hover:bg-bg-card-hover sm:col-start-2"
          >
            <p className="text-[11px] uppercase tracking-widest text-text-muted">
              Next →
            </p>
            <p className="mt-1 text-[15px] font-medium text-text-primary group-hover:text-green">
              {next.label}
            </p>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
