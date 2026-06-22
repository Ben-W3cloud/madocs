"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import Orb from "@/animation/Orb";
import CodeBlock from "@/components/ui/CodeBlock";
import VisibleBackground from "@/components/ui/VisibleBackground";
import SectionLabel from "@/components/ui/SectionLabel";

const FEATURES = [
  {
    head: "npm install @africazk/identity",
    body: "One package. Everything included.",
  },
  {
    head: "Five clean functions",
    body: "verifyIdentity, generateProof, submitProof, checkAttestation, wipeCredential. That is the entire surface area.",
  },
  {
    head: "Wallet adapter compatible",
    body: "Works with Phantom, Backpack, and any @solana/wallet-adapter compatible wallet.",
  },
  {
    head: "Devnet and mainnet support",
    body: "Pass network: 'devnet' or 'mainnet-beta'. Switch with one parameter.",
  },
  {
    head: "TypeScript first",
    body: "Full type definitions included. Autocomplete for everything.",
  },
  {
    head: "Zero data responsibility",
    body: "You never touch NIN or BVN. You never store personal data. You have zero compliance liability.",
  },
];

const INSTALL_TAB = {
  label: "install",
  lang: "bash",
  code: `npm install @africazk/identity`,
};

const VERIFY_TAB = {
  label: "verify",
  lang: "ts",
  code: `import {
  verifyIdentity,
  generateProof,
  submitProof,
} from '@africazk/identity'

// Triggered when user clicks "Verify"
async function handleVerify(nin, dob, wallet) {

  // Step 1: Confirm with Dojah via AfricaZK backend
  const credential = await verifyIdentity({
    idType: 'NIN',
    idNumber: nin,
    dob: dob,
  })

  // Step 2: Generate ZK proof in browser
  // credential is wiped from memory after this
  const proof = await generateProof(credential)

  // Step 3: Submit to Solana
  const result = await submitProof(proof, wallet)

  console.log('Verified:', result.txSignature)
}`,
};

const CHECK_TAB = {
  label: "check",
  lang: "ts",
  code: `import { checkAttestation } from '@africazk/identity'

// Call on every page load or route change
const status = await checkAttestation(
  wallet.publicKey.toString(),
  'mainnet-beta'
)

if (status.verified) {
  // User is a verified Nigerian adult
  // You never saw their NIN. Ever.
  router.push('/dashboard')
}`,
};

const STATS = [
  { value: "< 0.001 SOL", label: "Cost per verification" },
  { value: "< 30 seconds", label: "Time to verify" },
  { value: "0 bytes", label: "Personal data stored" },
];

export default function DeveloperSection() {
  return (
    <section
      id="developers"
      className="relative isolate overflow-hidden px-5 py-24 lg:px-8 lg:py-32"
    >
      <VisibleBackground className="pointer-events-none absolute inset-0 -z-10 opacity-45">
        <div className="absolute right-[+15%] top-1/2 h-[620px] w-[620px] -translate-y-1/2">
          <Orb hue={95} hoverIntensity={0.15} rotateOnHover={true} forceHoverState backgroundColor="#05080F" dpr={1.25} />
        </div>
      </VisibleBackground>

      <div className="relative mx-auto max-w-[1100px]">
        <div className="mx-auto max-w-2xl text-center">
          <SectionLabel>For Developers</SectionLabel>
          <h2 className="mt-4 text-[32px] font-bold leading-[1.1] tracking-tight text-text-primary sm:text-[44px]">
            One SDK. Five functions.{" "}
            <span className="text-green">Your users are verified.</span>
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.15fr]">
          <ul className="space-y-5">
            {FEATURES.map((f) => (
              <li key={f.head} className="flex gap-3">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-green/15 text-green">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <div>
                  <p className="text-[15.5px] font-semibold text-text-primary">
                    {f.head}
                  </p>
                  <p className="mt-1 text-[14px] leading-[1.6] text-text-secondary">
                    {f.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div>
            <CodeBlock tabs={[INSTALL_TAB, VERIFY_TAB, CHECK_TAB]} />

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-md border border-border bg-bg-card p-4 text-center"
                >
                  <p className="font-mono text-[16px] font-semibold text-green">
                    {s.value}
                  </p>
                  <p className="mt-1 text-[12px] text-text-muted">{s.label}</p>
                </div>
              ))}
            </div>

            <Link
              href="/docs/introduction"
              className="mt-6 inline-flex items-center gap-2 text-[14px] font-medium text-green hover:underline"
            >
              Read the full docs →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
