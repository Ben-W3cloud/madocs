import type { Metadata } from "next";
import Callout from "@/components/docs/Callout";
import DocPage from "@/components/docs/DocPage";
import FunctionSignature from "@/components/docs/FunctionSignature";
import { SimpleTable } from "@/components/docs/ParamsTable";
import CodeBlock from "@/components/ui/CodeBlock";

export const metadata: Metadata = {
  title: "generateProof()",
  description:
    "Run the AfricaZK Groth16 circuit in the browser. Output a zero-knowledge proof, wipe the credential from memory.",
};

const SIG = `generateProof(credential: SignedCredential): Promise<ZKProof>`;

const ZK_TYPE = `type ZKProof = {
  proof: {
    pi_a: [string, string, string]
    pi_b: [[string, string], [string, string], [string, string]]
    pi_c: [string, string, string]
    protocol: 'groth16'
    curve: 'bn128'
  }
  publicSignals: [string, string]
  // [0] = valid (1 if all circuit checks passed, 0 otherwise)
  // [1] = nullifier (one-way hash, deduplication key)
}`;

const EXAMPLE = `import { verifyIdentity, generateProof } from '@africazk/identity'

const credential = await verifyIdentity({
  idType: 'NIN',
  idNumber: nin,
  dob,
})

const proof = await generateProof(credential)
// credential fields have been zeroed and the object reference is no longer
// safe to use — it is a wiped husk by design.

if (proof.publicSignals[0] !== '1') {
  throw new Error('Circuit rejected the credential')
}

console.log('Nullifier:', proof.publicSignals[1])`;

export default function Page() {
  return (
    <DocPage
      eyebrow="SDK Reference"
      title="generateProof()"
      href="/docs/sdk/generate-proof"
      intro={
        <>
          Run the AfricaZK Groth16 circuit inside the user&apos;s browser.
          The circuit checks the EdDSA signature, the age, and the ID type —
          then outputs a zero-knowledge proof and a nullifier. The credential
          is wiped from memory before this function returns.
        </>
      }
    >
      <h2 id="signature">Signature</h2>
      <FunctionSignature code={SIG} />

      <h2 id="what-it-does">What this function does</h2>
      <ol>
        <li>Validates the credential object shape.</li>
        <li>
          Loads <span className="azk-inline-code">africazk.wasm</span> from
          the SDK bundle (≈ 240 KB, cached after first load).
        </li>
        <li>
          Runs{" "}
          <span className="azk-inline-code">snarkjs.groth16.fullProve()</span>{" "}
          with the credential as private input.
        </li>
        <li>
          The circuit checks: EdDSA signature valid, age ≥ 18, and idType is
          1 or 2.
        </li>
        <li>
          Verifies the proof locally with{" "}
          <span className="azk-inline-code">snarkjs.groth16.verify()</span>{" "}
          before returning. A circuit bug or tampered WASM is caught here.
        </li>
        <li>
          Wipes the credential from memory — sets every field to zero — so
          the original NIN hash cannot be recovered.
        </li>
        <li>Returns the proof and public signals.</li>
      </ol>

      <Callout kind="warning" title="Proof generation is expensive">
        Groth16 proof generation takes 3–8 seconds depending on device. Show
        a clear loading state. Do not call{" "}
        <span className="azk-inline-code">generateProof()</span> more than
        once per verification flow — fail loudly if a user tries to retry
        without restarting from{" "}
        <span className="azk-inline-code">verifyIdentity()</span>.
      </Callout>

      <h2 id="returns">Returns</h2>
      <p>
        A <span className="azk-inline-code">ZKProof</span> object containing
        a Groth16 proof and the public signals the verifier checks.
      </p>
      <CodeBlock code={ZK_TYPE} lang="ts" filename="ZKProof" />

      <h2 id="public-signals">Public signals</h2>
      <SimpleTable
        headers={["Index", "Value", "Description"]}
        rows={[
          [
            "0",
            "'1' | '0'",
            "valid — '1' means all three in-circuit checks passed",
          ],
          [
            "1",
            "string",
            "nullifier — a Poseidon hash of the idHash; unique per identity, unlinkable to the underlying ID",
          ],
        ]}
      />

      <h2 id="example">Example</h2>
      <CodeBlock code={EXAMPLE} lang="ts" filename="generate-proof-example.ts" />

      <h2 id="errors">Errors</h2>
      <SimpleTable
        headers={["Message", "Cause"]}
        rows={[
          [
            "Invalid credential shape",
            "credential is missing fields or has wrong types",
          ],
          [
            "Circuit constraints failed",
            "Age < 18, signature invalid, or idType is not 1 or 2",
          ],
          [
            "WASM failed to load",
            "Network/blob fetch error or CSP blocking wasm-unsafe-eval",
          ],
          [
            "Local verification failed",
            "Generated proof does not verify — indicates a corrupt circuit; do NOT submit",
          ],
        ]}
      />

      <h2 id="performance">Performance benchmarks</h2>
      <SimpleTable
        headers={["Device class", "Approximate proof time"]}
        rows={[
          ["Desktop (M1+ / Ryzen 5+)", "1.8s – 2.4s"],
          ["Modern laptop (Intel 11th gen)", "3.0s – 4.0s"],
          ["Mid-tier Android (2022)", "4.5s – 6.5s"],
          ["Older Android (2018)", "7.5s – 11s"],
        ]}
      />

      <h2 id="see-also">See also</h2>
      <ul>
        <li>
          <a href="/docs/sdk/submit-proof">submitProof()</a> — submit the
          generated proof on-chain.
        </li>
        <li>
          <a href="/docs/core-concepts/the-circuit">The Circuit</a> — what
          the constraints actually check.
        </li>
      </ul>
    </DocPage>
  );
}
