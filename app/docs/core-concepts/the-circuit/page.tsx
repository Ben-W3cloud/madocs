import type { Metadata } from "next";
import Callout from "@/components/docs/Callout";
import DocPage from "@/components/docs/DocPage";
import { SimpleTable } from "@/components/docs/ParamsTable";
import CodeBlock from "@/components/ui/CodeBlock";

export const metadata: Metadata = {
  title: "The Circuit",
  description:
    "The AfricaZK Circom circuit — inputs, outputs, constraints, and signal flow.",
};

const CIRCUIT_CODE = `pragma circom 2.0.0;

include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/eddsaposeidon.circom";
include "circomlib/circuits/comparators.circom";

template AfricaZKIdentity() {
    // ── Private inputs ─────────────────────────────────────
    signal input idHash;
    signal input age;
    signal input idType;
    signal input sigR8x;
    signal input sigR8y;
    signal input sigS;
    signal input Ax;
    signal input Ay;

    // ── Public outputs ─────────────────────────────────────
    signal output nullifier;
    signal output valid;

    // 1. Reconstruct the credential hash that the backend signed
    component credHash = Poseidon(3);
    credHash.inputs[0] <== idHash;
    credHash.inputs[1] <== age;
    credHash.inputs[2] <== idType;

    // 2. Verify the EdDSA signature
    component sigCheck = EdDSAPoseidonVerifier();
    sigCheck.enabled <== 1;
    sigCheck.Ax <== Ax;
    sigCheck.Ay <== Ay;
    sigCheck.R8x <== sigR8x;
    sigCheck.R8y <== sigR8y;
    sigCheck.S <== sigS;
    sigCheck.M <== credHash.out;

    // 3. Age check — age >= 18
    component ageGte = GreaterEqThan(8);
    ageGte.in[0] <== age;
    ageGte.in[1] <== 18;

    // 4. idType check — idType ∈ {1, 2}
    component idIsNin = IsEqual();
    idIsNin.in[0] <== idType;
    idIsNin.in[1] <== 1;
    component idIsBvn = IsEqual();
    idIsBvn.in[0] <== idType;
    idIsBvn.in[1] <== 2;
    signal idTypeOk;
    idTypeOk <== idIsNin.out + idIsBvn.out;

    // 5. valid = (age >= 18) AND (idType is valid)
    valid <== ageGte.out * idTypeOk;

    // 6. nullifier = Poseidon(idHash) — unlinkable to the underlying ID
    component nullHash = Poseidon(1);
    nullHash.inputs[0] <== idHash;
    nullifier <== nullHash.out;
}

component main { public [Ax, Ay] } = AfricaZKIdentity();`;

export default function Page() {
  return (
    <DocPage
      eyebrow="Core Concepts"
      title="The Circuit"
      href="/docs/core-concepts/the-circuit"
      intro={
        <>
          The AfricaZK circuit lives in a single Circom file. It checks an
          EdDSA signature, enforces age ≥ 18, validates the ID type, and
          emits a nullifier. Total constraint count: roughly 6.8k.
        </>
      }
    >
      <h2 id="overview">Overview</h2>
      <SimpleTable
        headers={["Property", "Value"]}
        rows={[
          ["Framework", "Circom 2.0"],
          ["Proving scheme", "Groth16"],
          ["Hash", "Poseidon"],
          ["Signature scheme", "EdDSA (circomlib EdDSAPoseidon)"],
          ["Constraints", "~6,800"],
          ["WASM file size", "≈ 240 KB"],
          ["Verification key size", "≈ 2 KB"],
        ]}
      />

      <h2 id="signals">Inputs and outputs</h2>
      <SimpleTable
        headers={["Kind", "Name", "Description"]}
        rows={[
          ["Private", "idHash", "Poseidon(idNumber) from the backend"],
          ["Private", "age", "Years computed from dob"],
          ["Private", "idType", "1 = NIN, 2 = BVN"],
          ["Private", "sigR8x / sigR8y / sigS", "EdDSA signature components"],
          ["Public", "Ax / Ay", "AfricaZK public key (verifier checks match)"],
          ["Public output", "valid", "1 if all checks pass"],
          ["Public output", "nullifier", "Poseidon(idHash)"],
        ]}
      />

      <h2 id="source">The full circuit</h2>
      <CodeBlock code={CIRCUIT_CODE} lang="ts" filename="africazk.circom" />

      <h2 id="what-it-proves">What the circuit proves</h2>
      <ol>
        <li>
          The prover holds a credential signed by the AfricaZK private key
          corresponding to the public Ax/Ay.
        </li>
        <li>That credential describes a person who is at least 18.</li>
        <li>That credential describes a valid Nigerian ID type.</li>
        <li>
          The nullifier emitted is the deterministic Poseidon hash of the
          underlying idHash — same identity always produces the same
          nullifier, but the original idHash cannot be recovered.
        </li>
      </ol>

      <Callout kind="info" title="What the circuit does NOT prove">
        It does not prove the credential is recent. It does not prove the
        user is the original credential holder — that protection comes from
        the EdDSA signature being scoped to a single in-memory session, plus
        the on-chain nullifier guard. It does not prove anything about who
        the user is beyond the three statements above.
      </Callout>

      <h2 id="trusted-setup">Trusted setup</h2>
      <p>
        Groth16 requires a per-circuit trusted setup. AfricaZK ran a
        multi-party ceremony using the Powers of Tau contribution from
        Filecoin (phase 1) plus a phase-2 contribution from three
        independent participants. As long as one of them was honest, the
        toxic waste is destroyed and the resulting{" "}
        <span className="azk-inline-code">.zkey</span> is safe.
      </p>
    </DocPage>
  );
}
