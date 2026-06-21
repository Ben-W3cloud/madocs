import type { Metadata } from "next";
import Callout from "@/components/docs/Callout";
import DocPage from "@/components/docs/DocPage";
import CodeBlock from "@/components/ui/CodeBlock";

export const metadata: Metadata = {
  title: "Integrating with React",
  description:
    "Integrate AfricaZK into a plain React app (Vite or CRA) without Next.js-specific features.",
};

const SETUP = `npm install \\
  @africazk/identity \\
  @solana/wallet-adapter-react \\
  @solana/wallet-adapter-react-ui \\
  @solana/wallet-adapter-wallets \\
  @solana/web3.js`;

const APP = `import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import '@solana/wallet-adapter-react-ui/styles.css'
import { useMemo } from 'react'
import { VerifyView } from './VerifyView'

const RPC = 'https://api.mainnet-beta.solana.com'

export default function App() {
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [])
  return (
    <ConnectionProvider endpoint={RPC}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <VerifyView />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}`;

const VIEW = `import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import {
  checkAttestation,
  verifyIdentity,
  generateProof,
  submitProof,
  type AttestationStatus,
} from '@africazk/identity'

export function VerifyView() {
  const wallet = useWallet()
  const [status, setStatus] = useState<AttestationStatus | null>(null)
  const [nin, setNin] = useState('')
  const [dob, setDob] = useState('')
  const [pending, setPending] = useState(false)

  useEffect(() => {
    if (!wallet.publicKey) return
    checkAttestation(wallet.publicKey.toString(), 'mainnet-beta').then(setStatus)
  }, [wallet.publicKey])

  if (status?.verified) return <p>Verified ✓</p>

  return (
    <div>
      <WalletMultiButton />
      {wallet.publicKey && (
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            setPending(true)
            const cred = await verifyIdentity({ idType: 'NIN', idNumber: nin, dob })
            const proof = await generateProof(cred)
            await submitProof(proof, wallet, 'mainnet-beta')
            const fresh = await checkAttestation(
              wallet.publicKey!.toString(),
              'mainnet-beta'
            )
            setStatus(fresh)
            setPending(false)
          }}
        >
          <input value={nin} onChange={(e) => setNin(e.target.value)} placeholder="NIN" />
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
          <button type="submit" disabled={pending}>Verify</button>
        </form>
      )}
    </div>
  )
}`;

export default function Page() {
  return (
    <DocPage
      eyebrow="Guides"
      title="Integrating with React"
      href="/docs/guides/react"
      intro={
        <>
          AfricaZK&apos;s SDK is framework-agnostic — works in any modern
          React app. This guide covers Vite-based setups; Create React App
          works identically.
        </>
      }
    >
      <h2 id="install">1. Install</h2>
      <CodeBlock code={SETUP} lang="bash" filename="terminal" />

      <h2 id="app">2. Mount the providers</h2>
      <CodeBlock code={APP} lang="tsx" filename="src/App.tsx" />

      <h2 id="view">3. Build the verify view</h2>
      <CodeBlock code={VIEW} lang="tsx" filename="src/VerifyView.tsx" />

      <Callout kind="info" title="No SSR, no problem">
        Everything in this guide is client-only. The SDK does not need any
        server-side setup — the AfricaZK backend is hosted, and the on-chain
        program is read directly via your chosen RPC.
      </Callout>

      <h2 id="bundlers">Bundler notes</h2>
      <ul>
        <li>
          <strong>Vite</strong> — works out of the box. The SDK ships
          modern ESM and the WASM is loaded via{" "}
          <span className="azk-inline-code">new URL(..., import.meta.url)</span>
          .
        </li>
        <li>
          <strong>CRA</strong> — needs a small Webpack override to enable
          async WebAssembly. Use{" "}
          <span className="azk-inline-code">craco</span> with{" "}
          <span className="azk-inline-code">experiments.asyncWebAssembly = true</span>
          .
        </li>
        <li>
          <strong>RSpack / Rsbuild</strong> — works out of the box.
        </li>
      </ul>
    </DocPage>
  );
}
