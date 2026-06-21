import type { Metadata } from "next";
import Callout from "@/components/docs/Callout";
import DocPage from "@/components/docs/DocPage";
import FunctionSignature from "@/components/docs/FunctionSignature";
import ParamsTable, { SimpleTable } from "@/components/docs/ParamsTable";
import CodeBlock from "@/components/ui/CodeBlock";

export const metadata: Metadata = {
  title: "verifyIdentity()",
  description:
    "Confirm a Nigerian ID with Dojah through the AfricaZK backend and receive a signed credential in memory.",
};

const SIG = `verifyIdentity(options: VerifyOptions): Promise<SignedCredential>`;

const CREDENTIAL_TYPE = `type SignedCredential = {
  idHash: string        // Poseidon(idNumber)
  age: number           // computed by backend from dob
  idType: 1 | 2         // 1 = NIN, 2 = BVN
  signature: {
    R8: [string, string]  // EdDSA point
    S: string             // EdDSA scalar
  }
  Ax: string            // AfricaZK public key x
  Ay: string            // AfricaZK public key y
}`;

const EXAMPLE = `import { verifyIdentity, generateProof } from '@africazk/identity'

try {
  const credential = await verifyIdentity({
    idType: 'NIN',
    idNumber: '12345678901',
    dob: '2000-01-15',
  })
  // credential is now in memory — pass straight to generateProof()
  const proof = await generateProof(credential)
} catch (error) {
  console.error(error.message)
}`;

export default function Page() {
  return (
    <DocPage
      eyebrow="SDK Reference"
      title="verifyIdentity()"
      href="/docs/sdk/verify-identity"
      intro={
        <>
          Confirm a user&apos;s Nigerian ID with Dojah through the AfricaZK
          backend and receive a SignedCredential bundle. The credential lives
          in browser memory only — pass it straight to{" "}
          <span className="azk-inline-code">generateProof()</span>.
        </>
      }
    >
      <h2 id="signature">Signature</h2>
      <FunctionSignature code={SIG} />

      <h2 id="parameters">Parameters</h2>
      <ParamsTable
        rows={[
          {
            name: "idType",
            type: "'NIN' | 'BVN'",
            required: true,
            description: "Which Nigerian ID to verify against.",
          },
          {
            name: "idNumber",
            type: "string",
            required: true,
            description:
              "The 11-digit NIN or BVN. Whitespace and dashes are stripped automatically.",
          },
          {
            name: "dob",
            type: "string",
            required: true,
            description: "Date of birth in YYYY-MM-DD format.",
          },
          {
            name: "backendUrl",
            type: "string",
            required: false,
            description:
              "Override the default AfricaZK backend URL. Useful for self-hosted backends or testing.",
          },
        ]}
      />

      <h2 id="returns">Returns</h2>
      <p>
        A <span className="azk-inline-code">SignedCredential</span> object —
        a Poseidon-hashed ID plus AfricaZK&apos;s EdDSA signature over it.
      </p>
      <CodeBlock code={CREDENTIAL_TYPE} lang="ts" filename="SignedCredential" />

      <h2 id="what-it-does">What this function does</h2>
      <ol>
        <li>Validates idType, idNumber format, and dob.</li>
        <li>
          Calls <span className="azk-inline-code">POST {`{backendUrl}`}/api/verify</span>{" "}
          with the inputs over HTTPS.
        </li>
        <li>Backend confirms the ID with Dojah and signs a credential.</li>
        <li>Returns the SignedCredential to the browser.</li>
        <li>
          The credential lives in memory only — never persisted to disk,
          localStorage, or any logger.
        </li>
      </ol>

      <h2 id="errors">Errors</h2>
      <SimpleTable
        headers={["Message", "Cause", "What to do"]}
        rows={[
          ["idType must be NIN or BVN", "Invalid idType passed", "Fix the input"],
          [
            "idNumber must be 11 digits",
            "Wrong length",
            "Validate before calling",
          ],
          ["dob must be YYYY-MM-DD", "Wrong date format", "Use ISO format"],
          [
            "Verification failed",
            "Dojah could not confirm the ID",
            "Show user-facing error, allow retry",
          ],
          [
            "Backend unreachable",
            "Network error or backend down",
            "Retry with exponential backoff",
          ],
          [
            "Rate limited",
            "Too many requests from this IP",
            "Wait and retry; surface a clear message",
          ],
        ]}
      />

      <h2 id="example">Example</h2>
      <CodeBlock code={EXAMPLE} lang="ts" filename="verify-identity-example.ts" />

      <Callout kind="warning" title="Do not store the credential">
        Pass the credential directly to{" "}
        <span className="azk-inline-code">generateProof()</span>.{" "}
        <span className="azk-inline-code">generateProof()</span> wipes it
        from memory after the proof is generated. If you keep a reference
        around, the credential lingers in memory until garbage collection.
      </Callout>

      <h2 id="see-also">See also</h2>
      <ul>
        <li>
          <a href="/docs/sdk/generate-proof">generateProof()</a> — the next
          step.
        </li>
        <li>
          <a href="/docs/backend/verify-endpoint">POST /api/verify</a> —
          backend reference.
        </li>
        <li>
          <a href="/docs/security/privacy">Privacy guarantees</a> — exactly
          what the backend sees.
        </li>
      </ul>
    </DocPage>
  );
}
