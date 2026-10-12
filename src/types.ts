/** Language of the copy. "pt" renders Brazilian Portuguese (lang="pt-BR"), "en" renders English. */
export type Lang = "pt" | "en";

/** Who is sending the email. Shown in the header and in the footer; `color` paints buttons and links. */
export type Brand = {
  /** Company name, e.g. "Loja Aurora". */
  name: string;
  /** Absolute URL of a logo image (PNG or JPG; SVG does not show in several mail apps). Shown 40 px tall. */
  logoUrl?: string;
  /** Hex color like "#C2410C" for buttons and links. Text on the button turns white or black for contrast. */
  color?: string;
  /** Mailing address or any other line under the company name in the footer. */
  address?: string;
};

/** Props every template accepts. */
export type BaseTemplateProps = {
  /** Language of the copy (default "pt"). */
  lang?: Lang;
  /** Sender identity. Without it the header and footer say "Sua empresa" / "Your company". */
  brand?: Brand;
  /**
   * Replaces the line in the footer that explains why the person got the email. Accepts the same
   * tiny rich text as the body: **bold**, `code`, [link](https://...) and line breaks.
   */
  footerNote?: string;
};

export type TemplateCategory = "account" | "billing" | "commerce";
export type TemplateStream = "transactional" | "marketing";

/** Normalizes anything that is not "en" to "pt". */
export function toLang(lang: string | undefined | null): Lang {
  return lang === "en" ? "en" : "pt";
}

/** First non-blank string, or the fallback. */
export function orFallback(value: string | undefined | null, fallback: string): string {
  const v = value?.trim();
  return v ? v : fallback;
}
