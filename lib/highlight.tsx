import type { ReactNode } from "react";

/**
 * Tiny token-based highlighter tuned to the AfricaZK palette.
 * Handles ts/tsx/js/jsx/json/bash/text. Not a full parser — good enough
 * for hand-curated code samples in the marketing site and docs.
 *
 *   Keywords  → --color-purple
 *   Strings   → --color-green
 *   Comments  → --color-text-muted
 *   Functions → --color-blue
 *   Variables → --color-text-primary
 *   Numbers   → --color-text-code
 */

type Token = { text: string; cls: string };

const TS_KEYWORDS = new Set([
  "import",
  "from",
  "export",
  "default",
  "const",
  "let",
  "var",
  "function",
  "async",
  "await",
  "return",
  "if",
  "else",
  "for",
  "while",
  "do",
  "switch",
  "case",
  "break",
  "continue",
  "try",
  "catch",
  "finally",
  "throw",
  "new",
  "this",
  "class",
  "extends",
  "implements",
  "interface",
  "type",
  "enum",
  "namespace",
  "public",
  "private",
  "protected",
  "readonly",
  "static",
  "in",
  "of",
  "typeof",
  "instanceof",
  "as",
  "true",
  "false",
  "null",
  "undefined",
  "void",
  "any",
  "string",
  "number",
  "boolean",
  "Promise",
]);

const BASH_KEYWORDS = new Set([
  "npm",
  "npx",
  "pnpm",
  "yarn",
  "bun",
  "node",
  "cd",
  "ls",
  "cp",
  "mv",
  "rm",
  "mkdir",
  "echo",
  "export",
  "git",
  "cargo",
  "anchor",
  "solana",
]);

const COLOR: Record<string, string> = {
  keyword: "text-purple",
  string: "text-green",
  comment: "text-text-muted italic",
  fn: "text-blue",
  num: "text-text-code",
  plain: "text-text-primary",
  prop: "text-text-code",
  punct: "text-text-secondary",
  tag: "text-purple",
  attr: "text-text-code",
  flag: "text-text-code",
};

function tokenizeTs(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const N = input.length;
  while (i < N) {
    const ch = input[i];
    const two = input.slice(i, i + 2);

    // Line comment
    if (two === "//") {
      const nl = input.indexOf("\n", i);
      const end = nl === -1 ? N : nl;
      tokens.push({ text: input.slice(i, end), cls: COLOR.comment });
      i = end;
      continue;
    }
    // Block comment
    if (two === "/*") {
      const close = input.indexOf("*/", i + 2);
      const end = close === -1 ? N : close + 2;
      tokens.push({ text: input.slice(i, end), cls: COLOR.comment });
      i = end;
      continue;
    }
    // Strings ('"`)
    if (ch === '"' || ch === "'" || ch === "`") {
      const quote = ch;
      let j = i + 1;
      while (j < N) {
        if (input[j] === "\\") {
          j += 2;
          continue;
        }
        if (input[j] === quote) {
          j++;
          break;
        }
        j++;
      }
      tokens.push({ text: input.slice(i, j), cls: COLOR.string });
      i = j;
      continue;
    }
    // Numbers
    if (/[0-9]/.test(ch)) {
      let j = i;
      while (j < N && /[0-9._xXa-fA-F]/.test(input[j])) j++;
      tokens.push({ text: input.slice(i, j), cls: COLOR.num });
      i = j;
      continue;
    }
    // Identifiers / keywords / function calls / properties
    if (/[A-Za-z_$]/.test(ch)) {
      let j = i;
      while (j < N && /[A-Za-z0-9_$]/.test(input[j])) j++;
      const word = input.slice(i, j);
      // peek for function-call paren
      let k = j;
      while (k < N && input[k] === " ") k++;
      const isCall = input[k] === "(";
      // peek for prop access (preceded by ".")
      let prev = i - 1;
      while (prev >= 0 && input[prev] === " ") prev--;
      const isProp = prev >= 0 && input[prev] === ".";

      let cls = COLOR.plain;
      if (TS_KEYWORDS.has(word)) cls = COLOR.keyword;
      else if (isCall) cls = COLOR.fn;
      else if (isProp) cls = COLOR.prop;
      tokens.push({ text: word, cls });
      i = j;
      continue;
    }
    // Punctuation / operators / whitespace — group runs of one type
    let j = i;
    while (j < N && !/[A-Za-z0-9_$"'`\s]/.test(input[j]) && !"/".includes(input[j])) {
      j++;
    }
    if (j === i) {
      // whitespace or fallthrough
      tokens.push({ text: input[i], cls: COLOR.plain });
      i++;
      continue;
    }
    tokens.push({ text: input.slice(i, j), cls: COLOR.punct });
    i = j;
  }
  return tokens;
}

function tokenizeBash(input: string): Token[] {
  const out: Token[] = [];
  const lines = input.split("\n");
  lines.forEach((line, idx) => {
    if (idx > 0) out.push({ text: "\n", cls: COLOR.plain });
    if (line.trim().startsWith("#")) {
      out.push({ text: line, cls: COLOR.comment });
      return;
    }
    // tokens split by spaces, preserving spacing
    const parts = line.split(/( +)/);
    parts.forEach((p, k) => {
      if (/^\s+$/.test(p)) {
        out.push({ text: p, cls: COLOR.plain });
        return;
      }
      if (p.startsWith("--") || p.startsWith("-")) {
        out.push({ text: p, cls: COLOR.flag });
        return;
      }
      if (p.startsWith("'") || p.startsWith('"')) {
        out.push({ text: p, cls: COLOR.string });
        return;
      }
      if (k === 0 && BASH_KEYWORDS.has(p)) {
        out.push({ text: p, cls: COLOR.keyword });
        return;
      }
      // subcommand right after a known command
      const prev = parts[k - 2];
      if (prev && BASH_KEYWORDS.has(prev)) {
        out.push({ text: p, cls: COLOR.fn });
        return;
      }
      out.push({ text: p, cls: COLOR.plain });
    });
  });
  return out;
}

function tokenizeJson(input: string): Token[] {
  // JSON ≈ ts subset; reuse ts tokenizer for clean output
  return tokenizeTs(input);
}

export function highlight(code: string, lang: string = "ts"): ReactNode {
  let tokens: Token[];
  switch (lang) {
    case "bash":
    case "sh":
    case "shell":
      tokens = tokenizeBash(code);
      break;
    case "json":
      tokens = tokenizeJson(code);
      break;
    case "text":
    case "plain":
      tokens = [{ text: code, cls: COLOR.plain }];
      break;
    default:
      tokens = tokenizeTs(code);
  }
  return tokens.map((t, i) => (
    <span key={i} className={t.cls}>
      {t.text}
    </span>
  ));
}
