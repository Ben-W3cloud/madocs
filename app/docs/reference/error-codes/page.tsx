import type { Metadata } from "next";
import DocPage from "@/components/docs/DocPage";
import { SimpleTable } from "@/components/docs/ParamsTable";

export const metadata: Metadata = {
  title: "Error Codes",
  description: "All error codes from the SDK, the backend, and the Anchor program.",
};

export default function Page() {
  return (
    <DocPage
      eyebrow="Reference"
      title="Error Codes"
      href="/docs/reference/error-codes"
      intro={
        <>
          Reference card for every error code AfricaZK emits across its
          three layers — SDK, backend, and on-chain program. For UX
          recommendations see{" "}
          <a href="/docs/guides/error-handling">Error Handling</a>.
        </>
      }
    >
      <h2 id="sdk">SDK errors</h2>
      <SimpleTable
        headers={["Code", "Thrown by", "Recoverable"]}
        rows={[
          ["INVALID_INPUT", "verifyIdentity()", "Yes — fix input"],
          ["BACKEND_FAILED", "verifyIdentity()", "Depends on cause"],
          ["CIRCUIT_FAILED", "generateProof()", "Restart from verifyIdentity()"],
          ["PROOF_REJECTED", "submitProof()", "Restart from verifyIdentity()"],
          ["DUPLICATE_NULLIFIER", "submitProof()", "No — terminal"],
          ["USER_REJECTED", "submitProof()", "Yes — retry"],
          ["RPC_FAILED", "submitProof() / checkAttestation()", "Yes — retry with backoff"],
        ]}
      />

      <h2 id="backend">Backend HTTP errors</h2>
      <SimpleTable
        headers={["Status", "Body code", "Meaning"]}
        rows={[
          ["400", "INVALID_INPUT", "Request body failed validation"],
          ["400", "DOJAH_FAILED", "Dojah could not confirm the ID"],
          ["429", "RATE_LIMITED", "Per-IP rate limit hit"],
          ["500", "INTERNAL", "Backend or signing error"],
        ]}
      />

      <h2 id="anchor">Anchor program errors</h2>
      <SimpleTable
        headers={["Discriminator", "Name", "Meaning"]}
        rows={[
          ["6000", "InvalidProof", "valid signal is not 1 or Groth16 verify failed"],
          ["6001", "WrongIssuer", "Ax/Ay do not match the program-baked public key"],
          [
            "6002",
            "DuplicateNullifier",
            "NullifierRecord PDA already exists for this nullifier",
          ],
          [
            "6003",
            "DuplicateAttestation",
            "AttestationRecord PDA already exists for this wallet",
          ],
          ["6004", "RevokedAttestation", "Attempt to use a revoked attestation"],
        ]}
      />
    </DocPage>
  );
}
