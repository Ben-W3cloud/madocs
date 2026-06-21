import type { Metadata } from "next";
import Callout from "@/components/docs/Callout";
import DocPage from "@/components/docs/DocPage";

export const metadata: Metadata = {
  title: "Threat Model",
  description:
    "Attacker classes AfricaZK defends against, and the mitigations baked into each layer.",
};

export default function Page() {
  return (
    <DocPage
      eyebrow="Security"
      title="Threat Model"
      href="/docs/security/threat-model"
      intro={
        <>
          AfricaZK&apos;s threat model is built around four attacker
          classes. For each, we describe what they want, what they have, and
          what stops them.
        </>
      }
    >
      <h2 id="curious-dapp">Curious dApp</h2>
      <p>
        <strong>Wants:</strong> learn who its users are.
      </p>
      <p>
        <strong>Has:</strong> the wallet address and any data it asks the
        user for.
      </p>
      <p>
        <strong>Stopped by:</strong> the SDK never returns personal data to
        the dApp. The only AfricaZK-derived datum the dApp ever sees is the
        attestation boolean and timestamp. The dApp can correlate
        attestation timing across users it knows, but it cannot link a
        wallet to a NIN, name, or DOB — that link doesn&apos;t exist
        anywhere in AfricaZK&apos;s system.
      </p>

      <h2 id="compromised-backend">Compromised AfricaZK Backend</h2>
      <p>
        <strong>Wants:</strong> forge credentials, mint fake attestations,
        or retroactively dox users.
      </p>
      <p>
        <strong>Has:</strong> full server access including the EdDSA private
        key.
      </p>
      <p>
        <strong>Stopped by:</strong> the attacker can sign arbitrary
        credentials, but cannot reverse history. The backend keeps no logs
        and no DB rows, so there is nothing to retroactively read. Forged
        credentials can only verify wallets the attacker controls;
        AfricaZK&apos;s nullifier rule prevents them from claiming the
        attestation of an existing real user. Detection of forgery is via
        on-chain anomaly monitoring; recovery is via key rotation and a new
        program-stored public key.
      </p>
      <Callout kind="warning" title="Mitigation roadmap">
        Future versions will multi-sig the EdDSA signing key across N
        independent operators so a single backend compromise does not yield
        a usable signing key.
      </Callout>

      <h2 id="malicious-user">Malicious User</h2>
      <p>
        <strong>Wants:</strong> verify multiple wallets with the same
        identity, or verify with a fake NIN.
      </p>
      <p>
        <strong>Has:</strong> a real NIN, plus the ability to manipulate
        their own client.
      </p>
      <p>
        <strong>Stopped by:</strong>
      </p>
      <ul>
        <li>
          <strong>Fake NIN:</strong> rejected at Dojah lookup. The backend
          will not sign a credential for a NIN that doesn&apos;t resolve.
        </li>
        <li>
          <strong>Multiple wallets with same NIN:</strong> rejected
          on-chain. The NullifierRecord PDA is{" "}
          <span className="azk-inline-code">init</span>-only, so a second
          submission for the same nullifier fails with{" "}
          <span className="azk-inline-code">DuplicateNullifier</span>.
        </li>
        <li>
          <strong>Modified SDK that bypasses the circuit:</strong> can&apos;t
          help — the Anchor program runs its own proof verification and
          rejects anything that doesn&apos;t verify against the embedded
          Ax/Ay.
        </li>
      </ul>

      <h2 id="network-adversary">Network Adversary</h2>
      <p>
        <strong>Wants:</strong> intercept user credentials in transit.
      </p>
      <p>
        <strong>Has:</strong> position to MITM the user&apos;s connection.
      </p>
      <p>
        <strong>Stopped by:</strong> HTTPS to the AfricaZK backend.
        Certificate pinning is recommended for high-risk deployments. The
        only personal data ever transmitted is during the single POST to
        /api/verify — once that round trip ends, the credential is no
        longer in transit anywhere.
      </p>

      <h2 id="known-limitations">Known limitations</h2>
      <ul>
        <li>
          AfricaZK trusts Dojah to faithfully represent NIMC/CBN data. A
          compromised Dojah could attest false identities; we accept this
          dependency because alternatives require direct NIMC access which
          is not available to most stakeholders.
        </li>
        <li>
          AfricaZK does not prevent a user from voluntarily selling their
          verified wallet on a secondary market. The protocol enforces
          one-identity-one-wallet at registration time; the user&apos;s
          subsequent custody is their own responsibility.
        </li>
        <li>
          AfricaZK does not currently handle revocation triggered by NIMC
          (e.g. a NIN reported as fraudulent after verification). A future
          version will accept signed revocation messages from AfricaZK
          operators.
        </li>
      </ul>
    </DocPage>
  );
}
