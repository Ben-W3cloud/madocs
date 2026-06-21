import type { Metadata } from "next";
import DocPage from "@/components/docs/DocPage";
import { SimpleTable } from "@/components/docs/ParamsTable";
import CodeBlock from "@/components/ui/CodeBlock";

export const metadata: Metadata = {
  title: "PDA Seeds",
  description: "Canonical seed strings and derivation snippets for every AfricaZK PDA.",
};

const TS = `import { PublicKey } from '@solana/web3.js'

const PROGRAM_ID = new PublicKey('AfricaZK1111111111111111111111111111111111')

export function deriveAttestationPDA(wallet: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('africazk-attestation'), wallet.toBuffer()],
    PROGRAM_ID
  )
}

export function deriveNullifierPDA(nullifierBytes: Uint8Array) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('africazk-nullifier'), nullifierBytes],
    PROGRAM_ID
  )
}`;

const RUST = `pub const ATTESTATION_SEED: &[u8] = b"africazk-attestation";
pub const NULLIFIER_SEED: &[u8] = b"africazk-nullifier";

// On-chain derivation
let (attestation, _bump) = Pubkey::find_program_address(
    &[ATTESTATION_SEED, wallet.as_ref()],
    &crate::ID,
);
let (nullifier_pda, _bump) = Pubkey::find_program_address(
    &[NULLIFIER_SEED, &nullifier_bytes],
    &crate::ID,
);`;

export default function Page() {
  return (
    <DocPage
      eyebrow="Reference"
      title="PDA Seeds"
      href="/docs/reference/pda-seeds"
      intro={
        <>
          The exact byte sequences used to derive every PDA in the AfricaZK
          program. Use these from both TypeScript clients and downstream
          Anchor programs that compose with AfricaZK.
        </>
      }
    >
      <h2 id="program-id">Program ID</h2>
      <SimpleTable
        headers={["Network", "Program ID"]}
        rows={[
          ["mainnet-beta", "AfricaZK1111111111111111111111111111111111"],
          ["devnet", "AfricaZK1111111111111111111111111111111111"],
        ]}
      />

      <h2 id="seeds">Seeds</h2>
      <SimpleTable
        headers={["Account", "Seed bytes", "Variable component"]}
        rows={[
          [
            "AttestationRecord",
            '"africazk-attestation"',
            "wallet pubkey (32 bytes)",
          ],
          [
            "NullifierRecord",
            '"africazk-nullifier"',
            "nullifier bytes (32 bytes, derived from public signals[1])",
          ],
        ]}
      />

      <h2 id="typescript">TypeScript</h2>
      <CodeBlock code={TS} lang="ts" filename="pda.ts" />

      <h2 id="rust">Rust / Anchor</h2>
      <CodeBlock code={RUST} lang="ts" filename="pda.rs" />

      <h2 id="caveats">Caveats</h2>
      <ul>
        <li>
          Always use{" "}
          <span className="azk-inline-code">findProgramAddressSync</span> —
          do not hardcode bumps. Anchor will refuse PDAs with non-canonical
          bumps.
        </li>
        <li>
          The nullifier bytes are the 32-byte big-endian representation of
          the public signal. The SDK exposes them already in this form.
        </li>
        <li>
          If you compose AfricaZK with another Anchor program, your program
          can directly read the AttestationRecord by deriving the PDA and
          adding it as a read-only account constraint.
        </li>
      </ul>
    </DocPage>
  );
}
