import type { Metadata } from "next";
import DocPage from "@/components/docs/DocPage";
import CodeBlock from "@/components/ui/CodeBlock";

export const metadata: Metadata = {
  title: "AttestationRecord",
  description:
    "The on-chain account that any dApp reads to know a wallet is verified.",
};

const STRUCT = `#[account]
pub struct AttestationRecord {
    pub verified: bool,
    pub timestamp: i64,           // unix seconds
    pub protocol: [u8; 16],       // "AfricaZK-v1" + zero padding
    pub revoked: bool,
    pub bump: u8,
}
impl AttestationRecord {
    pub const SIZE: usize = 1 + 8 + 16 + 1 + 1;
}`;

const SEEDS = `seeds = [b"africazk-attestation", wallet_pubkey.as_ref()]
program_id = AfricaZK1111111111111111111111111111111111`;

const DERIVE_TS = `import { PublicKey } from '@solana/web3.js'

const PROGRAM_ID = new PublicKey('AfricaZK1111111111111111111111111111111111')

export function deriveAttestationPDA(wallet: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('africazk-attestation'), wallet.toBuffer()],
    PROGRAM_ID
  )
}`;

export default function Page() {
  return (
    <DocPage
      eyebrow="Core Concepts"
      title="AttestationRecord"
      href="/docs/core-concepts/attestation-record"
      intro={
        <>
          The AttestationRecord PDA is the wallet&apos;s public proof that it
          passed AfricaZK verification. It&apos;s the account every dApp
          reads to gate features. Deterministic seeds make it derivable from
          any wallet address.
        </>
      }
    >
      <h2 id="layout">Account layout</h2>
      <CodeBlock code={STRUCT} lang="ts" filename="AttestationRecord" />

      <h2 id="fields">Field semantics</h2>
      <ul>
        <li>
          <strong>verified</strong> — always{" "}
          <span className="azk-inline-code">true</span> on creation. The
          program only initialises this account on a successful proof
          submission.
        </li>
        <li>
          <strong>timestamp</strong> — Solana clock time at which the proof
          was accepted. Useful for &quot;verified within last N days&quot;
          policies.
        </li>
        <li>
          <strong>protocol</strong> — version tag, currently{" "}
          <span className="azk-inline-code">&quot;AfricaZK-v1&quot;</span>.
          dApps can refuse older protocol versions in the future.
        </li>
        <li>
          <strong>revoked</strong> — set if the user has explicitly revoked
          their attestation (a future SDK call). Treated as{" "}
          <span className="azk-inline-code">verified: false</span> by{" "}
          <span className="azk-inline-code">checkAttestation()</span>.
        </li>
      </ul>

      <h2 id="seeds">PDA seeds</h2>
      <CodeBlock code={SEEDS} lang="ts" filename="PDA derivation" />

      <h2 id="deriving">Deriving the PDA in TypeScript</h2>
      <p>
        You almost never need to do this manually —{" "}
        <span className="azk-inline-code">checkAttestation()</span> does it
        for you. But if you&apos;re composing AfricaZK with another Anchor
        program, here is the canonical derivation:
      </p>
      <CodeBlock code={DERIVE_TS} lang="ts" filename="derive.ts" />

      <h2 id="lifecycle">Lifecycle</h2>
      <ol>
        <li>
          <strong>Initialised</strong> by{" "}
          <span className="azk-inline-code">submit_proof</span> on first
          successful verification.
        </li>
        <li>
          <strong>Read</strong> by any dApp via{" "}
          <span className="azk-inline-code">checkAttestation()</span>.
        </li>
        <li>
          <strong>Optionally revoked</strong> by the user (future SDK
          version) — sets revoked = true.
        </li>
        <li>
          <strong>Permanent</strong>. The PDA itself is never closed; rent
          is paid once by the verifying user.
        </li>
      </ol>

      <h2 id="see-also">See also</h2>
      <ul>
        <li>
          <a href="/docs/sdk/check-attestation">checkAttestation()</a>
        </li>
        <li>
          <a href="/docs/reference/pda-seeds">PDA seeds reference</a>
        </li>
      </ul>
    </DocPage>
  );
}
