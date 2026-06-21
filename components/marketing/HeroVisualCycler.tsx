"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Wallet } from "lucide-react";
import { useEffect, useState } from "react";

const STATES = ["input", "proof", "verified"] as const;
type State = (typeof STATES)[number];

const STATE_INTERVAL = 3200;

export default function HeroVisualCycler() {
  const [idx, setIdx] = useState(0);
  const state: State = STATES[idx];

  useEffect(() => {
    const id = window.setInterval(() => {
      setIdx((v) => (v + 1) % STATES.length);
    }, STATE_INTERVAL);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-12 -z-10 blur-3xl"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 60%, color-mix(in oklab, var(--green) 22%, transparent), transparent 70%)",
        }}
      />

      <div className="relative h-[320px] overflow-hidden rounded-xl border border-border bg-bg-card/80 shadow-card backdrop-blur-sm">
        {/* Subtle terminal chrome dots */}
        <div className="flex items-center gap-1.5 border-b border-border bg-bg-base/60 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]/70" />
          <span className="ml-3 font-mono text-[11px] text-text-muted">
            africazk · live verification flow
          </span>
        </div>

        <div className="relative h-[calc(100%-40px)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={state}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
              className="absolute inset-0 flex flex-col items-center justify-center px-8"
            >
              {state === "input" && <InputState />}
              {state === "proof" && <ProofState />}
              {state === "verified" && <VerifiedState />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress dots */}
      <div className="mt-5 flex items-center justify-center gap-2">
        {STATES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`Show state ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === i ? "w-8 bg-green" : "w-2 bg-border-bright"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function InputState() {
  return (
    <div className="w-full max-w-sm space-y-4 font-mono text-[13px]">
      <FieldRow label="NIN" value="●●●●●●●●●●●" />
      <FieldRow label="DOB" value="●●/●●/●●●●" />
      <p className="pt-2 text-center text-[11px] text-text-muted">
        Entered by user · stays on device
      </p>
    </div>
  );
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-bg-base/40 px-4 py-3">
      <span className="text-text-muted">{label}</span>
      <span className="tracking-[0.2em] text-text-primary">{value}</span>
    </div>
  );
}

const PROOF_LINES = [
  "> Running ZK circuit...",
  "> Poseidon(idHash, age) → credentialHash",
  "> EdDSA signature verified ✓",
  "> Groth16 proof generated",
  "> publicSignals: [1, 0x8f3a…c291]",
];

function ProofState() {
  return (
    <div className="w-full max-w-md font-mono text-[12.5px] leading-[1.85]">
      <ol className="space-y-1">
        {PROOF_LINES.map((line, i) => (
          <motion.li
            key={line}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.32, duration: 0.25 }}
            className={i === PROOF_LINES.length - 1 ? "text-green" : "text-text-secondary"}
          >
            {line}
          </motion.li>
        ))}
      </ol>
      <p className="mt-4 text-center text-[11px] text-text-muted">
        Generated in browser · data wiped
      </p>
    </div>
  );
}

function VerifiedState() {
  return (
    <div className="w-full max-w-sm">
      <div
        className="rounded-lg border border-green/30 bg-bg-base/60 p-5"
        style={{
          boxShadow:
            "0 0 28px color-mix(in oklab, var(--green) 18%, transparent)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-purple/20 text-purple">
            <Wallet className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-mono text-[13px] text-text-primary">
              8xKp…3mNq
            </p>
            <p className="font-mono text-[11px] text-text-muted">
              Phantom Wallet · Devnet
            </p>
          </div>
          <CheckCircle2 className="h-5 w-5 text-green" />
        </div>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-green/40 bg-green/10 px-3 py-1 font-mono text-[11px] text-green">
          <span className="h-1.5 w-1.5 rounded-full bg-green" />
          AfricaZK-v1 · Verified
        </div>
        <p className="mt-3 font-mono text-[11px] text-text-muted">
          NullifierRecord · AttestationRecord
        </p>
      </div>
      <p className="mt-4 text-center text-[11px] text-text-muted">
        On-chain · permanent · private
      </p>
    </div>
  );
}
