import type { Metadata } from "next";
import DocPage from "@/components/docs/DocPage";
import CodeBlock from "@/components/ui/CodeBlock";

export const metadata: Metadata = {
  title: "TypeScript Types",
  description: "Every type exported by @africazk/identity, with field-by-field semantics.",
};

const TYPES = `// ────────────────────────────────────────────────────────────
// @africazk/identity — public types
// ────────────────────────────────────────────────────────────

export type IdType = 'NIN' | 'BVN'

export type Network = 'devnet' | 'mainnet-beta'

export type VerifyOptions = {
  idType: IdType
  idNumber: string         // 11-digit NIN or BVN
  dob: string              // YYYY-MM-DD
  backendUrl?: string      // override the default AfricaZK backend
}

export type SignedCredential = {
  idHash: string           // Poseidon(idNumber)
  age: number              // derived from dob
  idType: 1 | 2            // 1 = NIN, 2 = BVN
  signature: {
    R8: [string, string]
    S: string
  }
  Ax: string               // AfricaZK public key x
  Ay: string               // AfricaZK public key y
}

export type ZKProof = {
  proof: {
    pi_a: [string, string, string]
    pi_b: [[string, string], [string, string], [string, string]]
    pi_c: [string, string, string]
    protocol: 'groth16'
    curve: 'bn128'
  }
  publicSignals: [string, string]
  // publicSignals[0] = valid (1 | 0)
  // publicSignals[1] = nullifier
}

export type SubmitResult = {
  txSignature: string
  nullifier: string
  attestationPDA: string
  nullifierPDA: string
  slot: number
}

export type AttestationStatus =
  | { verified: false }
  | {
      verified: true
      verifiedAt: number              // unix ms
      protocol: 'AfricaZK-v1'
      attestationPDA: string
    }

// Errors thrown by the SDK
export class AfricaZKError extends Error {
  readonly code:
    | 'INVALID_INPUT'
    | 'BACKEND_FAILED'
    | 'CIRCUIT_FAILED'
    | 'PROOF_REJECTED'
    | 'DUPLICATE_NULLIFIER'
    | 'USER_REJECTED'
    | 'RPC_FAILED'
}`;

export default function Page() {
  return (
    <DocPage
      eyebrow="SDK Reference"
      title="TypeScript Types"
      href="/docs/sdk/types"
      intro={
        <>
          Every type the SDK exports, in one place. All five SDK functions
          consume and return types from this list. Importing these directly
          gives you full autocomplete and end-to-end type safety.
        </>
      }
    >
      <h2 id="exported-types">Exported types</h2>
      <CodeBlock code={TYPES} lang="ts" filename="@africazk/identity types" />

      <h2 id="usage">Importing</h2>
      <p>
        Every type above is a named export of{" "}
        <span className="azk-inline-code">@africazk/identity</span>. Use the{" "}
        <span className="azk-inline-code">import type</span> form so the
        types are erased at build time.
      </p>
      <CodeBlock
        code={`import type {
  VerifyOptions,
  SignedCredential,
  ZKProof,
  SubmitResult,
  AttestationStatus,
  IdType,
  Network,
} from '@africazk/identity'

import { AfricaZKError } from '@africazk/identity'`}
        lang="ts"
        filename="imports.ts"
      />

      <h2 id="discriminated-union">AttestationStatus is a discriminated union</h2>
      <p>
        The{" "}
        <span className="azk-inline-code">verified</span> field narrows the
        type. Once you check{" "}
        <span className="azk-inline-code">status.verified</span>, TypeScript
        knows the other fields are present.
      </p>
      <CodeBlock
        code={`const status = await checkAttestation(wallet, 'mainnet-beta')

if (status.verified) {
  // TS knows: status.verifiedAt, status.protocol, status.attestationPDA exist
  console.log(new Date(status.verifiedAt).toISOString())
}`}
        lang="ts"
        filename="narrowing.ts"
      />
    </DocPage>
  );
}
