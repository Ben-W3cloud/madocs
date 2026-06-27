"use client";

import { motion, useInView } from "framer-motion";
import { FunctionSquare, MailCheck, ShieldCheck } from "lucide-react";
import { useRef } from "react";
import CodeBlock from "@/components/ui/CodeBlock";
import SectionLabel from "@/components/ui/SectionLabel";
import VisibleBackground from "@/components/ui/VisibleBackground";
import ShapeGrid from "@/animation/ShapeGrid";
import SpotlightCard from "@/animation/SpotlightCard";

const CRED_CODE = `credential = {
  idHash: Poseidon(NIN),
  age: 24,
  idType: 1,            // 1 = NIN, 2 = BVN
  signature: AfricaZK.sign(credentialHash),
}`;

const PROOF_CODE = `proof = { pi_a: [...], pi_b: [...], pi_c: [...] }
publicSignals = ['1', '0x8f3a…c291']
// valid = 1, nullifier = 0x8f3a…c291
// Nothing else. Ever.`;

const CHECKS = [
  "EdDSA signature valid",
  "age >= 18",
  "idType is 1 or 2",
];

export default function ZKExplainer() {
  return (
    <section className="relative isolate overflow-hidden bg-bg-subtle px-5 py-24 lg:px-8 lg:py-32">
      <VisibleBackground className="absolute inset-0 -z-10">
        <ShapeGrid
          speed={0.3}
          squareSize={50}
          direction="up"
          shape="square"
          hoverTrailAmount={5}
        />
      </VisibleBackground>
      <div className="mx-auto max-w-[900px]">
        <div className="mx-auto max-w-xl text-center">
          <SectionLabel>Zero-Knowledge Explained</SectionLabel>
          <h2 className="mt-4 text-[32px] font-bold leading-[1.1] tracking-tight text-text-primary sm:text-[44px]">
            Prove everything. <span className="text-text-secondary">Reveal nothing.</span>
          </h2>
          <p className="mt-5 text-[16px] leading-[1.65] text-text-secondary">
            Zero-Knowledge proofs let you prove a statement is true without
            revealing the underlying information. AfricaZK uses Groth16
            proofs with Poseidon hashing — the same cryptography securing
            billions in DeFi.
          </p>
        </div>

        <div className="relative mt-16 space-y-5">
          {/* connecting vertical line */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-[27px] top-12 bottom-12 hidden w-px bg-gradient-to-b from-green/0 via-green/30 to-purple/0 md:block"
          />
          <ExplainerCard
            icon={<MailCheck className="h-5 w-5" />}
            title="Your credential stays private"
            body={
              <>
                When your NIN is confirmed by the provider, AfricaZK creates a
                signed credential in your browser&apos;s memory. It contains
                your verified facts — nationality, age, ID type. It is signed
                with AfricaZK&apos;s EdDSA private key. It never leaves your
                device.
              </>
            }
            extra={<CodeBlock code={CRED_CODE} lang="ts" filename="credential" />}
          />
          <ExplainerCard
            icon={<FunctionSquare className="h-5 w-5" />}
            title="The circuit asks one question"
            body={
              <>
                A Groth16 ZK circuit runs inside your browser. It takes your
                private credential and checks three things: Was this signed
                by AfricaZK? Is the person eligible? Is the ID type valid?
                If all three pass, it outputs a proof and a nullifier. Your
                credential is then wiped from memory.
              </>
            }
            extra={<ChecksList />}
          />
          <ExplainerCard
            icon={<ShieldCheck className="h-5 w-5" />}
            title="The proof reveals nothing"
            body={
              <>
                The output is a set of mathematical values — pi_a, pi_b,
                pi_c — that a verifier can check against a public
                verification key. They confirm the circuit ran correctly.
                They contain zero personal information. The nullifier is a
                one-way hash — it identifies you uniquely without revealing
                who you are.
              </>
            }
            extra={<CodeBlock code={PROOF_CODE} lang="ts" filename="proof" />}
          />
        </div>
      </div>
    </section>
  );
}

function ExplainerCard({
  icon,
  title,
  body,
  extra,
}: {
  icon: React.ReactNode;
  title: string;
  body: React.ReactNode;
  extra: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45 }}
    >
      <SpotlightCard
        spotlightColor="rgba(0, 200, 150, 0.12)"
        className="relative grid grid-cols-1 gap-6 rounded-xl border border-border bg-bg-card p-6 md:grid-cols-[64px_1fr] md:p-8 hover:shadow-card-hover transition-all duration-200"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-green/30 bg-green/10 text-green md:h-14 md:w-14">
          {icon}
        </div>
        <div>
          <h3 className="text-[20px] font-semibold text-text-primary">{title}</h3>
          <p className="mt-2 text-[15px] leading-[1.7] text-text-secondary">
            {body}
          </p>
          <div className="mt-5">{extra}</div>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

function ChecksList() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div
      ref={ref}
      className="space-y-2 rounded-md border border-border bg-bg-code p-5 font-mono text-[13px]"
    >
      {CHECKS.map((c, i) => (
        <motion.div
          key={c}
          initial={{ opacity: 0, x: -8 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2 + i * 0.4, duration: 0.3 }}
          className="flex items-center gap-3"
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={inView ? { scale: 1 } : {}}
            transition={{ delay: 0.4 + i * 0.4, type: "spring", stiffness: 240, damping: 16 }}
            className="flex h-5 w-5 items-center justify-center rounded-full bg-green text-bg-base"
          >
            ✓
          </motion.span>
          <span className="text-text-primary">{c}</span>
        </motion.div>
      ))}
    </div>
  );
}
