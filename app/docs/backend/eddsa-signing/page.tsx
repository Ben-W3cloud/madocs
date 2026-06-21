import type { Metadata } from "next";
import Callout from "@/components/docs/Callout";
import DocPage from "@/components/docs/DocPage";
import CodeBlock from "@/components/ui/CodeBlock";

export const metadata: Metadata = {
  title: "EdDSA Signing",
  description:
    "How the AfricaZK backend signs credentials with circomlib's EdDSAPoseidon, and how to manage the signing key.",
};

const SIGN_CODE = `import { eddsa, poseidon } from 'circomlibjs'
import { readFileSync } from 'node:fs'

const privateKey = Buffer.from(process.env.AFRICAZK_PRIVATE_KEY!, 'hex')

export async function signCredential({
  idHash,
  age,
  idType,
}: {
  idHash: bigint
  age: bigint
  idType: bigint
}) {
  const F = eddsa.babyJub.F
  const credentialHash = poseidon([idHash, age, idType])
  const sig = eddsa.signPoseidon(privateKey, credentialHash)

  const pub = eddsa.prv2pub(privateKey)

  return {
    idHash: F.toObject(idHash).toString(),
    age: Number(age),
    idType: Number(idType),
    signature: {
      R8: [F.toObject(sig.R8[0]).toString(), F.toObject(sig.R8[1]).toString()],
      S: sig.S.toString(),
    },
    Ax: F.toObject(pub[0]).toString(),
    Ay: F.toObject(pub[1]).toString(),
  }
}`;

const KEYGEN_CODE = `import { randomBytes } from 'node:crypto'

const sk = randomBytes(32)
console.log('AFRICAZK_PRIVATE_KEY=' + sk.toString('hex'))

// Store the resulting hex in your deployment secret store.
// Generate the matching public key once with circomlib and bake it into
// both the circuit and the Anchor program.`;

export default function Page() {
  return (
    <DocPage
      eyebrow="Backend Reference"
      title="EdDSA Signing"
      href="/docs/backend/eddsa-signing"
      intro={
        <>
          AfricaZK&apos;s backend signs every credential with an EdDSA
          private key. The circuit verifies this signature in zero
          knowledge, and the Anchor program checks that the public key
          embedded in the proof matches the one stored on-chain. This page
          covers how the signing works and how to manage the key.
        </>
      }
    >
      <h2 id="why-eddsa">Why EdDSA</h2>
      <p>
        AfricaZK uses{" "}
        <span className="azk-inline-code">EdDSAPoseidon</span> from
        circomlib. Verifying an EdDSA signature inside a Circom circuit is
        cheap (≈ 1.2k constraints) compared to ECDSA (≈ 20k+ constraints),
        so the resulting proof is small and fast. Poseidon hashing
        complements it — both primitives are designed for SNARK efficiency.
      </p>

      <h2 id="signing-code">Signing a credential</h2>
      <CodeBlock code={SIGN_CODE} lang="ts" filename="backend/sign.ts" />
      <p>
        The signed payload mirrors the{" "}
        <a href="/docs/sdk/types">SignedCredential type</a>. Every value is a
        big-integer string so it round-trips through JSON without precision
        loss.
      </p>

      <h2 id="key-management">Key management</h2>
      <Callout kind="danger" title="The signing key is the trust root">
        Anyone who holds{" "}
        <span className="azk-inline-code">AFRICAZK_PRIVATE_KEY</span> can
        sign credentials that the circuit and Anchor program will accept.
        Treat it like a CA root.
      </Callout>
      <ul>
        <li>Store it only in a hardened secret manager (Railway secrets, AWS KMS, Doppler).</li>
        <li>Rotate by deploying a new key and adding it to the program&apos;s allowlist; deprecate the old key on a sunset schedule.</li>
        <li>Never log it. Never commit it. Never let it touch a build artefact.</li>
      </ul>

      <h2 id="key-generation">Generating a new key</h2>
      <CodeBlock code={KEYGEN_CODE} lang="ts" filename="scripts/gen-key.ts" />

      <h2 id="public-key-binding">Public key binding</h2>
      <p>
        The public key has two bindings:
      </p>
      <ol>
        <li>
          <strong>Inside the circuit</strong> — Ax and Ay are passed as
          public inputs and the EdDSA verifier component checks the
          signature against them. If a user submits a credential signed by a
          different key, the proof fails.
        </li>
        <li>
          <strong>Inside the Anchor program</strong> — the program stores
          the canonical Ax/Ay and rejects any submission where the proof&apos;s
          public signals don&apos;t match. This prevents a maliciously
          tampered SDK from rolling its own circuit with a different key.
        </li>
      </ol>

      <h2 id="see-also">See also</h2>
      <ul>
        <li>
          <a href="/docs/core-concepts/the-circuit">The Circuit</a>
        </li>
        <li>
          <a href="/docs/backend/environment-variables">Environment Variables</a>
        </li>
      </ul>
    </DocPage>
  );
}
