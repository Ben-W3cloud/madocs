import type { Metadata } from "next";
import Callout from "@/components/docs/Callout";
import DocPage from "@/components/docs/DocPage";
import FunctionSignature from "@/components/docs/FunctionSignature";
import CodeBlock from "@/components/ui/CodeBlock";

export const metadata: Metadata = {
  title: "checkAttestation()",
  description:
    "Read the on-chain AttestationRecord PDA for a wallet. Returns verified status and timestamp.",
};

const SIG = `checkAttestation(
  walletAddress: string,
  network?: 'devnet' | 'mainnet-beta'
): Promise<AttestationStatus>`;

const STATUS_TYPE = `type AttestationStatus =
  | { verified: false }
  | {
      verified: true
      verifiedAt: number      // unix ms
      protocol: 'AfricaZK-v1'
      attestationPDA: string  // base58 PDA address
    }`;

const HOOK_EXAMPLE = `'use client'

import { useEffect, useState } from 'react'
import { checkAttestation, type AttestationStatus } from '@africazk/identity'

export function useAfricaZKStatus(walletAddress?: string) {
  const [status, setStatus] = useState<AttestationStatus | null>(null)

  useEffect(() => {
    if (!walletAddress) {
      setStatus(null)
      return
    }
    let cancelled = false
    checkAttestation(walletAddress, 'mainnet-beta').then((s) => {
      if (!cancelled) setStatus(s)
    })
    return () => {
      cancelled = true
    }
  }, [walletAddress])

  return status
}`;

export default function Page() {
  return (
    <DocPage
      eyebrow="SDK Reference"
      title="checkAttestation()"
      href="/docs/sdk/check-attestation"
      intro={
        <>
          Read the on-chain AttestationRecord PDA for a wallet. This is the
          one function every dApp calls on every page load. If it returns
          <span className="azk-inline-code">verified: true</span>, your user
          is a verified Nigerian adult and you have done zero KYC.
        </>
      }
    >
      <h2 id="signature">Signature</h2>
      <FunctionSignature code={SIG} />

      <h2 id="what-it-does">What this function does</h2>
      <ol>
        <li>
          Derives the AttestationRecord PDA from{" "}
          <span className="azk-inline-code">walletAddress</span>. Seeds:{" "}
          <span className="azk-inline-code">
            [&quot;africazk-attestation&quot;, wallet_pubkey]
          </span>
          .
        </li>
        <li>Reads the account from the chosen Solana network.</li>
        <li>
          If the account does not exist: returns{" "}
          <span className="azk-inline-code">{`{ verified: false }`}</span>.
        </li>
        <li>
          If the account exists: deserialises{" "}
          <span className="azk-inline-code">verified</span>,{" "}
          <span className="azk-inline-code">timestamp</span>, and{" "}
          <span className="azk-inline-code">revoked</span> fields.
        </li>
        <li>
          If <span className="azk-inline-code">revoked</span> is true:
          returns{" "}
          <span className="azk-inline-code">{`{ verified: false }`}</span>.
        </li>
        <li>
          Otherwise: returns the verified status with timestamp and protocol
          version.
        </li>
      </ol>

      <h2 id="returns">Returns</h2>
      <CodeBlock code={STATUS_TYPE} lang="ts" filename="AttestationStatus" />

      <h2 id="when-to-call">When to call this</h2>
      <ul>
        <li>On every page load after the wallet connects.</li>
        <li>Before rendering any identity-gated feature.</li>
        <li>
          After <span className="azk-inline-code">submitProof()</span> completes
          to confirm the attestation exists on-chain.
        </li>
      </ul>

      <Callout kind="warning" title="Cache the result">
        <span className="azk-inline-code">checkAttestation()</span> makes one
        RPC call to Solana. Cache the result for the duration of the session
        — by user pubkey — and do not call it on every render. Re-check only
        on wallet change, on a manual refresh action, or after a successful{" "}
        <span className="azk-inline-code">submitProof()</span>.
      </Callout>

      <h2 id="example">Example — a React hook</h2>
      <CodeBlock code={HOOK_EXAMPLE} lang="tsx" filename="useAfricaZKStatus.ts" />

      <h2 id="server-side">Server-side usage</h2>
      <p>
        <span className="azk-inline-code">checkAttestation()</span> works in
        any environment with{" "}
        <span className="azk-inline-code">fetch</span> and{" "}
        <span className="azk-inline-code">@solana/web3.js</span> available —
        including Next.js Route Handlers and Edge runtimes. Use it
        server-side to gate sensitive operations, but remember the
        attestation only proves the wallet is verified, not that the request
        comes from that wallet. Combine with a signed message.
      </p>

      <h2 id="errors">Errors</h2>
      <p>
        This function only throws on RPC failures (network down, invalid
        endpoint). It does <em>not</em> throw on{" "}
        <span className="azk-inline-code">verified: false</span> — that is a
        normal result for unverified wallets.
      </p>

      <h2 id="see-also">See also</h2>
      <ul>
        <li>
          <a href="/docs/core-concepts/attestation-record">AttestationRecord</a>{" "}
          — exact field layout.
        </li>
        <li>
          <a href="/docs/reference/pda-seeds">PDA seeds reference</a>.
        </li>
      </ul>
    </DocPage>
  );
}
