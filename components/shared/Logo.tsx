import Link from "next/link";

type LogoSize = "header" | "hero" | "footer";

const SIZE_PX: Record<LogoSize, number> = {
  header: 22,
  footer: 18,
  hero: 48,
};

type LogoProps = {
  size?: LogoSize;
  href?: string | null;
  className?: string;
};

export default function Logo({
  size = "header",
  href = "/",
  className = "",
}: LogoProps) {
  const inner = (
    <span
      className={`azk-logo inline-flex items-baseline ${className}`}
      style={{ fontSize: `${SIZE_PX[size]}px` }}
      aria-label="AfricaZK"
    >
      <span>Africa</span>
      <span className="zk">ZK</span>
    </span>
  );

  if (!href) return inner;

  return (
    <Link
      href={href}
      className="inline-flex items-baseline rounded-sm outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-green"
    >
      {inner}
    </Link>
  );
}
