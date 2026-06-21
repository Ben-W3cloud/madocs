"use client";

import { useEffect, useState } from "react";

type Heading = { id: string; text: string; level: 2 | 3 };

export default function OnPageNav() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const article = document.querySelector("article[data-doc-content]");
    if (!article) return;

    const nodes = Array.from(
      article.querySelectorAll<HTMLHeadingElement>("h2[id], h3[id]")
    );
    setHeadings(
      nodes.map((n) => ({
        id: n.id,
        text: n.textContent ?? "",
        level: n.tagName === "H2" ? 2 : 3,
      }))
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              (a.target as HTMLElement).offsetTop -
              (b.target as HTMLElement).offsetTop
          );
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -65% 0px", threshold: [0, 1] }
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
          On this page
        </p>
        <ul className="space-y-1.5 border-l border-border">
          {headings.map((h) => (
            <li key={h.id} className="relative">
              {activeId === h.id && (
                <span
                  aria-hidden
                  className="absolute -left-[1px] top-1.5 h-4 w-[2px] rounded-full bg-green"
                />
              )}
              <a
                href={`#${h.id}`}
                className={`block py-1 pl-3 text-[12.5px] leading-tight transition-colors duration-150 ${
                  h.level === 3 ? "pl-6" : ""
                } ${
                  activeId === h.id
                    ? "text-green"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
