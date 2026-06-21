import type { Metadata } from "next";
import Callout from "@/components/docs/Callout";
import DocPage from "@/components/docs/DocPage";
import { SimpleTable } from "@/components/docs/ParamsTable";

export const metadata: Metadata = {
  title: "What We Store",
  description:
    "An exhaustive table of every piece of data the AfricaZK system touches, where it lives, and for how long.",
};

export default function Page() {
  return (
    <DocPage
      eyebrow="Security"
      title="What We Store"
      href="/docs/security/what-we-store"
      intro={
        <>
          A full audit of every piece of data the AfricaZK system touches.
          Where it lives. How long. Who can see it. The summary is short:
          nothing personal lives anywhere durable.
        </>
      }
    >
      <h2 id="backend">AfricaZK Backend</h2>
      <SimpleTable
        headers={["Datum", "Storage", "Lifetime", "Readers"]}
        rows={[
          ["NIN / BVN", "Memory only", "Request duration", "Signing handler"],
          [
            "Date of birth",
            "Memory only",
            "Request duration",
            "Signing handler",
          ],
          [
            "Dojah response",
            "Memory only",
            "Request duration",
            "Signing handler",
          ],
          ["Request body in logs", "—", "Never logged", "—"],
          [
            "Rate-limit counters",
            "Redis / in-memory by IP hash",
            "Rolling 24h",
            "Backend only",
          ],
          [
            "Server access logs",
            "Standard nginx logs",
            "30 days",
            "Operators (IP + path only, no body)",
          ],
          [
            "EdDSA private key",
            "Encrypted secret store",
            "Until rotation",
            "Backend boot process",
          ],
        ]}
      />

      <h2 id="on-chain">On-Chain (Solana)</h2>
      <SimpleTable
        headers={["PDA", "Fields", "Lifetime"]}
        rows={[
          [
            "NullifierRecord",
            "nullifier (32 bytes), created_at, bump",
            "Permanent",
          ],
          [
            "AttestationRecord",
            "verified, timestamp, protocol, revoked, bump",
            "Permanent",
          ],
        ]}
      />
      <p>
        Neither PDA contains personal data. The nullifier is a hash chain;
        the attestation is a flag plus a timestamp. Both are public on
        Solana, like every other Solana account.
      </p>

      <h2 id="browser">In the User&apos;s Browser</h2>
      <SimpleTable
        headers={["Datum", "Storage", "Lifetime"]}
        rows={[
          [
            "NIN/BVN in form state",
            "React state",
            "Until form submit or unmount",
          ],
          [
            "SignedCredential",
            "JS heap",
            "From verifyIdentity() to generateProof() wipe",
          ],
          [
            "africazk.wasm",
            "Browser cache",
            "Standard HTTP cache rules",
          ],
        ]}
      />

      <h2 id="your-dapp">In Your dApp</h2>
      <p>
        Only what you choose to store. The recommended minimum:
      </p>
      <ul>
        <li>The wallet public key</li>
        <li>The boolean attestation status, cached per session</li>
      </ul>
      <p>
        Anything else is your own data classification problem, not
        AfricaZK&apos;s.
      </p>

      <Callout kind="success" title="The summary">
        The AfricaZK system, end-to-end, persists exactly two things about a
        verified user: a hash-of-a-hash nullifier and a boolean attestation
        flag with a timestamp. Neither reveals who the user is.
      </Callout>
    </DocPage>
  );
}
