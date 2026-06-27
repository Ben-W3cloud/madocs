import Link from "next/link";
import Logo from "@/components/shared/Logo";

const PROTOCOL = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Architecture", href: "/#protocol" },
  { label: "Security", href: "/docs/security/privacy" },
  { label: "Privacy Policy", href: "/docs/security/privacy" },
];
const DEVELOPERS = [
  { label: "Documentation", href: "/docs/introduction" },
  { label: "SDK Reference", href: "/docs/sdk/verify-identity" },
  { label: "GitHub", href: "#" },
  { label: "NPM Package", href: "#" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-bg-base px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl opacity-80">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Logo size="header" href={null} />
            <p className="mt-4 max-w-[260px] text-[13.5px] leading-[1.6] text-text-secondary">
              Africa&apos;s first ZK Identity Engine on Solana.
            </p>
            <p className="mt-2 text-[13.5px] text-text-muted">
              Verify once. Access everything.
            </p>
          </div>

          <FooterColumn title="Protocol" items={PROTOCOL} />
          <FooterColumn title="Developers" items={DEVELOPERS} />

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">
              Built
            </p>
            <ul className="mt-4 space-y-2 text-[13.5px] text-text-secondary">
              <li>On The Solana Blockchain</li>
              <li>With Zero-Knowledge Cryptography</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-6 text-[12.5px] text-text-muted md:flex-row">
          <p>© 2025 AfricaZK · MIT License · Built at Hack4FUTO</p>
          <Logo size="footer" href={null} />
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">
        {title}
      </p>
      <ul className="mt-4 space-y-2">
        {items.map((it) => (
          <li key={it.label}>
            <Link
              href={it.href}
              className="text-[13.5px] text-text-secondary transition-colors duration-150 hover:text-text-primary"
            >
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
