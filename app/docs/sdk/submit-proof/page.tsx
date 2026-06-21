import type { Metadata } from "next";
import Callout from "@/components/docs/Callout";
import DocPage from "@/components/docs/DocPage";
import FunctionSignature from "@/components/docs/FunctionSignature";
import { SimpleTable } from "@/components/docs/ParamsTable";
import CodeBlock from "@/components/ui/CodeBlock";

export const metadata: Metadata = {
  title: "submitProof()",
  description:
    "Submit a generated ZK proof to the AfricaZK Anchor program. The user signs a single transaction.",
};

const SIG = `submitProof(
  proof: ZKProof,
  wallet: WalletAdapter,
  network?: 'devnet' | 'mainnet-beta'
): Promise<SubmitResult>`;

const RESULT_TYPE = `type SubmitResult = {
  txSignature: string         // base58 Solana transaction signature
  nullifier: string           // same as proof.publicSignals[1]
  attestationPDA: string      // PDA address of the new AttestationRecord
  nullifierPDA: string        // PDA address of the new NullifierRecord
  slot: number                // confirmation slot
}`;

const EXAMPLE = `import { submitProof } from '@africazk/identity'
import { useWallet } from '@solana/wallet-adapter-react'

const wallet = useWallet()
const result = await submitProof(proof, wallet, 'mainnet-beta')

console.log('Submitted at slot', result.slot)
console.log('https://explorer.solana.com/tx/' + result.txSignature)`;

export default function Page() {
  return (
    <DocPage
      eyebrow="SDK Reference"
      title="submitProof()"
      href="/docs/sdk/submit-proof"
      intro={
        <>
          Submit a generated ZK proof to the AfricaZK Anchor program on
          Solana. The user signs the transaction with their wallet. On
          success, two PDAs are initialised on-chain and your dApp can read
          the user&apos;s attestation forever after.
        </>
      }
    >
      <h2 id="signature">Signature</h2>
      <FunctionSignature code={SIG} />

      <h2 id="on-chain-flow">What happens on-chain</h2>
      <ol>
        <li>SDK builds a Solana transaction with proof + public signals.</li>
        <li>User signs with their wallet (Phantom, Backpack, etc.).</li>
        <li>AfricaZK Anchor program receives the transaction.</li>
        <li>
          Program checks <span className="azk-inline-code">valid === 1</span>.
        </li>
        <li>
          Program checks <span className="azk-inline-code">Ax</span>/
          <span className="azk-inline-code">Ay</span> match the AfricaZK
          public key embedded in the program.
        </li>
        <li>
          NullifierRecord PDA is derived and initialised. Seeds:{" "}
          <span className="azk-inline-code">
            [&quot;africazk-nullifier&quot;, nullifier_bytes]
          </span>
          . If the PDA already exists the transaction fails — this is the
          duplicate-identity guard.
        </li>
        <li>
          AttestationRecord PDA is derived and initialised. Seeds:{" "}
          <span className="azk-inline-code">
            [&quot;africazk-attestation&quot;, wallet_pubkey]
          </span>
          . Stores <span className="azk-inline-code">verified=true</span>,
          timestamp,{" "}
          <span className="azk-inline-code">
            protocol=&quot;AfricaZK-v1&quot;
          </span>
          .
        </li>
        <li>Returns txSignature, nullifier, attestationPDA, nullifierPDA.</li>
      </ol>

      <h2 id="result">Result</h2>
      <CodeBlock code={RESULT_TYPE} lang="ts" filename="SubmitResult" />

      <h2 id="errors">Errors</h2>
      <SimpleTable
        headers={["Message / Code", "Cause", "Recovery"]}
        rows={[
          [
            "Duplicate nullifier",
            "This identity already has an attested wallet — the NullifierRecord PDA exists",
            "Show user the existing verified wallet; do not re-verify",
          ],
          [
            "Invalid proof",
            "Public signals or Ax/Ay rejected by the Anchor program",
            "Restart from verifyIdentity() — proof was tampered or malformed",
          ],
          [
            "User rejected",
            "User cancelled the wallet signature prompt",
            "Show a clear retry CTA — no on-chain state changed",
          ],
          [
            "Insufficient SOL",
            "Wallet does not have enough lamports for rent + fee",
            "Prompt user to fund the wallet (≈ 0.001 SOL is enough)",
          ],
          [
            "Blockhash expired",
            "Transaction built too long ago",
            "SDK retries automatically; surface only if all retries fail",
          ],
        ]}
      />

      <h2 id="example">Example</h2>
      <CodeBlock code={EXAMPLE} lang="ts" filename="submit-proof-example.ts" />

      <Callout kind="info" title="Network parameter">
        Defaults to <span className="azk-inline-code">mainnet-beta</span>. Use
        <span className="azk-inline-code">&apos;devnet&apos;</span> during
        development — both networks have their own AfricaZK program
        deployment and Anchor IDL.
      </Callout>

      <h2 id="cost">Cost</h2>
      <p>
        Each successful verification costs roughly{" "}
        <span className="text-green">0.0008 – 0.0012 SOL</span> at current
        Solana mainnet fees. Most of that is rent exemption for the two PDAs;
        the transaction fee itself is a few thousand lamports.
      </p>

      <h2 id="see-also">See also</h2>
      <ul>
        <li>
          <a href="/docs/core-concepts/anchor-program">The Anchor program</a>{" "}
          — instruction layout and account constraints.
        </li>
        <li>
          <a href="/docs/sdk/check-attestation">checkAttestation()</a> — read
          the attestation that was just created.
        </li>
      </ul>
    </DocPage>
  );
}
