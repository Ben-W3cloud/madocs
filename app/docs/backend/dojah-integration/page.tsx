import type { Metadata } from "next";
import Callout from "@/components/docs/Callout";
import DocPage from "@/components/docs/DocPage";
import { SimpleTable } from "@/components/docs/ParamsTable";
import CodeBlock from "@/components/ui/CodeBlock";

export const metadata: Metadata = {
  title: "Dojah Integration",
  description:
    "How the AfricaZK backend uses Dojah's licensed NIN and BVN endpoints to confirm Nigerian identities.",
};

const NIN_REQ = `POST https://api.dojah.io/api/v1/kyc/nin
Authorization: \${DOJAH_AUTH}
AppId: \${DOJAH_APP_ID}
Content-Type: application/json

{ "nin": "12345678901" }`;

const BVN_REQ = `POST https://api.dojah.io/api/v1/kyc/bvn/full
Authorization: \${DOJAH_AUTH}
AppId: \${DOJAH_APP_ID}
Content-Type: application/json

{ "bvn": "12345678901" }`;

export default function Page() {
  return (
    <DocPage
      eyebrow="Backend Reference"
      title="Dojah Integration"
      href="/docs/backend/dojah-integration"
      intro={
        <>
          AfricaZK uses Dojah as its NIN and BVN data provider. Dojah is a
          CBN-licensed and NIMC-authorised infrastructure provider with
          direct access to the canonical Nigerian identity databases. This
          page documents the exact endpoints AfricaZK calls and how errors
          map back to SDK errors.
        </>
      }
    >
      <h2 id="auth">Authentication</h2>
      <p>
        Dojah requires two headers — an{" "}
        <span className="azk-inline-code">Authorization</span> token and an{" "}
        <span className="azk-inline-code">AppId</span>. Both come from a
        Dojah account and are stored as backend environment variables.
      </p>

      <h2 id="nin-endpoint">NIN endpoint</h2>
      <CodeBlock code={NIN_REQ} lang="bash" filename="HTTP — Dojah NIN" />
      <p>
        AfricaZK reads the{" "}
        <span className="azk-inline-code">first_name</span>,{" "}
        <span className="azk-inline-code">last_name</span>, and{" "}
        <span className="azk-inline-code">date_of_birth</span> from the
        response, confirms the dob matches the user&apos;s claim, and then
        discards everything except the boolean &quot;ID is valid&quot;
        result.
      </p>

      <h2 id="bvn-endpoint">BVN endpoint</h2>
      <CodeBlock code={BVN_REQ} lang="bash" filename="HTTP — Dojah BVN" />
      <p>
        BVN payloads include richer data (phone, address). AfricaZK reads{" "}
        <span className="azk-inline-code">date_of_birth</span> only.
        Everything else is discarded in memory, not logged, and not sent
        further downstream.
      </p>

      <h2 id="error-mapping">Error mapping</h2>
      <SimpleTable
        headers={["Dojah response", "AfricaZK backend response", "SDK error"]}
        rows={[
          ["200 + entity returned", "200 + SignedCredential", "—"],
          [
            "200 + entity null",
            "400 DOJAH_FAILED",
            "Verification failed (SDK)",
          ],
          [
            "401 / 403",
            "500 INTERNAL",
            "Backend unreachable (SDK) — Dojah credentials misconfigured",
          ],
          ["429", "429 RATE_LIMITED", "Rate limited (SDK)"],
          [
            "5xx",
            "500 INTERNAL",
            "Backend unreachable (SDK) — retry with backoff",
          ],
        ]}
      />

      <h2 id="data-retention">Data retention</h2>
      <Callout kind="success" title="AfricaZK retains nothing">
        Dojah responses are processed in-memory, used to build one
        SignedCredential, then dropped when the request returns. The
        backend writes no database row, no log line, and no analytics event
        containing the NIN, BVN, or any returned PII.
      </Callout>

      <h2 id="self-hosting">Self-hosting</h2>
      <p>
        To self-host the AfricaZK backend with your own Dojah account, set{" "}
        <span className="azk-inline-code">DOJAH_AUTH</span> and{" "}
        <span className="azk-inline-code">DOJAH_APP_ID</span> — see{" "}
        <a href="/docs/backend/environment-variables">Environment Variables</a>
        . Dojah&apos;s production endpoints are gated behind a Production
        Mode toggle in your Dojah dashboard.
      </p>
    </DocPage>
  );
}
