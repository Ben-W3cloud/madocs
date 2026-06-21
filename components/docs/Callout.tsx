import { AlertTriangle, CheckCircle2, Info, ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";

type Kind = "info" | "warning" | "danger" | "success";

const STYLES: Record<
  Kind,
  { border: string; bg: string; icon: string; iconColor: string }
> = {
  info: {
    border: "border-blue/40",
    bg: "bg-info-tint",
    icon: "Info",
    iconColor: "text-blue",
  },
  warning: {
    border: "border-warning/50",
    bg: "bg-warning-tint",
    icon: "AlertTriangle",
    iconColor: "text-warning",
  },
  danger: {
    border: "border-error/50",
    bg: "bg-error-tint",
    icon: "ShieldAlert",
    iconColor: "text-error",
  },
  success: {
    border: "border-green/40",
    bg: "bg-success-tint",
    icon: "CheckCircle2",
    iconColor: "text-green",
  },
};

export default function Callout({
  kind = "info",
  title,
  children,
}: {
  kind?: Kind;
  title?: string;
  children: ReactNode;
}) {
  const s = STYLES[kind];
  const Icon =
    s.icon === "Info"
      ? Info
      : s.icon === "AlertTriangle"
      ? AlertTriangle
      : s.icon === "ShieldAlert"
      ? ShieldAlert
      : CheckCircle2;
  return (
    <div
      className={`my-6 flex gap-3 rounded-lg border ${s.border} ${s.bg} p-4 backdrop-blur-sm`}
    >
      <Icon className={`mt-0.5 h-4.5 w-4.5 shrink-0 ${s.iconColor}`} />
      <div className="text-[14.5px] leading-[1.7] text-text-secondary">
        {title && (
          <p className={`mb-1 text-[14px] font-semibold ${s.iconColor}`}>
            {title}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
