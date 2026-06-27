"use client";

import { motion } from "framer-motion";
import ShapeGrid from "@/animation/ShapeGrid";
import SectionLabel from "@/components/ui/SectionLabel";
import VisibleBackground from "@/components/ui/VisibleBackground";

const PILLARS = [
  {
    tag: "Circom + SnarkJS",
    title: "Groth16 Zero-Knowledge Proofs",
    body: "The AfricaZK circuit is written in Circom — the industry standard for ZK circuit development. It uses the Groth16 proving scheme with Poseidon hashing, optimised for browser performance via WebAssembly. Proof generation runs entirely on the user's device.",
    footer: "Circuit: africazk.circom · 4 private inputs · 2 public outputs",
  },
  {
    tag: "EdDSA · circomlib",
    title: "Backend Credential Signing",
    body: "AfricaZK's backend signs every credential with an EdDSA private key using circomlib's EdDSAPoseidon implementation. The circuit verifies this signature on-chain. Only credentials signed by AfricaZK's trusted key can produce valid proofs — making it impossible to submit a fake credential.",
    footer: "Public key embedded in circuit · Private key never exposed",
  },
  {
    tag: "Anchor Framework",
    title: "On-Chain Verification & Attestation",
    body: "The AfricaZK Anchor program receives proofs, validates public signals, checks the NullifierRecord PDA to prevent duplicate registrations, and creates an AttestationRecord PDA that any dApp can read. Light Protocol ZK verification integrates in a future upgrade.",
    footer: "Two PDAs: NullifierRecord · AttestationRecord",
  },
  {
    tag: "Dojah API · NIMC · CBN",
    title: "Nigerian ID Infrastructure",
    body: "NIN verification runs through Dojah — a licensed Nigerian KYC provider with direct NIMC database access. BVN verification uses CBN-licensed infrastructure. The raw ID is hashed immediately after confirmation and the original is never stored anywhere in the AfricaZK system.",
    footer: "Supports: NIN · BVN · Extensible to more ID types",
  },
];

export default function ArchitectureSection() {
  return (
    <section
      id="protocol"
      className="relative isolate overflow-hidden px-5 py-24 lg:px-8 lg:py-32"
    >
      <VisibleBackground className="absolute inset-0 -z-10 opacity-10">
        <ShapeGrid
          speed={0.25}
          squareSize={56}
          direction="left"
          shape="triangle"
          hoverTrailAmount={4}
        />
      </VisibleBackground>

      <div className="relative mx-auto max-w-[1100px]">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel color="purple">Protocol Architecture</SectionLabel>
          <h2 className="mt-4 text-[32px] font-bold leading-[1.1] tracking-tight text-text-primary sm:text-[44px]">
            Built on proven cryptography.
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group relative overflow-hidden rounded-xl border border-border/50 bg-bg-card p-7 transition-colors duration-200 hover:border-purple/40"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-purple/10 blur-3xl transition-opacity duration-300 group-hover:opacity-100 opacity-60"
              />
              <span className="inline-block rounded-full border border-purple/30 bg-purple/10 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-widest text-purple">
                {p.tag}
              </span>
              <h3 className="mt-4 text-[20px] font-semibold leading-tight text-text-primary">
                {p.title}
              </h3>
              <p className="mt-3 text-[14.5px] leading-[1.7] text-text-secondary">
                {p.body}
              </p>
              <p className="mt-5 border-t border-border/50 pt-4 font-mono text-[11.5px] text-text-muted">
                {p.footer}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
