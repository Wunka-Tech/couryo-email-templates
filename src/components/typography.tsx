import type { ReactNode } from "react";
import { Heading as EmailHeading, Text } from "@react-email/components";
import { useEmail } from "./context.js";
import { rich, type RichValues } from "./rich.js";
import { colors } from "./theme.js";

export function Heading({ children }: { children: ReactNode }) {
  return (
    <EmailHeading as="h1" className="e-text" style={{ fontSize: 26, lineHeight: "34px", fontWeight: 700, color: colors.text, margin: "0 0 16px" }}>
      {children}
    </EmailHeading>
  );
}

export type ParagraphProps = {
  /** Copy with tiny rich text (**bold**, `code`, [link](url), line breaks) and {placeholders}. */
  children: string;
  /** Values for the {placeholders}. Always rendered as plain text. */
  values?: RichValues;
  muted?: boolean;
  align?: "left" | "center";
};

export function Paragraph({ children, values, muted, align = "left" }: ParagraphProps) {
  const { brand } = useEmail();
  return (
    <Text
      className={muted ? "e-muted" : "e-text"}
      style={{
        fontSize: muted ? 14 : 16,
        lineHeight: muted ? "22px" : "26px",
        color: muted ? colors.muted : colors.text,
        textAlign: align,
        margin: "0 0 16px",
      }}
    >
      {rich(children, values, brand.color)}
    </Text>
  );
}
