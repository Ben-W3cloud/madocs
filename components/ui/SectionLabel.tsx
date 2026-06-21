import type { ReactNode } from "react";

type Color = "green" | "purple" | "blue";

const COLOR: Record<Color, string> = {
  green: "text-green",
  purple: "text-purple",
  blue: "text-blue",
};

export default function SectionLabel({
  children,
  color = "green",
  className = "",
}: {
  children: ReactNode;
  color?: Color;
  className?: string;
}) {
  return (
    <div
      className={`azk-eyebrow ${COLOR[color]} ${className}`}
    >
      <span className="inline-flex items-center gap-2">
        <span
          aria-hidden
          className={`inline-block h-px w-6 ${color === "purple" ? "bg-purple/60" : color === "blue" ? "bg-blue/60" : "bg-green/60"}`}
        />
        {children}
      </span>
    </div>
  );
}
