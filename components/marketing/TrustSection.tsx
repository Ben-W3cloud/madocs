"use client";

import { Check, X } from "lucide-react";
import ShapeGrid from "@/animation/ShapeGrid";
import VisibleBackground from "@/components/ui/VisibleBackground";
import SectionLabel from "@/components/ui/SectionLabel";

const ROWS: { knows: string; doesnt: string }[] = [
  {
    knows: "A wallet passed verification",
    doesnt: "Who the wallet belongs to",
  },
  {
    knows: "Verification happened on a date",
    doesnt: "The user's name",
  },
  {
    knows: "The user is 18 or older",
    doesnt: "The user's actual age",
  },
  {
    knows: "The user is Nigerian",
    doesnt: "The user's NIN or BVN",
  },
  {
    knows: "The nullifier (one-way hash)",
    doesnt: "Anything reversible",
  },
];

export default function TrustSection() {
  return (
    <section className="relative isolate overflow-hidden px-5 py-24 lg:px-8 lg:py-32">
      <VisibleBackground className="pointer-events-none absolute inset-0 -z-10 opacity-10">
        <ShapeGrid
          speed={0.35}
          squareSize={50}
          direction="left"
          shape="square"
          hoverTrailAmount={4}
        />
      </VisibleBackground>

      <div className="relative mx-auto max-w-[900px]">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel>Trust &amp; Privacy</SectionLabel>
          <h2 className="mt-4 text-[32px] font-bold leading-[1.1] tracking-tight text-text-primary sm:text-[44px]">
            What we know.{" "}
            <span className="text-text-secondary">What we don&apos;t.</span>
          </h2>
        </div>

        <div className="mt-14 overflow-hidden rounded-xl border border-border/50 bg-bg-card">
          <div className="grid grid-cols-2 border-b border-border/50">
            <div className="border-r border-border/50 bg-green/[0.04] px-5 py-4 text-[13px] font-semibold uppercase tracking-widest text-green">
              What AfricaZK Knows
            </div>
            <div className="bg-error/[0.04] px-5 py-4 text-[13px] font-semibold uppercase tracking-widest text-error">
              What AfricaZK Never Knows
            </div>
          </div>
          <ul>
            {ROWS.map((r, i) => (
              <li
                key={i}
                className={`grid grid-cols-2 ${
                  i < ROWS.length - 1 ? "border-b border-border/50" : ""
                }`}
              >
                <div className="flex items-center gap-3 border-r border-border/50 bg-green/[0.025] px-5 py-4 text-[14.5px] text-text-primary">
                  <Check className="h-4 w-4 shrink-0 text-green" />
                  <span>{r.knows}</span>
                </div>
                <div className="flex items-center gap-3 bg-error/[0.025] px-5 py-4 text-[14.5px] text-text-secondary">
                  <X className="h-4 w-4 shrink-0 text-error" />
                  <span>{r.doesnt}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 rounded-xl border border-green/30 bg-green/[0.04] p-7 text-center">
          <p className="text-[15.5px] leading-[1.7] text-text-secondary">
            AfricaZK runs no database. The backend processes one request and
            immediately discards the input. No logs. No analytics on personal
            data.{" "}
            <span className="text-text-primary">
              No way to connect a wallet address to a real identity — by
              design, not policy.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
