import type { Metadata } from "next";
import Callout from "@/components/docs/Callout";
import DocPage from "@/components/docs/DocPage";
import CodeBlock from "@/components/ui/CodeBlock";

export const metadata: Metadata = {
  title: "Quick Start",
  description:
    "Install @africazk/identity, check user attestations, run the verification flow, and gate features — in under ten minutes.",
};

const STEP_1 = `npm install @africazk/identity @solana/wallet-adapter-react`;

const STEP_2 = `import { checkAttestation } from '@africazk/identity'
import { useWallet } from '@solana/wallet-adapter-react'

const { publicKey } = useWallet()

const status = await checkAttestation(
  publicKey!.toString(),
  'mainnet-beta'
)

if (status.verified) {
  // User already has a valid attestation on this wallet
}`;

const STEP_3 = `import {
  verifyIdentity,
  generateProof,
  submitProof,
} from '@africazk/identity'

async function runVerification(nin: string, dob: string, wallet) {
  // 1. Confirm with Dojah via AfricaZK backend
  const credential = await verifyIdentity({
    idType: 'NIN',
    idNumber: nin,
    dob,
  })

  // 2. Generate ZK proof in browser
  // The credential is wiped from memory after this call
  const proof = await generateProof(credential)

  // 3. Submit to Solana — user signs the transaction
  const result = await submitProof(proof, wallet, 'mainnet-beta')

  return result.txSignature
}`;

const STEP_4 = `'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { checkAttestation } from '@africazk/identity'

export function VerifiedGate({ children }: { children: ReactNode }) {
  const { publicKey } = useWallet()
  const [verified, setVerified] = useState<boolean | null>(null)

  useEffect(() => {
    if (!publicKey) {
      setVerified(false)
      return
    }
    checkAttestation(publicKey.toString(), 'mainnet-beta')
      .then((s) => setVerified(s.verified))
      .catch(() => setVerified(false))
  }, [publicKey])

  if (verified === null) return <p>Checking…</p>
  if (!verified) return <a href="/verify">Verify with AfricaZK →</a>
  return <>{children}</>
}`;

export default function Page() {
  return (
    <DocPage
      eyebrow="Getting Started"
      title="Quick Start"
      href="/docs/quick-start"
      intro={
        <>
          Get an AfricaZK-verified user into your Solana dApp in four steps.
          No backend changes. No data to store.
        </>
      }
    >
      <h2 id="step-1">1. Install</h2>
      <p>
        Add the SDK and the Solana wallet adapter to your project.
      </p>
      <CodeBlock code={STEP_1} lang="bash" filename="terminal" />

      <h2 id="step-2">2. Check the connected wallet</h2>
      <p>
        Always start with{" "}
        <span className="azk-inline-code">checkAttestation()</span>. Verified
        users carry their attestation in their wallet, so most users will
        already pass after the first check and never see your verification
        screen again.
      </p>
      <CodeBlock code={STEP_2} lang="ts" filename="check.ts" />

      <h2 id="step-3">3. Run the verification flow</h2>
      <p>
        Only if the wallet isn&apos;t already attested, kick off the
        three-step flow. The user enters their NIN or BVN once. AfricaZK
        confirms it, generates a ZK proof inside the browser, and submits the
        proof to the Anchor program. You never see the NIN.
      </p>
      <CodeBlock code={STEP_3} lang="ts" filename="verify.ts" />

      <Callout kind="warning" title="Wipe the credential immediately">
        The credential returned from{" "}
        <span className="azk-inline-code">verifyIdentity()</span> is a signed
        bundle that lives in memory only. Pass it directly to{" "}
        <span className="azk-inline-code">generateProof()</span> — never
        persist it, never log it, never send it anywhere.
      </Callout>

      <h2 id="step-4">4. Gate your features</h2>
      <p>
        Wrap any verified-only route or component in a small gate. Below is a
        complete React component you can copy-paste. It checks the wallet on
        every mount and either renders the protected content or shows a link
        to your verification page.
      </p>
      <CodeBlock code={STEP_4} lang="tsx" filename="VerifiedGate.tsx" />

      <Callout kind="success" title="That is the entire integration.">
        Five SDK functions, one component, one route. You are now serving
        verified Nigerian adults — without ever touching their personal data.
      </Callout>

      <h2 id="next-steps">Where to go next</h2>
      <ul>
        <li>
          <a href="/docs/sdk/verify-identity">SDK reference</a> — every
          function, every parameter, every return shape.
        </li>
        <li>
          <a href="/docs/guides/nextjs">Integrating with Next.js</a> — full
          end-to-end guide including server-side gating.
        </li>
        <li>
          <a href="/docs/security/privacy">Privacy guarantees</a> — what
          AfricaZK does and does not see.
        </li>
      </ul>
    </DocPage>
  );
}
