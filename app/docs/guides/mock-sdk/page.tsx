import type { Metadata } from "next";
import Callout from "@/components/docs/Callout";
import DocPage from "@/components/docs/DocPage";
import CodeBlock from "@/components/ui/CodeBlock";

export const metadata: Metadata = {
  title: "Testing with Mock SDK",
  description:
    "Use @africazk/identity/mock to develop and test without hitting the backend or Solana.",
};

const SWITCH = `// lib/africazk.ts
const useMock = process.env.NEXT_PUBLIC_AFRICAZK_MOCK === '1'

export const {
  verifyIdentity,
  generateProof,
  submitProof,
  checkAttestation,
  wipeCredential,
} = useMock
  ? await import('@africazk/identity/mock')
  : await import('@africazk/identity')`;

const CONFIG = `import { configureMock } from '@africazk/identity/mock'

configureMock({
  verifyDelayMs: 800,        // simulated Dojah call
  proveDelayMs: 4000,        // simulated proof generation
  submitDelayMs: 1200,       // simulated wallet sign + RPC
  failVerifyFor: ['00000000000'], // these idNumbers fail backend
  alreadyVerifiedWallets: ['8xKp...3mNq'], // these wallets return verified: true
  persistInLocalStorage: true, // mock attestations survive reload
})`;

const ERROR = `// Force the next call to throw a specific error
import { setNextError } from '@africazk/identity/mock'

setNextError({ code: 'DUPLICATE_NULLIFIER', message: 'Mock duplicate' })
await submitProof(...) // throws AfricaZKError with that code`;

export default function Page() {
  return (
    <DocPage
      eyebrow="Guides"
      title="Testing with Mock SDK"
      href="/docs/guides/mock-sdk"
      intro={
        <>
          AfricaZK ships a drop-in mock implementation at{" "}
          <span className="azk-inline-code">@africazk/identity/mock</span>.
          Same five functions, same return types, same error codes — but no
          backend, no circuit, no Solana RPC. Perfect for fast iteration and
          deterministic tests.
        </>
      }
    >
      <h2 id="why">Why a mock</h2>
      <ul>
        <li>
          Proof generation takes 3–8 seconds in production. The mock returns
          in 4 seconds (configurable) so your animated UI is still tested,
          but without the CPU spike.
        </li>
        <li>
          The hosted backend is rate-limited per IP. The mock has no rate
          limit.
        </li>
        <li>
          You can reproduce every error code on demand — including the
          notoriously hard{" "}
          <span className="azk-inline-code">DUPLICATE_NULLIFIER</span>{" "}
          which is otherwise irreversible per identity.
        </li>
      </ul>

      <h2 id="switching">Switching between mock and real</h2>
      <CodeBlock code={SWITCH} lang="ts" filename="lib/africazk.ts" />
      <p>
        Re-export from a single module so swapping implementations is one
        environment variable. CI runs with the mock; staging and production
        run against the real SDK.
      </p>

      <h2 id="config">Configuring mock behavior</h2>
      <CodeBlock code={CONFIG} lang="ts" filename="lib/configure-mock.ts" />

      <h2 id="errors">Forcing errors</h2>
      <CodeBlock code={ERROR} lang="ts" filename="test/error-cases.ts" />

      <h2 id="persistence">localStorage persistence</h2>
      <p>
        With{" "}
        <span className="azk-inline-code">persistInLocalStorage: true</span>{" "}
        the mock writes attestation state to{" "}
        <span className="azk-inline-code">africazk-mock-state</span>. This
        is hugely useful for hand-testing the &quot;already verified&quot;
        path between page reloads. Clear it from devtools to reset.
      </p>

      <Callout kind="warning" title="Never ship the mock to production">
        Gate the dynamic import on a build-time-known constant so tree
        shaking can drop the mock from production bundles. Verifying real
        users against a mock that always returns success would be a
        catastrophic mistake.
      </Callout>
    </DocPage>
  );
}
