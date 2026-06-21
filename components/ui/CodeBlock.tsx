"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { highlight } from "@/lib/highlight";

export type CodeTab = {
  label: string;
  lang?: string;
  code: string;
};

type CodeBlockProps =
  | {
      code: string;
      lang?: string;
      filename?: string;
      tabs?: undefined;
      className?: string;
      showLineNumbers?: boolean;
    }
  | {
      tabs: CodeTab[];
      filename?: string;
      code?: undefined;
      lang?: undefined;
      className?: string;
      showLineNumbers?: boolean;
    };

export default function CodeBlock(props: CodeBlockProps) {
  const isTabbed = "tabs" in props && Array.isArray(props.tabs);
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  const tabs: CodeTab[] = isTabbed
    ? props.tabs!
    : [{ label: props.lang ?? "code", lang: props.lang, code: props.code! }];
  const current = tabs[active];

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(current.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const lines = current.code.replace(/\n$/, "").split("\n");

  return (
    <div
      className={`group relative overflow-hidden rounded-md border border-border bg-bg-code shadow-card ${props.className ?? ""}`}
    >
      {/* Header strip */}
      <div className="flex items-center justify-between border-b border-border bg-bg-card/60 px-4 py-2">
        <div className="flex items-center gap-2">
          {isTabbed ? (
            tabs.map((t, i) => (
              <button
                key={t.label}
                onClick={() => setActive(i)}
                className={`relative rounded px-2.5 py-1 font-mono text-[12px] transition-colors duration-150 ${
                  active === i
                    ? "text-text-primary"
                    : "text-text-muted hover:text-text-secondary"
                }`}
              >
                {t.label}
                {active === i && (
                  <span className="absolute inset-x-2 -bottom-[9px] h-px bg-green" />
                )}
              </button>
            ))
          ) : (
            <span className="font-mono text-[11px] uppercase tracking-widest text-text-muted">
              {props.filename ?? current.lang ?? "code"}
            </span>
          )}
        </div>
        <button
          onClick={onCopy}
          aria-label="Copy code"
          className="flex items-center gap-1 rounded px-2 py-1 text-[11px] text-text-muted opacity-0 transition-all duration-150 hover:bg-bg-card hover:text-text-primary group-hover:opacity-100"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green" />
              <span className="text-green">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-[1.7]">
        <code className="block whitespace-pre">
          {props.showLineNumbers ? (
            <span className="grid grid-cols-[auto_1fr] gap-x-4">
              {lines.map((ln, i) => (
                <span key={i} className="contents">
                  <span className="select-none text-right text-text-muted/60">
                    {i + 1}
                  </span>
                  <span>{highlight(ln + (i < lines.length - 1 ? "\n" : ""), current.lang ?? "ts")}</span>
                </span>
              ))}
            </span>
          ) : (
            highlight(current.code, current.lang ?? "ts")
          )}
        </code>
      </pre>
    </div>
  );
}
