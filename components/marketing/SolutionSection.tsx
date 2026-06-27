"use client";

import { motion } from "framer-motion";
import {
  Cpu,
  Diamond,
  LayoutGrid,
  Server,
  User,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SectionLabel from "@/components/ui/SectionLabel";
import VisibleBackground from "@/components/ui/VisibleBackground";
import ShapeGrid from "@/animation/ShapeGrid";
import SpotlightCard from "@/animation/SpotlightCard";
type NodeColor = "white" | "green" | "purple";

type FlowNode = {
  icon: LucideIcon;
  label: string;
  sub: string;
  color: NodeColor;
};

type Edge = { label: string };

const NODES: FlowNode[] = [
  { icon: User, label: "User", sub: "Enters NIN or BVN", color: "white" },
  {
    icon: Server,
    label: "AfricaZK Backend",
    sub: "Verifies with our KYC provider · Signs credential · Stores nothing",
    color: "green",
  },
  {
    icon: Cpu,
    label: "ZK Circuit",
    sub: "Runs in browser · Generates proof · Wipes credential",
    color: "purple",
  },
  {
    icon: Diamond,
    label: "Anchor program",
    sub: "Verifies proof · Stores nullifier · Issues attestation",
    color: "purple",
  },
  {
    icon: Wallet,
    label: "User Wallet",
    sub: "Holds AttestationRecord · Portable · Permanent",
    color: "green",
  },
  {
    icon: LayoutGrid,
    label: "Any dApp",
    sub: "Reads attestation · User is in · Zero data seen",
    color: "white",
  },
];

const EDGES: Edge[] = [
  { label: "NIN + DOB (over HTTPS)" },
  { label: "SignedCredential (in memory only)" },
  { label: "ZK Proof (no personal data)" },
  { label: "AttestationRecord PDA" },
  { label: "verified: true" },
];

const COLOR_CLASS: Record<
  NodeColor,
  { ring: string; icon: string; glow: string }
> = {
  white: {
    ring: "border-border-bright",
    icon: "text-text-primary bg-bg-card",
    // Subtle ambient elevation — same on both themes
    glow: "0 6px 18px color-mix(in oklab, var(--text-primary) 6%, transparent)",
  },
  green: {
    ring: "border-green/40",
    icon: "text-green bg-green/10",
    glow: "0 0 24px color-mix(in oklab, var(--green) 22%, transparent)",
  },
  purple: {
    ring: "border-purple/40",
    icon: "text-purple bg-purple/10",
    glow: "0 0 24px color-mix(in oklab, var(--purple) 22%, transparent)",
  },
};

export default function SolutionSection() {
  return (
    <section
      id="how-it-works"
      className="relative isolate overflow-hidden bg-bg-primary px-5 py-24 lg:px-8 lg:py-32"
    >
      <VisibleBackground className="absolute inset-0 -z-10 opacity-10 pointer-events-none">
       <ShapeGrid
          speed={0.35}
          squareSize={48}
          direction="right"
          shape="square"
          hoverTrailAmount={4}
        /> 
      </VisibleBackground>
      <div className="mx-auto max-w-[1180px]">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel>The Solution</SectionLabel>
          <h2 className="mt-4 text-[32px] font-bold leading-[1.1] tracking-tight text-text-primary sm:text-[44px]">
            Verify once. The proof lives on Solana. Forever.
          </h2>
          <p className="mt-5 text-[17px] leading-[1.6] text-text-secondary">
            AfricaZK is not an app. It is infrastructure. A ZK identity
            protocol any Solana dApp plugs into. One SDK. Five functions.
            Zero data stored.
          </p>
        </div>

        {/* Flow diagram - Infinite seamless carousel */}
        <div className="mt-16 overflow-hidden relative">
          <div
            className="flex items-stretch gap-25 px-2"
            style={{
              animation: "marquee 20s linear infinite",
              animationPlayState: "running",
            }}
            onMouseEnter={(e) => e.currentTarget.style.animationPlayState = "paused"}
            onMouseLeave={(e) => e.currentTarget.style.animationPlayState = "running"}
          >
            {[...NODES, ...NODES].map((node, i) => {
              const Icon = node.icon;
              const c = COLOR_CLASS[node.color];
              return (
                <div key={`${node.label}-${i}`} className="flex-shrink-0 w-40">
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.45, delay: (i % NODES.length) * 0.08 }}
                    className="flex flex-1 items-stretch h-full"
                  >
                    <SpotlightCard
                      spotlightColor={node.color === "green" ? "rgba(0, 200, 150, 0.12)" : node.color === "purple" ? "rgba(153, 69, 255, 0.12)" : "rgba(255, 255, 255, 0.10)"}
                      className={`relative flex flex-1 flex-col items-center justify-start rounded-lg border border-border/50 bg-bg-card p-5 text-center transition-all duration-200 hover:shadow-card-hover ${c.ring}`}
                      style={{ boxShadow: c.glow }}
                    >
                      <div
                        className={`mb-3 flex h-12 w-12 items-center justify-center rounded-lg ${c.icon}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <p className="text-[14px] font-semibold text-text-primary">
                        {node.label}
                      </p>
                      <p className="mt-1 text-[12px] leading-[1.5] text-text-muted">
                        {node.sub}
                      </p>
                    </SpotlightCard>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
        <style jsx>{`
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}</style>

        {/* What never moves callout */}
        <div className="mx-auto mt-16 max-w-2xl rounded-xl  p-7 text-center backdrop-blur-sm transition-colors duration-200 hover:bg-bg-card/50 border border-border-bright/50">
          <p className="text-[15px] leading-[1.6] text-text-secondary">
            <span className="text-text-primary font-medium">
              What never leaves your device:
            </span>{" "}
            your NIN, your BVN, your name, your date of birth, your face.
          </p>
          <p className="mt-3 text-[15px] leading-[1.6] text-text-secondary">
            <span className="text-text-primary font-medium">
              What goes on-chain:
            </span>{" "}
            a mathematical proof.{" "}
            <span className="text-green">Nothing else.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

function FlowEdge({ label, delay }: { label: string; delay: number }) {
  return (
    <div className="relative mx-1 flex w-[120px] flex-col items-center justify-center">
      <svg
        viewBox="0 0 120 12"
        className="h-3 w-full"
        preserveAspectRatio="none"
        fill="none"
      >
        <motion.path
          d="M 0 6 L 120 6"
          stroke="url(#flow-edge-grad)"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, delay }}
        />
        <defs>
          <linearGradient id="flow-edge-grad" x1="0" x2="1">
            <stop offset="0%" style={{ stopColor: "var(--green)", stopOpacity: 0.75 }} />
            <stop offset="100%" style={{ stopColor: "var(--purple)", stopOpacity: 0.75 }} />
          </linearGradient>
        </defs>
      </svg>
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ delay: delay + 0.3, duration: 0.3 }}
        className="mt-2 font-mono text-[10px] text-text-muted"
      >
        {label}
      </motion.span>
    </div>
  );
}
