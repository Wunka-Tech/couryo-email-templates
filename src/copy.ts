import type { BaseTemplateProps, Lang } from "./types.js";

/** Default footer line of the transactional templates. */
export const accountNote: Record<Lang, string> = {
  pt: "Você recebeu este e-mail porque tem uma conta conosco.",
  en: "You got this email because you have an account with us.",
};

/** The caller's footerNote when it has text, otherwise the template default. */
export function noteFor(props: BaseTemplateProps, fallback: string): string {
  const custom = props.footerNote?.trim();
  return custom ? custom : fallback;
}

/** Company name only when the caller gave one (so copy never says "your Your company account"). */
export function companyOf(props: BaseTemplateProps): string | null {
  return props.brand?.name?.trim() || null;
}
