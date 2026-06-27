import type { ReactNode } from "react";

export type Param = {
  name: string;
  type: string;
  required?: boolean;
  description: ReactNode;
};

export default function ParamsTable({ rows }: { rows: Param[] }) {
  return (
    <div className="my-6 overflow-hidden rounded-lg border border-border/50 bg-bg-card">
      <table className="w-full text-left text-[13.5px]">
        <thead className="bg-bg-base/50 text-[11.5px] uppercase tracking-widest text-text-muted">
          <tr>
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Type</th>
            <th className="px-4 py-3 font-semibold">Required</th>
            <th className="px-4 py-3 font-semibold">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r.name}
              className={i % 2 === 1 ? "bg-bg-base/30" : ""}
            >
              <td className="px-4 py-3 align-top font-mono text-text-primary">
                {r.name}
              </td>
              <td className="px-4 py-3 align-top font-mono text-text-code">
                {r.type}
              </td>
              <td className="px-4 py-3 align-top font-mono text-[12px]">
                {r.required ? (
                  <span className="text-green">required</span>
                ) : (
                  <span className="text-text-muted">optional</span>
                )}
              </td>
              <td className="px-4 py-3 align-top text-text-secondary">
                {r.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SimpleTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-border/50 bg-bg-card">
      <table className="w-full text-left text-[13.5px]">
        <thead className="bg-bg-base/50 text-[11.5px] uppercase tracking-widest text-text-muted">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 1 ? "bg-bg-base/30" : ""}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="px-4 py-3 align-top text-text-secondary"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
