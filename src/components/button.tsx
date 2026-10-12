import type { ReactNode } from "react";
import { Button as EmailButton, Section } from "@react-email/components";
import { useEmail } from "./context.js";
import { safeUrl } from "./theme.js";

/** Call to action in the brand color; the label turns white or black for contrast. */
export function Button({ href, children, align = "left" }: { href: string; children: ReactNode; align?: "left" | "center" }) {
  const { brand } = useEmail();
  return (
    <Section style={{ padding: "8px 0 24px", textAlign: align }}>
      <EmailButton
        href={safeUrl(href)}
        target="_blank"
        style={{
          backgroundColor: brand.color,
          color: brand.onColor,
          fontSize: 16,
          fontWeight: 600,
          lineHeight: "20px",
          padding: "12px 24px",
          borderRadius: 6,
          textDecoration: "none",
          display: "inline-block",
        }}
      >
        {children}
      </EmailButton>
    </Section>
  );
}
