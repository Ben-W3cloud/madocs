import type { Metadata } from "next";
import DocPage from "@/components/docs/DocPage";
import { SimpleTable } from "@/components/docs/ParamsTable";
import CodeBlock from "@/components/ui/CodeBlock";

export const metadata: Metadata = {
  title: "Handling Verification States",
  description:
    "A clean state machine for the AfricaZK verification flow — checking, verifying, proving, submitting, done.",
};

const REDUCER = `type Phase =
  | { kind: 'idle' }
  | { kind: 'checking' }
  | { kind: 'unverified' }
  | { kind: 'verifying' }              // talking to backend
  | { kind: 'proving'; percent: number } // running circuit in browser
  | { kind: 'submitting'; tx: string }   // user signing
  | { kind: 'done'; verifiedAt: number }
  | { kind: 'error'; message: string }

type Action =
  | { type: 'CHECK_START' }
  | { type: 'CHECK_RESULT'; verified: boolean; verifiedAt?: number }
  | { type: 'VERIFY_START' }
  | { type: 'PROVE_START' }
  | { type: 'PROVE_PROGRESS'; percent: number }
  | { type: 'SUBMIT_START'; tx: string }
  | { type: 'SUCCESS'; verifiedAt: number }
  | { type: 'FAIL'; message: string }
  | { type: 'RESET' }

export function reducer(state: Phase, action: Action): Phase {
  switch (action.type) {
    case 'CHECK_START':
      return { kind: 'checking' }
    case 'CHECK_RESULT':
      return action.verified
        ? { kind: 'done', verifiedAt: action.verifiedAt! }
        : { kind: 'unverified' }
    case 'VERIFY_START':
      return { kind: 'verifying' }
    case 'PROVE_START':
      return { kind: 'proving', percent: 0 }
    case 'PROVE_PROGRESS':
      return { kind: 'proving', percent: action.percent }
    case 'SUBMIT_START':
      return { kind: 'submitting', tx: action.tx }
    case 'SUCCESS':
      return { kind: 'done', verifiedAt: action.verifiedAt }
    case 'FAIL':
      return { kind: 'error', message: action.message }
    case 'RESET':
      return { kind: 'idle' }
  }
}`;

const FLOW = `function VerifyFlow() {
  const [state, dispatch] = useReducer(reducer, { kind: 'idle' })
  const wallet = useWallet()

  async function run(nin: string, dob: string) {
    try {
      dispatch({ type: 'VERIFY_START' })
      const cred = await verifyIdentity({ idType: 'NIN', idNumber: nin, dob })

      dispatch({ type: 'PROVE_START' })
      const proof = await generateProof(cred)

      dispatch({ type: 'SUBMIT_START', tx: 'pending' })
      const result = await submitProof(proof, wallet, 'mainnet-beta')

      dispatch({ type: 'SUCCESS', verifiedAt: Date.now() })
      return result
    } catch (e) {
      dispatch({ type: 'FAIL', message: (e as Error).message })
    }
  }

  return <FlowUI state={state} onRun={run} onReset={() => dispatch({ type: 'RESET' })} />
}`;

export default function Page() {
  return (
    <DocPage
      eyebrow="Guides"
      title="Handling Verification States"
      href="/docs/guides/verification-states"
      intro={
        <>
          The verification flow has six distinct UX-relevant states. A
          discriminated union keeps your UI honest — every state has its own
          rendering and there are no impossible combinations.
        </>
      }
    >
      <h2 id="the-states">The six states</h2>
      <SimpleTable
        headers={["Phase", "User-visible message", "Typical duration"]}
        rows={[
          ["idle", "No active flow — show the entry CTA", "—"],
          ["checking", "Reading on-chain attestation", "200–800 ms"],
          ["unverified", "Show the verify form", "—"],
          ["verifying", "Confirming your ID with Dojah", "1–3 s"],
          ["proving", "Generating proof in your browser", "3–8 s"],
          ["submitting", "Sign with your wallet", "user-paced"],
          ["done", "Verified ✓", "—"],
          ["error", "Show error + reset CTA", "—"],
        ]}
      />

      <h2 id="reducer">Reducer</h2>
      <CodeBlock code={REDUCER} lang="ts" filename="verify-reducer.ts" />

      <h2 id="flow">Wiring it to the SDK</h2>
      <CodeBlock code={FLOW} lang="tsx" filename="VerifyFlow.tsx" />

      <h2 id="ux-tips">UX tips</h2>
      <ul>
        <li>
          The <strong>proving</strong> state lasts longer than people
          expect. Show a progress bar with a reassuring sub-message
          (&quot;running zero-knowledge circuit — this runs on your device,
          your NIN never left&quot;).
        </li>
        <li>
          The <strong>submitting</strong> state is paced by the user&apos;s
          wallet popup — don&apos;t auto-dismiss. Show the wallet they need
          to click.
        </li>
        <li>
          On <strong>error</strong>, always offer a clear retry path. Most
          errors are recoverable (network blip, user rejected) — the only
          unrecoverable one is <span className="azk-inline-code">DUPLICATE_NULLIFIER</span>.
        </li>
        <li>
          On <strong>done</strong>, navigate the user where they were trying
          to go. Don&apos;t make them re-click after success.
        </li>
      </ul>
    </DocPage>
  );
}
