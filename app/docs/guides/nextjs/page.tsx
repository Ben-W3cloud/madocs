import type { Metadata } from "next";
import Callout from "@/components/docs/Callout";
import DocPage from "@/components/docs/DocPage";
import CodeBlock from "@/components/ui/CodeBlock";

export const metadata: Metadata = {
  title: "Integrating with Next.js",
  description:
    "Full Next.js integration walkthrough: WalletProvider, custom hook, gating, server routes.",
};

const PROVIDER = `'use client'

import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { useMemo, type ReactNode } from 'react'
import '@solana/wallet-adapter-react-ui/styles.css'
import {
  WalletModalProvider,
} from '@solana/wallet-adapter-react-ui'

const RPC = process.env.NEXT_PUBLIC_SOLANA_RPC!

export function Providers({ children }: { children: ReactNode }) {
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [])
  return (
    <ConnectionProvider endpoint={RPC}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}`;

const HOOK = `'use client'

import { useCallback, useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import {
  checkAttestation,
  verifyIdentity,
  generateProof,
  submitProof,
  type AttestationStatus,
} from '@africazk/identity'

export function useAfricaZK() {
  const wallet = useWallet()
  const [status, setStatus] = useState<AttestationStatus | null>(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!wallet.publicKey) {
      setStatus(null)
      return
    }
    checkAttestation(wallet.publicKey.toString(), 'mainnet-beta').then(setStatus)
  }, [wallet.publicKey])

  const verify = useCallback(
    async (idType: 'NIN' | 'BVN', idNumber: string, dob: string) => {
      setPending(true)
      setError(null)
      try {
        const cred = await verifyIdentity({ idType, idNumber, dob })
        const proof = await generateProof(cred)
        await submitProof(proof, wallet, 'mainnet-beta')
        const fresh = await checkAttestation(
          wallet.publicKey!.toString(),
          'mainnet-beta'
        )
        setStatus(fresh)
      } catch (e) {
        setError(e as Error)
      } finally {
        setPending(false)
      }
    },
    [wallet]
  )

  return { status, pending, error, verify, wallet }
}`;

const GATE = `'use client'

import { type ReactNode } from 'react'
import Link from 'next/link'
import { useAfricaZK } from '@/hooks/useAfricaZK'

export function VerifiedGate({ children }: { children: ReactNode }) {
  const { status, wallet } = useAfricaZK()

  if (!wallet.publicKey) {
    return <p>Connect your wallet to continue.</p>
  }
  if (status === null) return <p>Checking attestation…</p>
  if (!status.verified) {
    return (
      <Link href="/verify" className="btn-primary">
        Verify with AfricaZK →
      </Link>
    )
  }
  return <>{children}</>
}`;

const SERVER = `// app/api/dashboard/route.ts
import { NextResponse } from 'next/server'
import { checkAttestation } from '@africazk/identity'
import { verifySignature } from '@/lib/verify-signature'

export async function POST(req: Request) {
  const body = await req.json()
  const { wallet, message, signature } = body

  // 1. Confirm the request actually comes from the wallet
  const ok = await verifySignature(wallet, message, signature)
  if (!ok) return NextResponse.json({ error: 'bad sig' }, { status: 401 })

  // 2. Confirm the wallet has a valid attestation
  const attestation = await checkAttestation(wallet, 'mainnet-beta')
  if (!attestation.verified) {
    return NextResponse.json({ error: 'not verified' }, { status: 403 })
  }

  return NextResponse.json({ data: 'top-secret verified-only data' })
}`;

export default function Page() {
  return (
    <DocPage
      eyebrow="Guides"
      title="Integrating with Next.js"
      href="/docs/guides/nextjs"
      intro={
        <>
          A complete end-to-end Next.js (App Router) integration. By the end
          you will have a wallet-connected app with a reusable verification
          hook, a{" "}
          <span className="azk-inline-code">&lt;VerifiedGate /&gt;</span>{" "}
          component, and a server route that gates sensitive data behind
          AfricaZK + wallet signature.
        </>
      }
    >
      <h2 id="setup">1. Project setup</h2>
      <p>
        Start from a Next.js 14+ project with the App Router. Install the
        SDK and wallet adapter packages (see{" "}
        <a href="/docs/installation">Installation</a>).
      </p>

      <h2 id="provider">2. Wrap the app with WalletProvider</h2>
      <CodeBlock code={PROVIDER} lang="tsx" filename="app/providers.tsx" />
      <p>
        Mount <span className="azk-inline-code">&lt;Providers&gt;</span> in
        your root <span className="azk-inline-code">app/layout.tsx</span>{" "}
        around{" "}
        <span className="azk-inline-code">{`{children}`}</span>.
      </p>

      <h2 id="hook">3. The useAfricaZK hook</h2>
      <p>
        Wrap the five SDK calls in one client-side hook so your components
        only see status, pending, and a verify action.
      </p>
      <CodeBlock code={HOOK} lang="tsx" filename="hooks/useAfricaZK.ts" />

      <h2 id="gate">4. The VerifiedGate component</h2>
      <CodeBlock code={GATE} lang="tsx" filename="components/VerifiedGate.tsx" />

      <h2 id="page">5. Build a verification page</h2>
      <p>
        Build a <span className="azk-inline-code">/verify</span> page that
        shows the wallet connect button, then a NIN/BVN form. Call{" "}
        <span className="azk-inline-code">verify()</span> from the hook on
        submit. The hook handles all three SDK calls.
      </p>

      <h2 id="server">6. Protect server routes</h2>
      <Callout kind="warning" title="Always combine attestation + signature server-side">
        An attestation only proves the wallet is verified — not that the
        request comes from that wallet. Require a signed message before
        trusting the wallet identifier in any server-side check.
      </Callout>
      <CodeBlock code={SERVER} lang="ts" filename="app/api/dashboard/route.ts" />

      <h2 id="checklist">Production checklist</h2>
      <ul>
        <li>
          Cache the attestation status per wallet in your app state — don&apos;t
          re-fetch on every render.
        </li>
        <li>Provide clear, copyable error messages on every failure path.</li>
        <li>Show a progress bar during proof generation (3–8 seconds).</li>
        <li>
          Have a self-serve &quot;Re-check status&quot; button — useful when
          the user just submitted a proof on another tab.
        </li>
      </ul>
    </DocPage>
  );
}
