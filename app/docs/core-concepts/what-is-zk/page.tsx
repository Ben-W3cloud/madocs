import type { Metadata } from "next";
import Callout from "@/components/docs/Callout";
import DocPage from "@/components/docs/DocPage";

export const metadata: Metadata = {
  title: "What is ZK Identity?",
  description:
    "A practical introduction to Zero-Knowledge proofs and how AfricaZK uses them for identity.",
};

export default function Page() {
  return (
    <DocPage
      eyebrow="Core Concepts"
      title="What is ZK Identity?"
      href="/docs/core-concepts/what-is-zk"
      intro={
        <>
          A zero-knowledge proof is a mathematical construct that lets one
          party convince another that a statement is true without revealing
          why. AfricaZK uses ZK proofs to convince a Solana program that a
          user has a valid Nigerian ID — without showing the program what the
          ID is.
        </>
      }
    >
      <h2 id="intuition">The intuition</h2>
      <p>
        Imagine you want to prove you know the combination to a safe without
        opening the safe in public. A ZK proof is the cryptographic
        equivalent: a tiny artefact that anyone can check, that only someone
        with the secret could have produced, and that reveals nothing about
        the secret itself.
      </p>
      <p>
        For AfricaZK the &quot;secret&quot; is your verified credential —
        signed by AfricaZK, containing your hashed NIN, your age, and your
        ID type. The &quot;public statement&quot; the proof attests to is:
        &quot;I hold a credential signed by AfricaZK, the person it
        describes is at least 18, and it&apos;s a valid Nigerian ID.&quot;
      </p>

      <h2 id="groth16">Why Groth16</h2>
      <p>
        AfricaZK uses the Groth16 proving scheme. It&apos;s the most mature
        zk-SNARK construction in production today — proofs are tiny (under
        200 bytes), verification is fast, and it has been securing billions
        in DeFi since 2017. The trade-off is a per-circuit trusted setup;
        AfricaZK ran a multi-party ceremony at the time of deployment so no
        single participant could compromise the parameters.
      </p>

      <h2 id="poseidon">Why Poseidon</h2>
      <p>
        Hash functions used inside SNARKs need to be{" "}
        <em>arithmetic-friendly</em> — efficient over the prime field the
        circuit operates on. SHA-256 is murder inside a circuit; Poseidon is
        purpose-built for this. AfricaZK uses Poseidon for both the
        idHash computation and as the underlying hash for EdDSA signature
        verification.
      </p>

      <h2 id="what-is-zk-identity">What makes it &quot;ZK identity&quot;</h2>
      <p>
        Two things, together:
      </p>
      <ol>
        <li>
          A trusted source confirms a real-world identity (Dojah for
          AfricaZK).
        </li>
        <li>
          That confirmation is converted into a credential the user holds,
          and a ZK circuit lets the user prove they hold it without ever
          revealing it.
        </li>
      </ol>
      <p>
        The result is identity that is portable, reusable, and
        permissionless to verify — but never collected, stored, or
        re-disclosed.
      </p>

      <Callout kind="success" title="The trust model in one sentence">
        You trust that AfricaZK&apos;s backend signs only real credentials;
        the cryptography handles the rest.
      </Callout>

      <h2 id="further-reading">Further reading</h2>
      <ul>
        <li>
          <a href="/docs/core-concepts/the-circuit">The Circuit</a> — exactly
          which checks the circuit runs.
        </li>
        <li>
          <a href="/docs/security/threat-model">Threat Model</a> — what
          attacks ZK identity does and does not defend against.
        </li>
      </ul>
    </DocPage>
  );
}
