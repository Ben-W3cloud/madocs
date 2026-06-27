import type { Metadata } from "next";
import Callout from "@/components/docs/Callout";
import DocPage from "@/components/docs/DocPage";
import { SimpleTable } from "@/components/docs/ParamsTable";
import CodeBlock from "@/components/ui/CodeBlock";

export const metadata: Metadata = {
  title: "Environment Variables",
  description:
    "Every environment variable required to run the Pridora server, including Dojah and signing key configuration.",
};

const ENV_FILE = `# Dojah credentials
DOJAH_AUTH=
DOJAH_APP_ID=
DOJAH_BASE_URL=https://api.dojah.io

# AfricaZK signing key (32 bytes, hex-encoded)
AFRICAZK_PRIVATE_KEY=

# Solana network — the program enforces same-network public key match
AFRICAZK_NETWORK=mainnet-beta
AFRICAZK_PROGRAM_ID=

# Optional — rate limiting, defaults shown
RATE_LIMIT_PER_HOUR=10
RATE_LIMIT_PER_DAY=60

# Optional — service port
PORT=3001`;

export default function Page() {
  return (
    <DocPage
      eyebrow="Server Reference"
      title="Environment Variables"
      href="/docs/backend/environment-variables"
      intro={
        <>
          Every environment variable the AfricaZK backend reads at startup.
          Drop these into Railway, Fly, AWS Parameter Store, or your secret
          manager of choice. The server refuses to boot if any required
          variable is missing.
        </>
      }
    >
      <h2 id="required">Required</h2>
      <SimpleTable
        headers={["Variable", "Purpose"]}
        rows={[
          ["DOJAH_AUTH", "Bearer token issued by your Dojah account"],
          ["DOJAH_APP_ID", "Dojah application identifier"],
          [
            "AFRICAZK_PRIVATE_KEY",
            "32-byte hex-encoded EdDSA signing key. The corresponding public key must be baked into both the circuit and the Anchor program",
          ],
          [
            "AFRICAZK_PROGRAM_ID",
            "Anchor program ID on the chosen network — used in returned error metadata for debugging",
          ],
        ]}
      />

      <h2 id="optional">Optional</h2>
      <SimpleTable
        headers={["Variable", "Default", "Purpose"]}
        rows={[
          ["DOJAH_BASE_URL", "https://api.dojah.io", "Override for sandbox testing"],
          ["AFRICAZK_NETWORK", "mainnet-beta", "Switch to devnet for testing"],
          ["RATE_LIMIT_PER_HOUR", "10", "Per-IP verification attempts per hour"],
          ["RATE_LIMIT_PER_DAY", "60", "Per-IP verification attempts per day"],
          ["PORT", "3001", "HTTP port to bind"],
        ]}
      />

      <h2 id="dotenv">Example .env file</h2>
      <CodeBlock code={ENV_FILE} lang="bash" filename=".env" />

      <Callout kind="danger" title="Never commit secrets">
        <span className="azk-inline-code">AFRICAZK_PRIVATE_KEY</span>,{" "}
        <span className="azk-inline-code">DOJAH_AUTH</span>, and{" "}
        <span className="azk-inline-code">DOJAH_APP_ID</span> are credentials.
        Use your platform&apos;s secret store. Never check them into git, even
        in <span className="azk-inline-code">.env.example</span> files —
        leave those values empty.
      </Callout>

      <h2 id="bootstrap-check">Bootstrap validation</h2>
      <p>
        At startup the server logs a one-line summary of which variables
        are present (never the values), then exits with code 1 if any
        required variable is missing. Watch the logs on first deploy:
      </p>
      <CodeBlock
        code={`AfricaZK backend starting
✓ DOJAH_AUTH      set
✓ DOJAH_APP_ID    set
✓ AFRICAZK_PRIVATE_KEY  set (32 bytes)
✓ AFRICAZK_PROGRAM_ID   set
listening on :3001`}
        lang="bash"
        filename="startup log"
      />
    </DocPage>
  );
}
