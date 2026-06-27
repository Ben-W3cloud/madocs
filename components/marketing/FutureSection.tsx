"use client";

import { motion } from "framer-motion";
import { Globe2, Layers, Link2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import ShapeGrid from "@/animation/ShapeGrid";
import SectionLabel from "@/components/ui/SectionLabel";
import VisibleBackground from "@/components/ui/VisibleBackground";

const VISIONS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Layers,
    title: "Composable Identity",
    body: "Every dApp that integrates AfricaZK contributes to a shared identity layer. As the ecosystem grows, a single verified wallet unlocks an entire network of applications.",
  },
  {
    icon: Globe2,
    title: "Expanding ID Support",
    body: "AfricaZK is designed to extend beyond Nigeria. Ghana Card, Huduma Namba (Kenya), South African ID — the same ZK architecture, localised for each country's ID infrastructure.",
  },
  {
    icon: Link2,
    title: "Light Protocol Integration",
    body: "The AfricaZK Anchor program is architectured to plug in Light Protocol's on-chain Groth16 verification in a future upgrade — bringing full trustless proof verification to the protocol without changing the developer interface.",
  },
];

export default function FutureSection() {
  return (
    <section className="relative isolate overflow-hidden  px-5 py-24 lg:px-8 lg:py-32">
      <VisibleBackground className="absolute inset-0 -z-10 opacity-10">
                <ShapeGrid
                  speed={0.35}
                  squareSize={48}
                  direction="diagonal"
                  shape="square"
                  hoverTrailAmount={5}
                />
      </VisibleBackground>

      <div className="relative mx-auto max-w-[1100px]">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel color="purple">Built for what comes next</SectionLabel>
          <h2 className="mt-4 text-[32px] font-bold leading-[1.1] tracking-tight text-text-primary sm:text-[44px]">
            The foundation for African DeFi.
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {VISIONS.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative overflow-hidden rounded-xl border border-border/50 bg-bg-card p-7"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -left-12 -top-12 h-32 w-32 rounded-full bg-purple/15 blur-2xl"
                />
                <div className="relative mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-purple/30 bg-purple/10 text-purple">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-[18px] font-semibold text-text-primary">
                  {v.title}
                </h3>
                <p className="mt-3 text-[14.5px] leading-[1.7] text-text-secondary">
                  {v.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
