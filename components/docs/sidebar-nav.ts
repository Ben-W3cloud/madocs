export type DocsLink = { label: string; href: string };
export type DocsSection = { title: string; items: DocsLink[] };

export const DOCS_NAV: DocsSection[] = [
  {
    title: "Getting Started",
    items: [
      { label: "Introduction", href: "/docs/introduction" },
      { label: "Quick Start", href: "/docs/quick-start" },
      { label: "Installation", href: "/docs/installation" },
      { label: "Your First Integration", href: "/docs/your-first-integration" },
    ],
  },
  {
    title: "Core Concepts",
    items: [
      { label: "What is ZK Identity?", href: "/docs/core-concepts/what-is-zk" },
      { label: "How AfricaZK Works", href: "/docs/core-concepts/how-it-works" },
      { label: "The Circuit", href: "/docs/core-concepts/the-circuit" },
      { label: "The Anchor Program", href: "/docs/core-concepts/anchor-program" },
      { label: "NullifierRecord", href: "/docs/core-concepts/nullifier-record" },
      { label: "AttestationRecord", href: "/docs/core-concepts/attestation-record" },
    ],
  },
  {
    title: "SDK Reference",
    items: [
      { label: "verifyIdentity()", href: "/docs/sdk/verify-identity" },
      { label: "generateProof()", href: "/docs/sdk/generate-proof" },
      { label: "submitProof()", href: "/docs/sdk/submit-proof" },
      { label: "checkAttestation()", href: "/docs/sdk/check-attestation" },
      { label: "wipeCredential()", href: "/docs/sdk/wipe-credential" },
      { label: "TypeScript Types", href: "/docs/sdk/types" },
    ],
  },
  {
    title: "Server Reference",
    items: [
      { label: "POST /api/verify", href: "/docs/backend/verify-endpoint" },
      { label: "EdDSA Signing", href: "/docs/backend/eddsa-signing" },
      { label: "Dojah Integration", href: "/docs/backend/dojah-integration" },
      { label: "Environment Variables", href: "/docs/backend/environment-variables" },
    ],
  },
  {
    title: "Guides",
    items: [
      { label: "Integrating with Next.js", href: "/docs/guides/nextjs" },
      { label: "Integrating with React", href: "/docs/guides/react" },
      { label: "Handling Verification States", href: "/docs/guides/verification-states" },
      { label: "Error Handling", href: "/docs/guides/error-handling" },
      { label: "Testing with Mock SDK", href: "/docs/guides/mock-sdk" },
    ],
  },
  {
    title: "Security",
    items: [
      { label: "Privacy Guarantees", href: "/docs/security/privacy" },
      { label: "Threat Model", href: "/docs/security/threat-model" },
      { label: "What We Store", href: "/docs/security/what-we-store" },
    ],
  },
  {
    title: "Reference",
    items: [
      { label: "Circuit Specification", href: "/docs/reference/circuit-spec" },
      { label: "PDA Seeds", href: "/docs/reference/pda-seeds" },
      { label: "Error Codes", href: "/docs/reference/error-codes" },
      { label: "Changelog", href: "/docs/reference/changelog" },
    ],
  },
];

export function flatLinks(): DocsLink[] {
  return DOCS_NAV.flatMap((s) => s.items);
}

export function findPrevNext(href: string): {
  prev?: DocsLink;
  next?: DocsLink;
} {
  const list = flatLinks();
  const i = list.findIndex((l) => l.href === href);
  return {
    prev: i > 0 ? list[i - 1] : undefined,
    next: i >= 0 && i < list.length - 1 ? list[i + 1] : undefined,
  };
}
