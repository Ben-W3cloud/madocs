import { highlight } from "@/lib/highlight";

export default function FunctionSignature({ code }: { code: string }) {
  return (
    <div className="my-5 overflow-hidden rounded-md border border-border bg-bg-code">
      <pre className="overflow-x-auto p-5 font-mono text-[13.5px] leading-[1.7]">
        <code className="block whitespace-pre">{highlight(code, "ts")}</code>
      </pre>
    </div>
  );
}
