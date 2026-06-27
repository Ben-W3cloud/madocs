"use client";

import { motion } from "framer-motion";
import { DatabaseBackup, Repeat, Unlink } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import VisibleBackground from "@/components/ui/VisibleBackground";
import ShapeGrid from "@/animation/ShapeGrid";
import SpotlightCard from "@/animation/SpotlightCard";

const PROBLEMS = [
  {
    icon: DatabaseBackup,
    title: "Storing Sensitive Data",
    body: "Every app that collects NIN or BVN becomes a target. One breach exposes thousands of Nigerians. The liability is enormous. The trust damage is permanent.",
  },
  {
    icon: Repeat,
    title: "Verify Again. And Again.",
    body: "Users submit the same documents to every new dApp. Every platform builds its own KYC pipeline. The ecosystem fragments. Users burn out. Adoption suffers.",
  },
  {
    icon: Unlink,
    title: "No Shared Infrastructure",
    body: "There is no shared identity layer for African dApps on Solana. Every team solves the same problem independently, expensively, and badly.",
  },
];

export default function ProblemSection() {
  return (
    <section id="problem" className="relative isolate overflow-hidden bg-bg-subtle px-5 py-24 lg:px-8 lg:py-32">
      <VisibleBackground className="absolute inset-0 -z-10">
        <ShapeGrid
          speed={0.4}
          squareSize={40}
          direction="diagonal"
          shape="square"
          hoverTrailAmount={6}
        />
      </VisibleBackground>
      <div className="mx-auto max-w-[1100px]">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel>The Problem</SectionLabel>
          <h2 className="mt-4 text-[32px] font-bold leading-[1.1] tracking-tight text-text-primary sm:text-[44px]">
            Every Nigerian dApp reinvents KYC.{" "}
            <span className="text-text-secondary">And gets it wrong.</span>
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {PROBLEMS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <SpotlightCard
                  spotlightColor="rgba(239, 68, 68, 0.12)"
                  className="relative overflow-hidden rounded-lg border border-border bg-bg-card p-6 transition-all duration-200 hover:border-error/40 hover:shadow-card-hover"
                >
                  <span className="pointer-events-none absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-error/0 via-error/60 to-error/0" />
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md border border-error/30 bg-error-tint text-error">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-[17px] font-semibold text-text-primary">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[14.5px] leading-[1.65] text-text-secondary">
                    {p.body}
                  </p>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>

        <p className="mx-auto mt-14 max-w-xl text-center text-[18px] text-text-secondary">
          Pridora solves all three.{" "}
          <span className="relative inline-block text-text-primary">
            permanently
            <span className="absolute inset-x-0 -bottom-1 h-[3px] rounded-full bg-green/80" />
          </span>
          .
        </p>
      </div>
    </section>
  );
}
