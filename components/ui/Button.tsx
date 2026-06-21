import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Size = "sm" | "md" | "lg";
type Variant = "primary" | "outline" | "ghost";

const SIZE_CLASS: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-5 text-[14px]",
  lg: "h-14 px-7 text-[15px]",
};

const VARIANT_CLASS: Record<Variant, string> = {
  primary:
    "relative overflow-hidden bg-green text-bg-base font-semibold shadow-green hover:shadow-green-strong hover:brightness-110 azk-shimmer",
  outline:
    "border border-green/60 text-green hover:bg-green/10 hover:border-green",
  ghost:
    "text-text-secondary hover:text-text-primary hover:bg-bg-card border border-transparent",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium tracking-tight transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

type ButtonAsButton = CommonProps &
  ComponentPropsWithoutRef<"button"> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  ComponentPropsWithoutRef<"a"> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export default function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    className = "",
    children,
    ...rest
  } = props;

  const cls = `${BASE} ${SIZE_CLASS[size]} ${VARIANT_CLASS[variant]} ${className}`;

  if ("href" in props && props.href) {
    const { href, ...anchorRest } = rest as ComponentPropsWithoutRef<"a"> & {
      href: string;
    };
    const isExternal = /^https?:\/\//.test(href);
    if (isExternal) {
      return (
        <a
          href={href}
          className={cls}
          target="_blank"
          rel="noreferrer"
          {...anchorRest}
        >
          <span className="relative z-10 inline-flex items-center gap-2">
            {children}
          </span>
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...anchorRest}>
        <span className="relative z-10 inline-flex items-center gap-2">
          {children}
        </span>
      </Link>
    );
  }

  const buttonRest = rest as ComponentPropsWithoutRef<"button">;
  return (
    <button className={cls} {...buttonRest}>
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </button>
  );
}
