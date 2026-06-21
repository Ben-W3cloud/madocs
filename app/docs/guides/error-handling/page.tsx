import type { Metadata } from "next";
import Callout from "@/components/docs/Callout";
import DocPage from "@/components/docs/DocPage";
import { SimpleTable } from "@/components/docs/ParamsTable";
import CodeBlock from "@/components/ui/CodeBlock";

export const metadata: Metadata = {
  title: "Error Handling",
  description:
    "Every error code the AfricaZK SDK can throw, with cause and recommended UX response.",
};

const SHAPE = `import { AfricaZKError } from '@africazk/identity'

try {
  await runFlow()
} catch (e) {
  if (e instanceof AfricaZKError) {
    switch (e.code) {
      case 'INVALID_INPUT':       return showFormError(e.message)
      case 'BACKEND_FAILED':      return showBanner('Verification failed — check your details')
      case 'CIRCUIT_FAILED':      return showBanner('Proof generation failed — please reload')
      case 'PROOF_REJECTED':      return showBanner('Proof was rejected on-chain')
      case 'DUPLICATE_NULLIFIER': return showFinal('This identity already has a verified wallet')
      case 'USER_REJECTED':       return showRetry('You cancelled the wallet signature')
      case 'RPC_FAILED':          return showRetry('Network error — please try again')
    }
  } else {
    showBanner('Something unexpected happened')
    console.error(e)
  }
}`;

export default function Page() {
  return (
    <DocPage
      eyebrow="Guides"
      title="Error Handling"
      href="/docs/guides/error-handling"
      intro={
        <>
          The SDK throws structured{" "}
          <span className="azk-inline-code">AfricaZKError</span> instances
          with stable error codes. Map each one to the right user-facing
          message and recovery path.
        </>
      }
    >
      <h2 id="codes">Error codes</h2>
      <SimpleTable
        headers={["Code", "Thrown by", "Cause", "Recovery"]}
        rows={[
          [
            "INVALID_INPUT",
            "verifyIdentity()",
            "idType / idNumber / dob failed format validation",
            "Show inline form errors; user fixes input",
          ],
          [
            "BACKEND_FAILED",
            "verifyIdentity()",
            "Dojah could not confirm the ID",
            "Show banner; suggest user double-check NIN/BVN",
          ],
          [
            "CIRCUIT_FAILED",
            "generateProof()",
            "Constraints failed (age < 18 or invalid signature) or WASM error",
            "Restart from verifyIdentity()",
          ],
          [
            "PROOF_REJECTED",
            "submitProof()",
            "Anchor program rejected the proof or public key",
            "Restart from verifyIdentity() — proof was tampered or stale",
          ],
          [
            "DUPLICATE_NULLIFIER",
            "submitProof()",
            "Identity already attested to another wallet",
            "Direct user to use the existing verified wallet — cannot proceed",
          ],
          [
            "USER_REJECTED",
            "submitProof()",
            "User cancelled the wallet signature",
            "Show retry button; no state changed",
          ],
          [
            "RPC_FAILED",
            "submitProof() / checkAttestation()",
            "RPC node unreachable or timed out",
            "Retry with exponential backoff; offer manual retry after 3 fails",
          ],
        ]}
      />

      <h2 id="handling">Recommended pattern</h2>
      <CodeBlock code={SHAPE} lang="ts" filename="error-router.ts" />

      <Callout kind="info" title="Default to friendly, not technical">
        Users do not care about &quot;BACKEND_FAILED&quot;. They care that
        they couldn&apos;t verify. Translate every code into a sentence a
        non-technical user can act on, and put the raw code into a small
        &quot;details&quot; toggle for support tickets.
      </Callout>

      <h2 id="retries">When to retry automatically</h2>
      <ul>
        <li>
          <strong>RPC_FAILED</strong> — yes, with exponential backoff (1s,
          2s, 4s, then surface).
        </li>
        <li>
          <strong>BACKEND_FAILED</strong> — no. The user input failed Dojah
          verification; retrying with the same input gives the same result.
        </li>
        <li>
          <strong>CIRCUIT_FAILED</strong> — no. The credential is dead;
          restart from{" "}
          <span className="azk-inline-code">verifyIdentity()</span>.
        </li>
        <li>
          <strong>USER_REJECTED</strong> — no. Wait for the user to click
          retry. Auto-retrying re-pops the wallet and annoys.
        </li>
      </ul>

      <h2 id="never">Errors you should never see in production</h2>
      <p>
        If you see <span className="azk-inline-code">PROOF_REJECTED</span>{" "}
        with valid SDK inputs, something is wrong: either the SDK is
        out-of-date relative to the deployed program, or the local proof
        verifier is broken. Open an issue.
      </p>
    </DocPage>
  );
}
