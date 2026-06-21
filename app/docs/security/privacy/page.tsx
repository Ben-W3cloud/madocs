import type { Metadata } from "next";
import Callout from "@/components/docs/Callout";
import DocPage from "@/components/docs/DocPage";
import { SimpleTable } from "@/components/docs/ParamsTable";

export const metadata: Metadata = {
  title: "Privacy Guarantees",
  description:
    "What AfricaZK does and does not see, store, or log — at every step of the protocol.",
};

export default function Page() {
  return (
    <DocPage
      eyebrow="Security"
      title="Privacy Guarantees"
      href="/docs/security/privacy"
      intro={
        <>
          Privacy at AfricaZK is enforced by design, not policy. There is
          almost nothing to leak because there is almost nothing stored.
          This page walks through every byte of data that touches the
          system and where it goes.
        </>
      }
    >
      <h2 id="data-flow">What data flows where</h2>
      <SimpleTable
        headers={["Stage", "Data", "Where it lives", "Lifespan"]}
        rows={[
          [
            "Form entry",
            "NIN/BVN, DOB",
            "User's browser, your form state",
            "Until form submit",
          ],
          [
            "POST /api/verify",
            "NIN/BVN, DOB",
            "In transit over HTTPS",
            "Single request",
          ],
          [
            "Dojah call",
            "NIN/BVN",
            "AfricaZK backend → Dojah",
            "Single request",
          ],
          [
            "Backend signing",
            "Plaintext ID",
            "Backend memory only",
            "≈ 50–200ms then GC",
          ],
          [
            "SignedCredential",
            "Poseidon hash + signature",
            "Browser memory",
            "Until generateProof() wipes it",
          ],
          [
            "ZK proof",
            "Mathematical artefact",
            "Browser memory → Solana",
            "Permanent on-chain (no personal data)",
          ],
          [
            "On-chain",
            "Nullifier + Attestation",
            "Solana PDAs",
            "Permanent",
          ],
        ]}
      />

      <h2 id="what-we-store">What AfricaZK stores</h2>
      <p className="text-text-primary">
        Nothing personal. Nothing reversible. Nothing.
      </p>
      <ul>
        <li>
          <strong>AfricaZK backend</strong> — no database. Each request
          opens a memory-only handler, makes one Dojah call, signs one
          credential, returns. There is no logger that writes the body.
        </li>
        <li>
          <strong>AfricaZK on-chain program</strong> — stores two PDAs per
          verified user: a nullifier (one-way hash of a hash) and an
          attestation flag with a timestamp. Neither reveals identity.
        </li>
        <li>
          <strong>Your dApp</strong> — only what you choose to store. The
          SDK gives you a boolean. We strongly recommend storing only the
          wallet address and its attestation status.
        </li>
      </ul>

      <h2 id="nullifier">The nullifier — what it reveals and what it doesn&apos;t</h2>
      <p>
        The nullifier is{" "}
        <span className="azk-inline-code">Poseidon(Poseidon(NIN))</span>.
        Given a nullifier, you cannot recover the inner hash, let alone the
        NIN itself. What you can do: check whether a specific nullifier has
        registered.
      </p>
      <p>
        This means a determined observer who already knows a candidate NIN
        could test whether that NIN has been used by computing the same hash
        chain. AfricaZK accepts this trade-off because it&apos;s the only
        way to enforce one-identity-one-wallet without storing identity.
      </p>

      <h2 id="comparison">Compared with traditional KYC</h2>
      <SimpleTable
        headers={["Concern", "Traditional dApp KYC", "AfricaZK"]}
        rows={[
          ["NIN stored at rest", "Yes — in dApp DB", "No — anywhere"],
          ["NIN seen by dApp", "Yes", "No"],
          ["NIN visible in logs", "Often, accidentally", "Never — no logger touches it"],
          [
            "Linkable across dApps",
            "Yes, via the NIN",
            "Only via the nullifier, which is a hash-of-hash",
          ],
          [
            "Recovery from a breach",
            "Notification + lifelong risk",
            "Nothing to breach",
          ],
        ]}
      />

      <Callout kind="success" title="Privacy as a property, not a promise">
        AfricaZK&apos;s privacy is enforced by cryptography and by code
        absence. Even a malicious AfricaZK operator with full server access
        cannot retroactively learn which NIN belongs to which wallet — the
        link doesn&apos;t exist anywhere to be discovered.
      </Callout>
    </DocPage>
  );
}
