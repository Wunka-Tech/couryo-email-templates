import type { ReactNode } from "react";
import { Body, Container, Head, Html, Img, Preview, Section, Text } from "@react-email/components";
import type { Brand, Lang } from "../types.js";
import { EmailContext } from "./context.js";
import { Divider } from "./divider.js";
import { Footer } from "./footer.js";
import { EMAIL_WIDTH, PAD, colors, darkColors, fontStack, resolveBrand } from "./theme.js";

// Dark mode: apps that honor prefers-color-scheme (Apple Mail, iOS, some webmails) get these
// overrides; Outlook.com uses the [data-ogsc] (text) and [data-ogsb] (background) hooks.
// Everything else keeps the light version, which is readable everywhere.
const darkBackgrounds = (scope: string) =>
  `${scope}.e-bg{background:${darkColors.page} !important;}` +
  `${scope}.e-card{background:${darkColors.card} !important;}` +
  `${scope}.e-code{background:${darkColors.codeBg} !important;border-color:${darkColors.border} !important;}`;

const darkTexts = (scope: string) =>
  `${scope}.e-text{color:${darkColors.text} !important;}` +
  `${scope}.e-muted,${scope}.e-muted a{color:${darkColors.muted} !important;}` +
  `${scope}.e-code{color:${darkColors.text} !important;}` +
  `${scope}.e-hr{border-color:${darkColors.border} !important;}` +
  `${scope}.e-rows,${scope}.e-rows td{border-color:${darkColors.border} !important;}`;

const css =
  "body{margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}" +
  // No global border-collapse: it makes browsers ignore the padding of React Email's Section tables.
  "img{-ms-interpolation-mode:bicubic;}" +
  "@media only screen and (max-width:620px){.e-px{padding-left:20px !important;padding-right:20px !important;}}" +
  `@media (prefers-color-scheme:dark){${darkBackgrounds("")}${darkTexts("")}}` +
  darkBackgrounds("[data-ogsb] ") +
  darkTexts("[data-ogsc] ");

export type LayoutProps = {
  lang: Lang;
  brand?: Brand;
  /** Goes into <title>, which some apps and screen readers announce. */
  subject: string;
  /** Hidden line most mail apps show after the subject in the inbox list. */
  preview: string;
  /** Why the person got this email (rich text). */
  note: string;
  children: ReactNode;
};

/** 600 px card on a light page, header with logo or company name, footer with company and note. */
export function Layout({ lang, brand, subject, preview, note, children }: LayoutProps) {
  const b = resolveBrand(brand, lang);
  return (
    <EmailContext.Provider value={{ lang, brand: b }}>
      <Html lang={lang === "pt" ? "pt-BR" : "en"} dir="ltr">
        <Head>
          <title>{subject}</title>
          <meta name="color-scheme" content="light dark" />
          <meta name="supported-color-schemes" content="light dark" />
          <style dangerouslySetInnerHTML={{ __html: css }} />
        </Head>
        <Preview>{preview}</Preview>
        <Body className="e-bg" style={{ backgroundColor: colors.page, fontFamily: fontStack, color: colors.text, margin: 0, padding: 0 }}>
          {/* Body copies its style to an inner cell the dark rules cannot reach, so the page color lives here too. */}
          <Section className="e-bg" style={{ backgroundColor: colors.page, padding: "24px 12px" }}>
          <Container className="e-card" style={{ width: "100%", maxWidth: EMAIL_WIDTH, backgroundColor: colors.card, borderRadius: 8 }}>
            <Section className="e-px" style={{ padding: `32px ${PAD}px 8px` }}>
              {b.logoUrl ? (
                <Img src={b.logoUrl} alt={b.name} height={40} style={{ display: "block", height: 40, width: "auto", maxWidth: 200, border: 0 }} />
              ) : (
                <Text className="e-text" style={{ fontSize: 18, lineHeight: "28px", fontWeight: 700, color: colors.text, margin: 0 }}>
                  {b.name}
                </Text>
              )}
            </Section>
            <Section className="e-px" style={{ padding: `16px ${PAD}px 0` }}>
              {children}
            </Section>
            <Section className="e-px" style={{ padding: `8px ${PAD}px 32px` }}>
              <Divider />
              <Footer note={note} />
            </Section>
          </Container>
          </Section>
        </Body>
      </Html>
    </EmailContext.Provider>
  );
}
