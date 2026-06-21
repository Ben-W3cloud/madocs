"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import GithubIcon from "@/components/shared/icons/GithubIcon";
import Logo from "@/components/shared/Logo";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/ui/ThemeToggle";
import DocsSidebar from "./DocsSidebar";

const NAV = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Protocol", href: "/#protocol" },
  { label: "Docs", href: "/docs/introduction" },
];

export default function DocsHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg-primary/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-5 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-md border border-border bg-bg-card/60 p-1.5 text-text-primary lg:hidden"
            aria-label="Open docs navigation"
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          <Logo size="header" />
          <span
            aria-hidden
            className="hidden h-5 w-px bg-border lg:inline-block"
          />
          <span className="hidden font-mono text-[12px] uppercase tracking-widest text-text-muted lg:inline">
            Docs
          </span>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="rounded-md px-3 py-1.5 text-[13px] text-text-secondary transition-colors duration-150 hover:bg-bg-card hover:text-text-primary"
            >
              {it.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" href="#" aria-label="GitHub">
            <GithubIcon className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </Button>
          <Button variant="primary" size="sm" href="#">
            Try the Demo
          </Button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 top-14 z-40 overflow-y-auto bg-bg-primary/95 backdrop-blur-xl lg:hidden">
          <DocsSidebar onNavigate={() => setOpen(false)} />
        </div>
      )}
    </header>
  );
}
