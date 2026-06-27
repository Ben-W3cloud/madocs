import type { Metadata } from "next";
import Callout from "@/components/docs/Callout";
import DocPage from "@/components/docs/DocPage";

export const metadata: Metadata = {
  title: "Introduction",
  description:
    "AfricaZK is a Zero-Knowledge identity protocol for Solana — verify Nigerian users without storing personal data.",
};

export default function Page() {
  return (
    <DocPage
      eyebrow="Getting Started"
      title="Introduction to AfricaZK"
      href="/docs/introduction"
      intro={
        <>
          AfricaZK is a Zero-Knowledge identity protocol for Solana. It allows
          any Solana application to verify that a user is a real, verified
          Nigerian adult - without ever collecting, storing, or processing
          their personal data.
        </>
      }
    >
      <h2 id="why-africazk">Why AfricaZK exists</h2>
      <p>
        Every Nigerian dApp that needs to know its users are real adults runs
        into the same wall: it has to collect NIN or BVN, store it, and assume
        the liability of protecting it. That liability is enormous and it
        compounds across the ecosystem — every new dApp re-asks the same
        question, holds the same data, and adds another breach surface.
      </p>
      <p>
        AfricaZK replaces all of that with a single primitive: a wallet that
        either holds a valid <span className="azk-inline-code">AttestationRecord</span>{" "}
        or doesn&apos;t. The proof is mathematical, on-chain, and reusable.
        Personal data never leaves the user&apos;s device.
      </p>

      <h2 id="who-is-this-for">Who is this for</h2>
      <div className="my-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border/50 bg-bg-card p-5">
          <p className="text-[13px] font-semibold uppercase tracking-widest text-green">
            For dApp Developers
          </p>
          <p className="mt-3 text-[14.5px] leading-[1.7] text-text-secondary">
            You want to verify your users are real Nigerians without dealing
            with KYC compliance, data storage liability, or building a
            verification pipeline from scratch.
          </p>
        </div>
        <div className="rounded-lg border border-border/50 bg-bg-card p-5">
          <p className="text-[13px] font-semibold uppercase tracking-widest text-purple">
            For Protocol Builders
          </p>
          <p className="mt-3 text-[14.5px] leading-[1.7] text-text-secondary">
            You want to compose AfricaZK with other Solana programs to build
            identity-gated DeFi, governance, or social infrastructure.
          </p>
        </div>
      </div>

      <h2 id="what-it-is-not">What AfricaZK is not</h2>
      <Callout kind="info" title="AfricaZK is infrastructure — like a road, not a car.">
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>AfricaZK is not a marketplace.</li>
          <li>AfricaZK is not a user database.</li>
          <li>AfricaZK does not know who your users are.</li>
          <li>AfricaZK never holds, sees, or stores personal data.</li>
        </ul>
      </Callout>

      <h2 id="how-it-fits-together">How it fits together</h2>
      <p>
        AfricaZK has three pieces working in concert: a small SDK
        (<span className="azk-inline-code">@africazk/identity</span>) that runs
        in the user&apos;s browser, an EdDSA-signing backend that confirms IDs
        through Dojah, and an Anchor program on Solana that verifies proofs
        and writes attestations.
      </p>
      <p>
        As an integrator you only ever touch the SDK. The backend and the
        on-chain program are run by AfricaZK; you read the attestation that
        ends up on the user&apos;s wallet.
      </p>

      <h2 id="next-steps">Next steps</h2>
      <p>
        Read the <a href="/docs/quick-start">Quick Start</a> to install the
        SDK and gate your first feature in less than ten minutes, or jump to{" "}
        <a href="/docs/core-concepts/how-it-works">How AfricaZK Works</a> for
        the full protocol walkthrough.
      </p>
    </DocPage>
  );
}
