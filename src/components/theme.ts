import type { Brand, Lang } from "../types.js";

/** Light palette. Every text color passes WCAG AA on its background. */
export const colors = {
  page: "#F4F4F2",
  card: "#FFFFFF",
  text: "#0E1116",
  muted: "#5B6170",
  border: "#E7E5DF",
  codeBg: "#F3F4F6",
};

/** Dark palette, applied through prefers-color-scheme where the mail app supports it. */
export const darkColors = {
  page: "#0E1116",
  card: "#151922",
  text: "#F3F4F1",
  muted: "#A3A9B6",
  border: "#2A303C",
  codeBg: "#232833",
};

export const DEFAULT_COLOR = "#C2410C";
export const EMAIL_WIDTH = 600;
export const PAD = 40;

export const fontStack = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
export const monoStack = "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace";

export function isHexColor(v: string | null | undefined): v is string {
  return !!v && /^#[0-9a-fA-F]{6}$/.test(v);
}

/** Text color that stays readable on a background (WCAG relative luminance). */
export function readableOn(hex: string): string {
  const c = isHexColor(hex) ? hex : DEFAULT_COLOR;
  const [r, g, b] = [1, 3, 5].map((i) => {
    const v = parseInt(c.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  // Contrast with white vs. with near-black: pick the higher one.
  return 1.05 / (lum + 0.05) >= (lum + 0.05) / 0.0556 ? "#FFFFFF" : "#111111";
}

/** Only http(s), mailto and tel links pass; anything else (javascript:, data:) becomes "#". */
export function safeUrl(raw: string | undefined | null): string {
  const url = (raw ?? "").trim();
  return /^(https?:\/\/|mailto:|tel:)/i.test(url) ? url : "#";
}

export type ResolvedBrand = {
  name: string;
  logoUrl: string | null;
  color: string;
  onColor: string;
  address: string | null;
  /** True when the caller gave a company name (copy can then say "your Loja Aurora account"). */
  named: boolean;
};

export function resolveBrand(brand: Brand | undefined, lang: Lang): ResolvedBrand {
  const name = brand?.name?.trim();
  const color = isHexColor(brand?.color) ? brand.color.toUpperCase() : DEFAULT_COLOR;
  const logo = brand?.logoUrl && safeUrl(brand.logoUrl) !== "#" ? brand.logoUrl.trim() : null;
  return {
    name: name || (lang === "pt" ? "Sua empresa" : "Your company"),
    logoUrl: logo,
    color,
    onColor: readableOn(color),
    address: brand?.address?.trim() || null,
    named: !!name,
  };
}
