import type { Metadata } from "next";
import Callout from "@/components/docs/Callout";
import DocPage from "@/components/docs/DocPage";
import FunctionSignature from "@/components/docs/FunctionSignature";
import CodeBlock from "@/components/ui/CodeBlock";

export const metadata: Metadata = {
  title: "wipeCredential()",
  description:
    "Manually overwrite every field of a SignedCredential with zero. Use in error and cleanup paths.",
};

const SIG = `wipeCredential(credential: SignedCredential): void`;

const EXAMPLE = `import {
  verifyIdentity,
  generateProof,
  wipeCredential,
} from '@africazk/identity'

let credential
try {
  credential = await verifyIdentity({ idType: 'NIN', idNumber, dob })
  const proof = await generateProof(credential)
  // generateProof() already wiped it — but we belt-and-braces it below
  return proof
} catch (error) {
  // Make sure the credential is cleaned up even on the error path
  if (credential) wipeCredential(credential)
  throw error
}`;

export default function Page() {
  return (
    <DocPage
      eyebrow="SDK Reference"
      title="wipeCredential()"
      href="/docs/sdk/wipe-credential"
      intro={
        <>
          A defensive primitive that manually overwrites every field of a{" "}
          <span className="azk-inline-code">SignedCredential</span> with
          zero. Use it in error paths and cleanup hooks to make absolutely
          sure no credential lingers in memory.
        </>
      }
    >
      <h2 id="signature">Signature</h2>
      <FunctionSignature code={SIG} />

      <h2 id="when-to-use">When to use it</h2>
      <ul>
        <li>
          You called{" "}
          <span className="azk-inline-code">verifyIdentity()</span> but never
          got to <span className="azk-inline-code">generateProof()</span>{" "}
          (user cancelled, network died, exception thrown).
        </li>
        <li>
          The user navigated away mid-flow and you have a credential held in
          a ref or piece of state.
        </li>
        <li>
          You are running tests and want to confirm the credential is
          neutralised between cases.
        </li>
      </ul>

      <Callout kind="info" title="Already wiped after generateProof()">
        You do <em>not</em> need to call{" "}
        <span className="azk-inline-code">wipeCredential()</span> after a
        successful{" "}
        <span className="azk-inline-code">generateProof()</span>. That
        function already zeroes the credential in place. This is purely a
        defence-in-depth helper.
      </Callout>

      <h2 id="behaviour">Behaviour</h2>
      <ol>
        <li>
          Sets every string field to{" "}
          <span className="azk-inline-code">&apos;0&apos;</span>.
        </li>
        <li>
          Sets every number field to{" "}
          <span className="azk-inline-code">0</span>.
        </li>
        <li>
          Replaces the arrays inside{" "}
          <span className="azk-inline-code">signature.R8</span> with{" "}
          <span className="azk-inline-code">[&apos;0&apos;, &apos;0&apos;]</span>{" "}
          in place.
        </li>
        <li>Synchronous. Returns nothing.</li>
      </ol>

      <h2 id="example">Example — defensive error handling</h2>
      <CodeBlock code={EXAMPLE} lang="ts" filename="defensive-wipe.ts" />

      <h2 id="limitations">Limitations</h2>
      <p>
        JavaScript does not give us hard guarantees about memory residency —
        engines can keep copies in interpreter caches, garbage collection
        runs on its own schedule, and strings are immutable. AfricaZK
        designs its data flow so that personal data is never derivable from
        the credential alone (the NIN is already Poseidon-hashed by the
        backend), but{" "}
        <span className="azk-inline-code">wipeCredential()</span> is a best
        effort, not a cryptographic guarantee.
      </p>
    </DocPage>
  );
}
