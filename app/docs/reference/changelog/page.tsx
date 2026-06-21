import type { Metadata } from "next";
import DocPage from "@/components/docs/DocPage";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Versioned release notes for @africazk/identity and the Anchor program.",
};

export default function Page() {
  return (
    <DocPage
      eyebrow="Reference"
      title="Changelog"
      href="/docs/reference/changelog"
      intro={
        <>
          Versioned release notes for the AfricaZK SDK and Anchor program.
          Breaking changes are explicit. Patch releases are
          backwards-compatible.
        </>
      }
    >
      <h2 id="v1-0-0">v1.0.0 — initial public release</h2>
      <p>
        First stable release of the AfricaZK protocol, shipped at Hack4FUTO
        2025.
      </p>
      <ul>
        <li>
          <strong>SDK</strong> — five functions, full TypeScript types,
          mock implementation at{" "}
          <span className="azk-inline-code">@africazk/identity/mock</span>.
        </li>
        <li>
          <strong>Circuit</strong> — AfricaZKIdentity v1, 6.8k constraints,
          240 KB WASM.
        </li>
        <li>
          <strong>Anchor program</strong> — submit_proof instruction,
          NullifierRecord + AttestationRecord PDAs.
        </li>
        <li>
          <strong>Backend</strong> — POST /api/verify endpoint, Dojah
          integration, EdDSAPoseidon signing.
        </li>
      </ul>

      <h2 id="upcoming">Upcoming</h2>
      <ul>
        <li>
          Light Protocol on-chain Groth16 verification (drops in without
          SDK changes).
        </li>
        <li>Revocation flow via signed operator messages.</li>
        <li>Ghana Card support (idType = 3).</li>
        <li>Multi-sig EdDSA signing across independent operators.</li>
      </ul>
    </DocPage>
  );
}
