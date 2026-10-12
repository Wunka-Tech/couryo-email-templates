import { Img, Section } from "@react-email/components";
import { colors, safeUrl } from "./theme.js";

/** Pix QR code from an image URL, on a white tile so it stays scannable in dark mode. */
export function QrImage({ src, alt, size = 220 }: { src: string; alt: string; size?: number }) {
  return (
    <Section style={{ padding: "0 0 16px", textAlign: "center" }}>
      <Img
        src={src.startsWith("data:image/") ? src : safeUrl(src)}
        alt={alt}
        width={size}
        height={size}
        style={{ display: "block", margin: "0 auto", backgroundColor: "#FFFFFF", padding: 12, borderRadius: 8, border: `1px solid ${colors.border}` }}
      />
    </Section>
  );
}
