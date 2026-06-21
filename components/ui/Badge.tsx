import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  dot?: boolean;
  dotColor?: "green" | "purple" | "blue";
  className?: string;
};

const DOT_COLOR: Record<NonNullable<BadgeProps["dotColor"]>, string> = {
  green: "bg-green",
  purple: "bg-purple",
  blue: "bg-blue",
};

export default function Badge({
  children,
  dot = false,
  dotColor = "green",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`group inline-flex items-center gap-2 rounded-full border border-border bg-bg-card/80 px-3 py-1.5 text-[12px] font-medium text-text-secondary backdrop-blur-sm transition-all duration-200 hover:scale-[1.03] hover:border-border-bright hover:text-text-primary ${className}`}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full ${DOT_COLOR[dotColor]} opacity-60`}
          />
          <span
            className={`relative inline-flex h-2 w-2 rounded-full ${DOT_COLOR[dotColor]}`}
            style={{ animation: "var(--animate-pulse-dot)" }}
          />
        </span>
      )}
      <span className="tracking-tight">{children}</span>
    </span>
  );
}
