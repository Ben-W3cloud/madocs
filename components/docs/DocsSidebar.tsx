"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DOCS_NAV } from "./sidebar-nav";

export default function DocsSidebar({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname() ?? "/docs/introduction";

  const initiallyOpen = () => {
    const open: Record<string, boolean> = {};
    for (const section of DOCS_NAV) {
      open[section.title] = section.items.some((i) => i.href === pathname);
      // default first two sections open if no match
    }
    if (!Object.values(open).some(Boolean)) {
      open[DOCS_NAV[0].title] = true;
    }
    return open;
  };

  const [openMap, setOpenMap] = useState<Record<string, boolean>>(
    initiallyOpen
  );

  useEffect(() => {
    setOpenMap((m) => {
      const next = { ...m };
      for (const s of DOCS_NAV) {
        if (s.items.some((i) => i.href === pathname)) next[s.title] = true;
      }
      return next;
    });
  }, [pathname]);

  return (
    <nav className="flex flex-col gap-6 px-5 py-8" aria-label="Docs sidebar">
      {DOCS_NAV.map((section) => {
        const isOpen = openMap[section.title] ?? false;
        return (
          <div key={section.title}>
            <button
              type="button"
              onClick={() =>
                setOpenMap((m) => ({ ...m, [section.title]: !m[section.title] }))
              }
              className="group flex w-full items-center justify-between text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted transition-colors duration-150 hover:text-text-secondary"
            >
              <span>{section.title}</span>
              <ChevronRight
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  isOpen ? "rotate-90" : ""
                }`}
              />
            </button>
            {isOpen && (
              <ul className="mt-3 flex flex-col gap-0.5 border-l border-border pl-3">
                {section.items.map((it) => {
                  const active = pathname === it.href;
                  return (
                    <li key={it.href} className="relative">
                      {active && (
                        <span
                          aria-hidden
                          className="absolute -left-[13px] top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-green"
                          style={{
                            boxShadow:
                              "0 0 10px color-mix(in oklab, var(--green) 55%, transparent)",
                          }}
                        />
                      )}
                      <Link
                        href={it.href}
                        onClick={onNavigate}
                        className={`block rounded-md px-2 py-1.5 text-[13.5px] leading-tight transition-colors duration-150 ${
                          active
                            ? "font-medium text-green"
                            : "text-text-secondary hover:text-text-primary"
                        }`}
                      >
                        {it.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}
