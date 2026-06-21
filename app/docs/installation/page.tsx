import type { Metadata } from "next";
import Callout from "@/components/docs/Callout";
import DocPage from "@/components/docs/DocPage";
import { SimpleTable } from "@/components/docs/ParamsTable";
import CodeBlock from "@/components/ui/CodeBlock";

export const metadata: Metadata = {
  title: "Installation",
  description:
    "Install @africazk/identity, configure peer dependencies, and serve the ZK circuit WASM bundle.",
};

const INSTALL = `npm install @africazk/identity
# or
pnpm add @africazk/identity
# or
yarn add @africazk/identity`;

const PEER_DEPS = `npm install \\
  @solana/web3.js \\
  @solana/wallet-adapter-react \\
  @solana/wallet-adapter-react-ui`;

const NEXT_CONFIG = `import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      // Allow snarkjs to resolve in the browser without polyfills
      'node:fs': { browser: './lib/empty.ts' },
      'node:path': { browser: './lib/empty.ts' },
    },
  },
  webpack: (config) => {
    config.experiments = { ...config.experiments, asyncWebAssembly: true }
    return config
  },
}

export default nextConfig`;

export default function Page() {
  return (
    <DocPage
      eyebrow="Getting Started"
      title="Installation"
      href="/docs/installation"
      intro={
        <>
          The AfricaZK SDK is distributed as a single npm package. It ships
          with the ZK circuit WASM, the verification key, and TypeScript
          definitions. Everything you need is in{" "}
          <span className="azk-inline-code">@africazk/identity</span>.
        </>
      }
    >
      <h2 id="package">Install the package</h2>
      <CodeBlock code={INSTALL} lang="bash" filename="terminal" />

      <h2 id="peer-dependencies">Peer dependencies</h2>
      <p>
        The SDK does not bundle Solana web3 helpers — you bring your own so
        version mismatches never bite. Install the wallet adapter packages
        you actually use; the React adapter is the most common.
      </p>
      <CodeBlock code={PEER_DEPS} lang="bash" filename="peers" />
      <SimpleTable
        headers={["Package", "Why it's required"]}
        rows={[
          ["@solana/web3.js", "Building & signing transactions"],
          [
            "@solana/wallet-adapter-react",
            "Used by submitProof() to request a signature from the connected wallet",
          ],
          [
            "@solana/wallet-adapter-react-ui",
            "Optional — only if you want the standard connect-wallet UI",
          ],
        ]}
      />

      <h2 id="requirements">Runtime requirements</h2>
      <ul>
        <li>Node 20.9 or later for build tooling</li>
        <li>
          A modern evergreen browser with WebAssembly support (Chrome 111+,
          Firefox 111+, Safari 16.4+)
        </li>
        <li>
          A Solana wallet — Phantom, Backpack, Solflare, or any
          wallet-adapter compatible provider
        </li>
      </ul>

      <h2 id="bundler-notes">Bundler notes</h2>
      <p>
        The SDK loads <span className="azk-inline-code">africazk.wasm</span>{" "}
        from the package itself via{" "}
        <span className="azk-inline-code">new URL(&apos;./africazk.wasm&apos;, import.meta.url)</span>.
        Most modern bundlers (Turbopack, Vite, Webpack 5) handle this out of
        the box. For Next.js 16 the default Turbopack pipeline works without
        any configuration.
      </p>
      <Callout kind="warning" title="Custom Webpack setups">
        If you eject from Turbopack and use a custom Webpack config, enable
        async WebAssembly experiments. snarkjs also references some Node
        builtins from older builds; alias them to an empty module for the
        browser bundle.
      </Callout>
      <CodeBlock
        code={NEXT_CONFIG}
        lang="ts"
        filename="next.config.ts (only if customizing)"
      />

      <h2 id="verify-install">Verify the install</h2>
      <p>
        With the package installed, the imports below should resolve and
        autocomplete:
      </p>
      <CodeBlock
        code={`import {
  verifyIdentity,
  generateProof,
  submitProof,
  checkAttestation,
  wipeCredential,
} from '@africazk/identity'`}
        lang="ts"
        filename="sanity-check.ts"
      />
      <p>
        Continue with{" "}
        <a href="/docs/your-first-integration">Your First Integration</a> for
        the end-to-end walkthrough.
      </p>
    </DocPage>
  );
}
