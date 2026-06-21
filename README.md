# AfricaZK — africazk.io

The marketing site and developer documentation for **AfricaZK**, Africa's first Zero-Knowledge Identity Engine on Solana.

This is a single Next.js 16 + Tailwind v4 project containing two sites under one design system:

- **Marketing** — `/` (nine narrative sections from hero to CTA)
- **Documentation** — `/docs` (~32 reference, guide, and concept pages)

## What AfricaZK is

AfricaZK is a Zero-Knowledge identity protocol on Solana. Any dApp can verify a user is a real, verified Nigerian adult — without ever collecting, storing, or processing the user's personal data. The user verifies once with NIN or BVN, a ZK proof is generated in the browser, and an `AttestationRecord` PDA is written to the user's wallet. Every other dApp reads that PDA and knows the user is verified.

See `app/page.tsx` for the marketing tour or `app/docs/introduction` for the protocol walkthrough.

## Site sections

### Marketing — `app/page.tsx`

| # | Section | Component |
|---|---|---|
| 1 | Hero with cycling visualisation | `Hero` + `HeroVisualCycler` |
| 2 | The Problem | `ProblemSection` |
| 3 | The Solution (six-node flow diagram) | `SolutionSection` |
| 4 | Zero-Knowledge explainer | `ZKExplainer` |
| 5 | For Developers (tabbed code) | `DeveloperSection` |
| 6 | Protocol Architecture (2×2 cards) | `ArchitectureSection` |
| 7 | Trust & Privacy comparison | `TrustSection` |
| 8 | Built for what comes next | `FutureSection` |
| 9 | Final CTA | `CTASection` |

### Docs — `app/docs/`

Sidebar tree:

- **Getting Started** — Introduction, Quick Start, Installation, Your First Integration
- **Core Concepts** — What is ZK Identity, How It Works, The Circuit, The Anchor Program, NullifierRecord, AttestationRecord
- **SDK Reference** — verifyIdentity, generateProof, submitProof, checkAttestation, wipeCredential, TypeScript Types
- **Backend Reference** — POST /api/verify, EdDSA Signing, Dojah Integration, Environment Variables
- **Guides** — Next.js, React, Verification States, Error Handling, Mock SDK
- **Security** — Privacy Guarantees, Threat Model, What We Store
- **Reference** — Circuit Spec, PDA Seeds, Error Codes, Changelog

## Local development

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Hot reload covers everything including docs pages (no MDX — they are TSX so we can embed interactive elements and live code).

## How to add a new docs page

1. Add a route under `app/docs/<segment>/page.tsx`.
2. Wrap content in `<DocPage eyebrow="Section" title="…" href="/docs/<segment>">`.
3. Add the sidebar entry in `components/docs/sidebar-nav.ts` — that drives the sidebar, prev/next, and on-page nav.

Available content primitives:

- `Callout` — `info | warning | danger | success` variants
- `CodeBlock` — single block or tabbed
- `FunctionSignature` — monospaced signature block
- `ParamsTable` and `SimpleTable` — typed reference tables

## Design system

All design tokens are defined CSS-first in `app/globals.css` via Tailwind v4's `@theme` directive — colors, type scale, radii, shadows, and animation tokens. The PROMPT.md palette is mirrored exactly. Read the file once and every utility class makes sense.

Custom utility classes:

- `.azk-card` — glass card with hover transitions
- `.azk-mesh` — animated gradient mesh background
- `.azk-grid` — slowly panning grid overlay
- `.azk-shimmer` — light-sweep keyframe for primary CTAs
- `.azk-underline` — hero word underline draw-in
- `.azk-prose` — applied to docs articles for consistent h2/h3/p/list styling

## Tech stack

- **Next.js 16** (App Router, Turbopack default)
- **React 19**
- **TypeScript** (strict)
- **Tailwind CSS v4** (CSS-first config in `globals.css`)
- **Framer Motion 12** (hero cycler, flow diagram, section entrances)
- **Lucide React 1.x** (non-brand icons)

No heavy UI libraries. No MDX. No markdown for docs — every page is a TSX component so it can embed interactive elements.

## Production build

```bash
npm run build
npm start
```

Builds to 37 static routes. Everything in this site is statically prerendered — no server runtime required.

## Deployment

`vercel.json` is included. Push the repo and Vercel handles the rest.

## Related projects

- AfricaZK SDK — `@africazk/identity` (TODO: link)
- AfricaZK Backend (Dojah + EdDSA signer) — (TODO: link)
- AfricaZK Anchor Program — (TODO: link)
- Demo dApp — (TODO: link)

## License

MIT · Built at Hack4FUTO 2025 · Federal University of Technology Owerri
