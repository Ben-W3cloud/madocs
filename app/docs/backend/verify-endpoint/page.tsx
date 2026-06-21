import type { Metadata } from "next";
import Callout from "@/components/docs/Callout";
import DocPage from "@/components/docs/DocPage";
import ParamsTable, { SimpleTable } from "@/components/docs/ParamsTable";
import CodeBlock from "@/components/ui/CodeBlock";

export const metadata: Metadata = {
  title: "POST /api/verify",
  description:
    "AfricaZK backend endpoint that confirms a Nigerian ID with Dojah and returns a signed credential.",
};

const REQ = `POST https://africazk-backend.railway.app/api/verify
Content-Type: application/json

{
  "idType": "NIN",
  "idNumber": "12345678901",
  "dob": "2000-01-15"
}`;

const RES_200 = `{
  "idHash": "1873…f02b",
  "age": 24,
  "idType": 1,
  "signature": {
    "R8": ["…", "…"],
    "S": "…"
  },
  "Ax": "…",
  "Ay": "…"
}`;

export default function Page() {
  return (
    <DocPage
      eyebrow="Backend Reference"
      title="POST /api/verify"
      href="/docs/backend/verify-endpoint"
      intro={
        <>
          The single endpoint exposed by the AfricaZK backend. It accepts a
          Nigerian ID and date of birth, confirms the ID through Dojah, and
          returns a signed credential. The SDK calls this for you — but if
          you self-host the backend, this is the contract.
        </>
      }
    >
      <h2 id="request">Request</h2>
      <CodeBlock code={REQ} lang="bash" filename="HTTP" />
      <ParamsTable
        rows={[
          {
            name: "idType",
            type: "'NIN' | 'BVN'",
            required: true,
            description: "Which Nigerian ID to verify.",
          },
          {
            name: "idNumber",
            type: "string",
            required: true,
            description: "11-digit numeric string. Whitespace stripped.",
          },
          {
            name: "dob",
            type: "string",
            required: true,
            description: "Date of birth, YYYY-MM-DD.",
          },
        ]}
      />

      <h2 id="response-200">200 Response</h2>
      <CodeBlock code={RES_200} lang="json" filename="SignedCredential JSON" />
      <SimpleTable
        headers={["Field", "Type", "Meaning"]}
        rows={[
          ["idHash", "string", "Poseidon hash of the cleaned id number"],
          ["age", "number", "Whole years between dob and today"],
          ["idType", "1 | 2", "1 = NIN, 2 = BVN"],
          [
            "signature.R8 / .S",
            "EdDSA",
            "Signature of Poseidon(idHash, age, idType) under the AfricaZK private key",
          ],
          ["Ax / Ay", "string", "AfricaZK public key — must match the program's stored key"],
        ]}
      />

      <h2 id="errors">Error responses</h2>
      <SimpleTable
        headers={["Status", "Body code", "Cause"]}
        rows={[
          ["400", "INVALID_INPUT", "idType, idNumber, or dob failed validation"],
          ["400", "DOJAH_FAILED", "Dojah could not confirm the ID"],
          ["429", "RATE_LIMITED", "Too many requests from this IP"],
          ["500", "INTERNAL", "Backend or signing error"],
        ]}
      />

      <h2 id="what-it-does">What the backend does internally</h2>
      <ol>
        <li>Validates input shape and length.</li>
        <li>
          Calls Dojah&apos;s NIN or BVN endpoint with the id number.
        </li>
        <li>
          Verifies the user&apos;s claimed date of birth matches the Dojah
          response within a tolerance window.
        </li>
        <li>
          Computes{" "}
          <span className="azk-inline-code">idHash = Poseidon(idNumber)</span>
          .
        </li>
        <li>
          Computes age from dob and rejects anything that isn&apos;t a real
          adult.
        </li>
        <li>
          Builds{" "}
          <span className="azk-inline-code">
            credentialHash = Poseidon(idHash, age, idType)
          </span>
          .
        </li>
        <li>
          Signs the credentialHash with the AfricaZK EdDSA private key (using
          circomlib&apos;s{" "}
          <span className="azk-inline-code">EdDSAPoseidon</span>
          ).
        </li>
        <li>
          Returns the SignedCredential. <strong>Discards every input</strong>{" "}
          — no logs, no DB writes, no analytics.
        </li>
      </ol>

      <Callout kind="danger" title="Do not call this endpoint directly from your dApp">
        Use the SDK. It validates inputs, formats the credential, manages
        memory, and avoids exposing the raw network shape to your UI. The
        backend may also rate-limit unrecognised user agents.
      </Callout>

      <h2 id="rate-limits">Rate limits</h2>
      <p>
        The hosted backend enforces a per-IP limit of 10 verification
        attempts per hour and 60 per day. If you are running a high-traffic
        dApp, self-host the backend — see{" "}
        <a href="/docs/backend/environment-variables">Environment Variables</a>{" "}
        for the required setup.
      </p>

      <h2 id="see-also">See also</h2>
      <ul>
        <li>
          <a href="/docs/backend/eddsa-signing">EdDSA Signing</a>
        </li>
        <li>
          <a href="/docs/backend/dojah-integration">Dojah Integration</a>
        </li>
      </ul>
    </DocPage>
  );
}
