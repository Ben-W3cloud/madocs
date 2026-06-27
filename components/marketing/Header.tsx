"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import GithubIcon from "@/components/shared/icons/GithubIcon";
import Logo from "@/components/shared/Logo";
import Button from "@/components/ui/Button";

const NAV = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Protocol", href: "/#protocol" },
  { label: "Developers", href: "/#developers" },
  { label: "Docs", href: "/docs/introduction" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/50 bg-bg-card/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Logo size="header" />

        <nav className="hidden items-center gap-2 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-4 py-2 text-[13.5px] text-text-secondary transition-colors duration-150 hover:bg-bg-card hover:text-text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button
            variant="ghost"
            size="sm"
            href="#"
            aria-label="GitHub repository"
          >
            <GithubIcon className="h-4 w-4" />
            <span>GitHub</span>
          </Button>
          <Button variant="outline" size="sm" href="/docs/introduction">
            Read the Docs
          </Button>
          <Button variant="primary" size="sm" href="#">
            Try the Demo
          </Button>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-md border border-border bg-bg-card/60 p-2 text-text-primary md:hidden"
          aria-label="Open menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-16 z-40 md:hidden"
          >
            <div className="h-full w-full bg-bg-primary/95 backdrop-blur-xl">
              <motion.div
                initial={{ y: -12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -12, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
                className="flex flex-col gap-1 px-5 pt-6"
              >
                {NAV.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-3 text-base text-text-primary hover:bg-bg-card"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="mt-4 flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="md"
                    href="/docs/introduction"
                    onClick={() => setOpen(false)}
                  >
                    Read the Docs
                  </Button>
                  <Button variant="primary" size="md" href="#">
                    Try the Demo
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
