import { Fragment, type ReactNode } from "react";
import { colors, monoStack, safeUrl } from "./theme.js";

export type RichValues = Record<string, string | number>;

const TOKEN = /\*\*([^*\n]+)\*\*|`([^`\n]+)`|\[([^\]\n]+)\]\(([^)\s]+)\)|\n/g;

/** Replaces {key} with values[key]. A missing key is a bug in the template, so it throws. */
function fill(text: string, values: RichValues): string {
  return text.replace(/\{(\w+)\}/g, (_m, key: string) => {
    const v = values[key];
    if (v === undefined || v === null) throw new Error(`Missing value for {${key}}`);
    return String(v);
  });
}

export const codeStyle = {
  fontFamily: monoStack,
  fontSize: 14,
  backgroundColor: colors.codeBg,
  borderRadius: 4,
  padding: "2px 4px",
  wordBreak: "break-all",
} as const;

/**
 * Tiny rich text: **bold**, `code`, [label](url) and line breaks. The markup is parsed on the
 * static copy first and only then {placeholders} are filled, so values coming from your data are
 * always plain text (a customer named "**x**" shows the asterisks, and React escapes HTML).
 */
export function rich(text: string, values: RichValues = {}, linkColor: string = colors.text): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of text.matchAll(TOKEN)) {
    const at = m.index ?? 0;
    if (at > last) out.push(<Fragment key={key++}>{fill(text.slice(last, at), values)}</Fragment>);
    if (m[1] !== undefined) out.push(<strong key={key++}>{fill(m[1], values)}</strong>);
    else if (m[2] !== undefined)
      out.push(
        <code key={key++} className="e-code" style={codeStyle}>
          {fill(m[2], values)}
        </code>,
      );
    else if (m[3] !== undefined && m[4] !== undefined)
      out.push(
        <a key={key++} href={safeUrl(fill(m[4], values))} target="_blank" style={{ color: linkColor, textDecoration: "underline" }}>
          {fill(m[3], values)}
        </a>,
      );
    else out.push(<br key={key++} />);
    last = at + m[0].length;
  }
  if (last < text.length) out.push(<Fragment key={key++}>{fill(text.slice(last), values)}</Fragment>);
  return out;
}
