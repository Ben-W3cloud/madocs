import type { Metadata } from "next";
import DocPage from "@/components/docs/DocPage";

export const metadata: Metadata = {
  title: "How AfricaZK Works",
  description:
    "End-to-end protocol walkthrough — from NIN entry to AttestationRecord PDA.",
};

export default function Page() {
  return (
    <DocPage
      eyebrow="Core Concepts"
      title="How AfricaZK Works"
      href="/docs/core-concepts/how-it-works"
      intro={
        <>
          The full eight-step protocol, end to end. Read this once and you
          have a complete mental model of AfricaZK — what each piece does,
          what travels between them, and where personal data starts and
          stops existing.
        </>
      }
    >
      <h2 id="step-1">1. User enters NIN or BVN + date of birth</h2>
      <p>
        Everything starts in your dApp. The user enters their Nigerian ID
        and date of birth into a form you control. This is the only point in
        the entire flow where the raw ID exists outside the user&apos;s
        head.
      </p>

      <h2 id="step-2">2. AfricaZK backend confirms with Dojah</h2>
      <p>
        The SDK POSTs the inputs to the AfricaZK backend over HTTPS. The
        backend calls Dojah&apos;s NIN or BVN endpoint, which talks to the
        canonical NIMC or CBN database. If the ID is real and the dob
        matches, the server continues; otherwise it returns a
        verification-failed error.
      </p>

      <h2 id="step-3">3. Server hashes and signs</h2>
      <p>
        The server computes{" "}
        <span className="azk-inline-code">idHash = Poseidon(idNumber)</span>,
        derives <span className="azk-inline-code">age</span> from dob, builds{" "}
        <span className="azk-inline-code">
          credentialHash = Poseidon(idHash, age, idType)
        </span>
        , and signs it with the AfricaZK EdDSA private key. It returns the
        SignedCredential to the SDK and discards every input.
      </p>

      <h2 id="step-4">4. SDK runs the ZK circuit</h2>
      <p>
        The SDK loads{" "}
        <span className="azk-inline-code">africazk.wasm</span> in the
        browser and runs Groth16 proof generation. The circuit checks: the
        EdDSA signature is valid under the embedded AfricaZK public key, the
        age is at least 18, and the ID type is 1 or 2. It outputs a proof
        and two public signals — <span className="azk-inline-code">valid</span>{" "}
        and <span className="azk-inline-code">nullifier</span>.
      </p>

      <h2 id="step-5">5. Local verification</h2>
      <p>
        Before submitting, the SDK runs{" "}
        <span className="azk-inline-code">snarkjs.groth16.verify()</span>{" "}
        locally against the proof. This catches WASM corruption or
        tampering before a transaction is built.
      </p>

      <h2 id="step-6">6. User signs the Solana transaction</h2>
      <p>
        The SDK builds the Solana transaction carrying the proof and public
        signals, hands it to the connected wallet, and the user signs once.
      </p>

      <h2 id="step-7">7. AfricaZK Anchor program processes</h2>
      <p>The on-chain program does, in order:</p>
      <ol>
        <li>
          Checks <span className="azk-inline-code">valid === 1</span>.
        </li>
        <li>
          Checks Ax/Ay match the AfricaZK public key the program stores —
          rejects rogue signing keys.
        </li>
        <li>
          Derives the NullifierRecord PDA from the nullifier and initialises
          it. If the PDA already exists, the transaction fails — this is the
          one-person-one-wallet guarantee.
        </li>
        <li>
          Derives the AttestationRecord PDA from the wallet pubkey and
          initialises it with{" "}
          <span className="azk-inline-code">verified=true</span>, current
          timestamp, and protocol version{" "}
          <span className="azk-inline-code">&quot;AfricaZK-v1&quot;</span>.
        </li>
      </ol>

      <h2 id="step-8">8. Any dApp can read the attestation</h2>
      <p>
        Forever afterwards, any Solana dApp can call{" "}
        <span className="azk-inline-code">checkAttestation(walletAddress)</span>
        . The PDA exists, verified is true, the user is in. The dApp never
        saw the NIN, never stored personal data, never had to ask.
      </p>

      <h2 id="data-lifecycle">Where personal data lives at each step</h2>
      <ul>
        <li>
          <strong>Step 1:</strong> in the user&apos;s head and your form
          state.
        </li>
        <li>
          <strong>Step 2:</strong> traversing HTTPS to the AfricaZK backend
          and from there to Dojah.
        </li>
        <li>
          <strong>Step 3:</strong> in the server's memory for a few
          milliseconds, never logged, never persisted.
        </li>
        <li>
          <strong>Steps 4 onwards:</strong> nowhere. The browser holds a
          credential that is already Poseidon-hashed at this point, then
          wipes that too after the proof.
        </li>
      </ul>

      <h2 id="see-also">See also</h2>
      <ul>
        <li>
          <a href="/docs/core-concepts/the-circuit">The Circuit</a>
        </li>
        <li>
          <a href="/docs/core-concepts/anchor-program">The Anchor Program</a>
        </li>
        <li>
          <a href="/docs/security/privacy">Privacy Guarantees</a>
        </li>
      </ul>
    </DocPage>
  );
}
