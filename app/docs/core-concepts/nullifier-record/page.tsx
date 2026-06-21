import type { Metadata } from "next";
import Callout from "@/components/docs/Callout";
import DocPage from "@/components/docs/DocPage";
import CodeBlock from "@/components/ui/CodeBlock";

export const metadata: Metadata = {
  title: "NullifierRecord",
  description:
    "The on-chain account that prevents one identity from registering multiple wallets.",
};

const STRUCT = `#[account]
pub struct NullifierRecord {
    pub nullifier: [u8; 32], // Poseidon(idHash)
    pub created_at: i64,     // unix seconds
    pub bump: u8,
}
impl NullifierRecord {
    pub const SIZE: usize = 32 + 8 + 1;
}`;

const SEEDS = `seeds = [b"africazk-nullifier", nullifier_bytes]
program_id = AfricaZK1111111111111111111111111111111111`;

export default function Page() {
  return (
    <DocPage
      eyebrow="Core Concepts"
      title="NullifierRecord"
      href="/docs/core-concepts/nullifier-record"
      intro={
        <>
          The NullifierRecord PDA is how AfricaZK guarantees that one real
          person can have at most one verified wallet, forever. It is
          derived deterministically from the user&apos;s nullifier — a
          one-way hash of their idHash.
        </>
      }
    >
      <h2 id="layout">Account layout</h2>
      <CodeBlock code={STRUCT} lang="ts" filename="NullifierRecord" />

      <h2 id="seeds">PDA seeds</h2>
      <CodeBlock code={SEEDS} lang="ts" filename="PDA derivation" />

      <h2 id="purpose">Purpose</h2>
      <p>
        Without this account, a user could verify with their real NIN once,
        wipe their wallet, generate another wallet, and verify again — the
        same identity attested to multiple wallets. The NullifierRecord PDA
        is{" "}
        <span className="azk-inline-code">init</span>-only on creation:
        attempting to derive it a second time fails because the account
        already exists. One nullifier = one wallet.
      </p>

      <h2 id="why-not-revealing">Why this doesn&apos;t leak identity</h2>
      <p>
        The nullifier is{" "}
        <span className="azk-inline-code">Poseidon(idHash)</span> — a
        one-way hash of an already-hashed ID number. Given a NullifierRecord
        on-chain, an observer cannot recover the idHash, let alone the NIN.
        They can only check whether <em>this specific</em> nullifier has
        been registered.
      </p>

      <Callout kind="info" title="Linkability across dApps">
        A dApp that knows a user&apos;s nullifier can correlate that user
        across protocols that also know it. The SDK never exposes the
        nullifier to your dApp by default — only AfricaZK&apos;s Anchor
        program ever needs it. If you build something that requires
        nullifier-level deduplication beyond AfricaZK, do so explicitly so
        users know.
      </Callout>

      <h2 id="rent">Rent</h2>
      <p>
        The account is rent-exempt and paid for by the user on creation. The
        ~41-byte account costs about 0.0009 SOL.
      </p>

      <h2 id="see-also">See also</h2>
      <ul>
        <li>
          <a href="/docs/core-concepts/attestation-record">AttestationRecord</a>
        </li>
        <li>
          <a href="/docs/reference/pda-seeds">PDA seeds reference</a>
        </li>
      </ul>
    </DocPage>
  );
}
