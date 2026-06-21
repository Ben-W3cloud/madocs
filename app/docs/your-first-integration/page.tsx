import type { Metadata } from "next";
import Callout from "@/components/docs/Callout";
import DocPage from "@/components/docs/DocPage";
import CodeBlock from "@/components/ui/CodeBlock";

export const metadata: Metadata = {
  title: "Your First Integration",
  description:
    "Build a complete verified-only feature with AfricaZK: wallet connection, verification flow, gated content.",
};

const PROVIDER_CODE = `'use client'

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { PhantomWalletAdapter, BackpackWalletAdapter } from '@solana/wallet-adapter-wallets'
import { useMemo } from 'react'

const NETWORK = 'mainnet-beta'
const RPC = 'https://api.mainnet-beta.solana.com'

export default function Providers({ children }: { children: React.ReactNode }) {
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new BackpackWalletAdapter()],
    []
  )

  return (
    <ConnectionProvider endpoint={RPC}>
      <WalletProvider wallets={wallets} autoConnect>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  )
}`;

const HOOK_CODE = `'use client'

import { useCallback, useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import {
  checkAttestation,
  verifyIdentity,
  generateProof,
  submitProof,
  type AttestationStatus,
} from '@africazk/identity'

type Phase = 'idle' | 'checking' | 'verifying' | 'proving' | 'submitting' | 'done' | 'error'

export function useAfricaZK() {
  const wallet = useWallet()
  const [phase, setPhase] = useState<Phase>('idle')
  const [status, setStatus] = useState<AttestationStatus | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Auto-check whenever the wallet changes
  useEffect(() => {
    const pk = wallet.publicKey
    if (!pk) {
      setStatus(null)
      setPhase('idle')
      return
    }
    setPhase('checking')
    checkAttestation(pk.toString(), 'mainnet-beta')
      .then((s) => {
        setStatus(s)
        setPhase(s.verified ? 'done' : 'idle')
      })
      .catch((e) => {
        setError(e.message)
        setPhase('error')
      })
  }, [wallet.publicKey])

  const verify = useCallback(
    async (nin: string, dob: string) => {
      try {
        setError(null)
        setPhase('verifying')
        const credential = await verifyIdentity({ idType: 'NIN', idNumber: nin, dob })
        setPhase('proving')
        const proof = await generateProof(credential)
        setPhase('submitting')
        const result = await submitProof(proof, wallet, 'mainnet-beta')
        setStatus({ verified: true, verifiedAt: Date.now(), protocol: 'AfricaZK-v1' })
        setPhase('done')
        return result
      } catch (e: any) {
        setError(e.message)
        setPhase('error')
        throw e
      }
    },
    [wallet]
  )

  return { phase, status, error, verify, wallet }
}`;

const PAGE_CODE = `'use client'

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useState } from 'react'
import { useAfricaZK } from './useAfricaZK'

export default function VerifyPage() {
  const { phase, status, error, verify, wallet } = useAfricaZK()
  const [nin, setNin] = useState('')
  const [dob, setDob] = useState('')

  if (status?.verified) {
    return <p>You are verified ✓ — head to your dashboard.</p>
  }

  return (
    <main>
      <h1>Verify with AfricaZK</h1>
      <WalletMultiButton />

      {wallet.publicKey && phase !== 'done' && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            verify(nin, dob)
          }}
        >
          <input
            value={nin}
            onChange={(e) => setNin(e.target.value)}
            placeholder="NIN (11 digits)"
            inputMode="numeric"
          />
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
          <button type="submit" disabled={phase !== 'idle'}>
            {phase === 'idle' ? 'Verify' : phase + '...'}
          </button>
        </form>
      )}

      {error && <p role="alert">{error}</p>}
    </main>
  )
}`;

const SERVER_CHECK = `// app/api/protected/route.ts
import { NextResponse } from 'next/server'
import { checkAttestation } from '@africazk/identity'

export async function GET(req: Request) {
  const wallet = req.headers.get('x-wallet')
  if (!wallet) return NextResponse.json({ error: 'no wallet' }, { status: 401 })

  const status = await checkAttestation(wallet, 'mainnet-beta')
  if (!status.verified) {
    return NextResponse.json({ error: 'not verified' }, { status: 403 })
  }

  // proceed — user is a verified Nigerian adult
  return NextResponse.json({ ok: true })
}`;

export default function Page() {
  return (
    <DocPage
      eyebrow="Getting Started"
      title="Your First Integration"
      href="/docs/your-first-integration"
      intro={
        <>
          A complete end-to-end walkthrough. By the end of this page you will
          have a Next.js app that connects a Solana wallet, runs the AfricaZK
          verification flow, and gates a server route on the result.
        </>
      }
    >
      <h2 id="prereqs">Prerequisites</h2>
      <ul>
        <li>A Next.js 14+ project with the App Router</li>
        <li>
          The AfricaZK SDK installed —{" "}
          <a href="/docs/installation">see Installation</a>
        </li>
        <li>A wallet to test with (Phantom on Devnet is easiest)</li>
      </ul>

      <h2 id="providers">1. Wrap your app with WalletProvider</h2>
      <p>
        AfricaZK uses the connected wallet to sign the on-chain proof
        submission. The easiest way is the standard Solana wallet adapter,
        wrapped once at the root.
      </p>
      <CodeBlock code={PROVIDER_CODE} lang="tsx" filename="app/providers.tsx" />
      <p>
        Then import it in your root layout and wrap{" "}
        <span className="azk-inline-code">{`{children}`}</span> with{" "}
        <span className="azk-inline-code">&lt;Providers&gt;</span>.
      </p>

      <h2 id="hook">2. Build a useAfricaZK hook</h2>
      <p>
        Rather than calling the SDK directly from your components, wrap it in
        a small hook that exposes the current phase, the user&apos;s
        attestation status, and a single{" "}
        <span className="azk-inline-code">verify()</span> action.
      </p>
      <CodeBlock code={HOOK_CODE} lang="tsx" filename="app/useAfricaZK.ts" />

      <h2 id="verify-page">3. The verification page</h2>
      <p>
        A minimal verify page using the hook above. Users see the wallet
        connect button until they connect, then a form for NIN + DOB. The
        phase string drives the UI.
      </p>
      <CodeBlock code={PAGE_CODE} lang="tsx" filename="app/verify/page.tsx" />

      <h2 id="server-side">4. Protect API routes server-side</h2>
      <p>
        Client-side gating is fine for UX. For real authorization on
        sensitive endpoints, read the attestation on the server with the
        wallet address the client claims to own.
      </p>
      <CodeBlock code={SERVER_CHECK} lang="ts" filename="app/api/protected/route.ts" />
      <Callout kind="warning" title="Trust the signature, not the header">
        In production, do not trust a wallet address sent in a header alone.
        Have the client sign a message with their wallet and verify the
        signature server-side before calling{" "}
        <span className="azk-inline-code">checkAttestation()</span>. The
        attestation only proves the wallet is verified — you still need to
        prove the request comes from that wallet.
      </Callout>

      <h2 id="next-steps">Next steps</h2>
      <p>
        Read the <a href="/docs/sdk/verify-identity">full SDK reference</a> to
        see every option and error code, or jump to{" "}
        <a href="/docs/guides/verification-states">Handling Verification States</a>{" "}
        for a richer state-machine pattern.
      </p>
    </DocPage>
  );
}
