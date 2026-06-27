"use client";

import { motion } from "framer-motion";
import { ChevronDown, FileLock2, Link2, Shield } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import VisibleBackground from "@/components/ui/VisibleBackground";
import HeroVisualCycler from "./HeroVisualCycler";
import Lightfall from "@/animation/Lightfall";

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[100vh] items-center overflow-hidden pt-28 pb-24">
      <VisibleBackground className="absolute inset-0 -z-10 overflow-hidden">
        <Lightfall
          dpr={1.25}
          colors={["#00C896", "#9945FF", "#0EA5E9"]}
          backgroundColor="#05080F"
          speed={0.25}
          streakCount={3}
          streakWidth={1.2}
          streakLength={1.0}
          glow={1.0}
          density={0.5}
          twinkle={0.4}
          zoom={2.0}
          backgroundGlow={0.2}
          opacity={0.65}
          mouseInteraction
        />
      </VisibleBackground>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg-primary" />

      <div className="relative mx-auto w-full max-w-6xl px-5 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge dot>Built and Shipped on Solana Network</Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
            className="mt-8 font-[var(--font-display)] text-[44px] font-bold leading-[1.04] tracking-[-0.025em] text-text-primary sm:text-[58px] lg:text-[72px]"
          >
            <span className="block">
              Africa&apos;s{" "}
              <span className="azk-underline relative">Identity</span> Layer
            </span>
            <span className="block">
              for Solana<span className="text-green">.</span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-7 max-w-[560px] text-[18px] leading-[1.55] text-text-secondary sm:text-[20px]"
          >
            Verify once. Access everything. Zero personal data stored —
            anywhere. Africa&apos;s first ZK identity protocol, built for
            Nigerian dApps on Solana.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Button variant="primary" size="lg" href="#">
              Try the Demo →
            </Button>
            <Button variant="outline" size="lg" href="/docs/introduction">
              Read the Docs
            </Button>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-[12.5px] text-text-muted"
          >
            <li className="flex items-center gap-2">
              <FileLock2 className="h-4 w-4 text-green" />
              NIN never leaves your device
            </li>
            <li className="hidden text-text-muted/40 sm:inline">·</li>
            <li className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-purple" />
              Proof verified on Solana
            </li>
            <li className="hidden text-text-muted/40 sm:inline">·</li>
            <li className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green" />
              0 bytes of personal data stored
            </li>
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-14 w-full"
          >
            <HeroVisualCycler />
          </motion.div>
        </div>
      </div>

      <a
        href="#problem"
        aria-label="Scroll down"
        className="absolute inset-x-0 bottom-6 mx-auto flex w-fit items-center justify-center text-text-muted"
      >
        <ChevronDown
          className="h-6 w-6"
          style={{ animation: "var(--animate-chevron-bounce)" }}
        />
      </a>
    </section>
  );
}
