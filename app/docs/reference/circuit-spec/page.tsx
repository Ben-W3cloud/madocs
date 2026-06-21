import type { Metadata } from "next";
import DocPage from "@/components/docs/DocPage";
import { SimpleTable } from "@/components/docs/ParamsTable";

export const metadata: Metadata = {
  title: "Circuit Specification",
  description:
    "Full technical specification for the AfricaZK Groth16 circuit.",
};

export default function Page() {
  return (
    <DocPage
      eyebrow="Reference"
      title="Circuit Specification"
      href="/docs/reference/circuit-spec"
      intro={
        <>
          The complete machine-readable specification of the AfricaZK
          circuit. For the annotated walkthrough see{" "}
          <a href="/docs/core-concepts/the-circuit">The Circuit</a>; this
          page is the reference card.
        </>
      }
    >
      <h2 id="meta">Metadata</h2>
      <SimpleTable
        headers={["Property", "Value"]}
        rows={[
          ["Circuit name", "AfricaZKIdentity"],
          ["Source file", "circuits/africazk.circom"],
          ["Framework", "Circom 2.0.7"],
          ["Proving scheme", "Groth16"],
          ["Curve", "bn128"],
          ["Hash function", "Poseidon (circomlib v2)"],
          ["Signature scheme", "EdDSA — EdDSAPoseidonVerifier"],
          ["Field size", "254 bits"],
          ["Constraints (R1CS)", "6,824"],
          ["Witnesses", "12,931"],
          ["Public inputs", "Ax, Ay"],
          ["Public outputs", "valid, nullifier"],
          ["Private inputs", "idHash, age, idType, sigR8x, sigR8y, sigS"],
          ["WASM size", "≈ 240 KB"],
          ["zkey size", "≈ 3.1 MB"],
          ["Verification key size", "≈ 2 KB"],
        ]}
      />

      <h2 id="public-inputs">Public input layout</h2>
      <SimpleTable
        headers={["Index", "Name", "Type"]}
        rows={[
          ["0", "Ax", "Field element (AfricaZK public key x)"],
          ["1", "Ay", "Field element (AfricaZK public key y)"],
        ]}
      />

      <h2 id="public-outputs">Public output layout</h2>
      <SimpleTable
        headers={["Index", "Name", "Type", "Domain"]}
        rows={[
          ["0", "valid", "Field element", "{0, 1}"],
          ["1", "nullifier", "Field element", "Poseidon(idHash)"],
        ]}
      />

      <h2 id="constraints">Constraint composition</h2>
      <SimpleTable
        headers={["Component", "Purpose", "Constraints"]}
        rows={[
          ["Poseidon(3)", "Reconstruct credentialHash from (idHash, age, idType)", "~250"],
          ["EdDSAPoseidonVerifier", "Verify signature(credentialHash, Ax, Ay)", "~5,800"],
          ["GreaterEqThan(8)", "age >= 18", "~50"],
          ["IsEqual ×2", "idType ∈ {1, 2}", "~40"],
          ["AND product", "valid = (age>=18) * (idType ok)", "~5"],
          ["Poseidon(1)", "nullifier = Poseidon(idHash)", "~210"],
          ["Glue + boundary", "Signal wiring + main template", "~450"],
        ]}
      />

      <h2 id="performance">Performance characteristics</h2>
      <SimpleTable
        headers={["Operation", "Approximate time (M1 Pro)"]}
        rows={[
          ["Witness generation", "350 – 450 ms"],
          ["Proof generation", "1.6 – 2.1 s"],
          ["Local verification", "8 – 12 ms"],
          ["Cold WASM load", "60 – 120 ms"],
        ]}
      />

      <h2 id="auditability">Auditability</h2>
      <p>
        The circuit source, WASM, and zkey are reproducible from the source
        repository. SHA-256 hashes of the released artefacts are published
        in each release&apos;s changelog and signed by the AfricaZK release
        key.
      </p>
    </DocPage>
  );
}
